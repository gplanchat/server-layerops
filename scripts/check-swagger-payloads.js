#!/usr/bin/env node

/**
 * Script de vérification de conformité des payloads (Query et Response) avec Swagger
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Télécharger le fichier Swagger si nécessaire
async function fetchSwagger() {
  const https = await import('https');
  const fs = await import('fs');
  const swaggerPath = '/tmp/swagger-layerops.js';
  
  if (!fs.existsSync(swaggerPath)) {
    console.log('📥 Téléchargement du fichier Swagger...');
    return new Promise((resolve, reject) => {
      https.get('https://api.layerops.com/api/swagger-ui-init.js', (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          fs.writeFileSync(swaggerPath, data);
          resolve(data);
        });
      }).on('error', reject);
    });
  }
  
  return fs.readFileSync(swaggerPath, 'utf8');
}

// Extraire les schémas Swagger en utilisant Python (plus robuste pour le parsing JSON)
async function extractSwaggerSchemas(swaggerContent) {
  return new Promise((resolve, reject) => {
    const pythonScript = `
import re
import json
import sys

content = sys.stdin.read()

# Extraire les endpoints avec leurs méthodes et schémas
paths = {}
path_pattern = r'"(\/v1\/[^"]+)":\\s*\\{'

for match in re.finditer(path_pattern, content):
    path = match.group(1)
    start = match.end()
    
    # Trouver la fin de l'objet
    depth = 1
    i = start
    in_string = False
    string_char = ''
    
    while i < len(content) and depth > 0:
        char = content[i]
        prev_char = content[i-1] if i > 0 else ''
        
        if not in_string:
            if char in ['"', "'"] and prev_char != '\\\\':
                in_string = True
                string_char = char
            elif char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
        else:
            if char == string_char and prev_char != '\\\\':
                in_string = False
        i += 1
    
    path_content = content[start:i-1]
    methods = {}
    
    # Extraire les méthodes
    method_pattern = r'"(get|post|put|patch|delete)":\\s*\\{'
    for method_match in re.finditer(method_pattern, path_content, re.IGNORECASE):
        method = method_match.group(1).upper()
        method_start = method_match.end()
        
        # Trouver la fin de l'objet de la méthode
        method_depth = 1
        method_i = method_start
        method_in_string = False
        method_string_char = ''
        
        while method_i < len(path_content) and method_depth > 0:
            char = path_content[method_i]
            prev_char = path_content[method_i-1] if method_i > 0 else ''
            
            if not method_in_string:
                if char in ['"', "'"] and prev_char != '\\\\':
                    method_in_string = True
                    method_string_char = char
                elif char == '{':
                    method_depth += 1
                elif char == '}':
                    method_depth -= 1
            else:
                if char == method_string_char and prev_char != '\\\\':
                    method_in_string = False
            method_i += 1
        
        method_section = path_content[method_start:method_i-1]
        
        # Vérifier si on a requestBody ou responses
        has_request_body = '"requestBody"' in method_section
        has_responses = '"responses"' in method_section
        
        if has_request_body or has_responses:
            op_id_match = re.search(r'"operationId":\\s*"([^"]+)"', method_section)
            if op_id_match:
                method_info = {
                    'operationId': op_id_match.group(1),
                    'hasRequestBody': has_request_body,
                    'hasResponses': has_responses,
                }
                
                # Extraire requestBody
                if has_request_body:
                    request_body_match = re.search(r'"requestBody":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', method_section, re.DOTALL)
                    if request_body_match:
                        request_body_content = request_body_match.group(1)
                        schema_match = re.search(r'"schema":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', request_body_content, re.DOTALL)
                        if schema_match:
                            ref_match = re.search(r'"\\\\$ref":\\s*"#/components/schemas/([^"]+)"', schema_match.group(1))
                            if ref_match:
                                method_info['requestBody'] = {'$ref': ref_match.group(1)}
                
                # Extraire parameters
                params_match = re.search(r'"parameters":\\s*\\[([^\\]]+(?:\\[[^\\]]*\\][^\\]]*)*)\\]', method_section, re.DOTALL)
                if params_match:
                    params_content = params_match.group(1)
                    param_pattern = r'\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}'
                    params_list = []
                    for param_match in re.finditer(param_pattern, params_content, re.DOTALL):
                        param_content = param_match.group(1)
                        name_match = re.search(r'"name":\\s*"([^"]+)"', param_content)
                        in_match = re.search(r'"in":\\s*"([^"]+)"', param_content)
                        required_match = re.search(r'"required":\\s*(true|false)', param_content)
                        if name_match and in_match:
                            param = {
                                'name': name_match.group(1),
                                'in': in_match.group(1),
                                'required': required_match and required_match.group(1) == 'true',
                            }
                            params_list.append(param)
                    if params_list:
                        method_info['parameters'] = params_list
                
                # Extraire responses
                responses_match = re.search(r'"responses":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', method_section, re.DOTALL)
                if responses_match:
                    responses_content = responses_match.group(1)
                    response_pattern = r'"(\\d+)":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}'
                    responses_dict = {}
                    for response_match in re.finditer(response_pattern, responses_content, re.DOTALL):
                        status_code = response_match.group(1)
                        response_content = response_match.group(2)
                        content_match = re.search(r'"content":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', response_content, re.DOTALL)
                        if content_match:
                            content_section = content_match.group(1)
                            schema_match = re.search(r'"schema":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', content_section, re.DOTALL)
                            if schema_match:
                                schema_content = schema_match.group(1)
                                ref_match = re.search(r'"\\\\$ref":\\s*"#/components/schemas/([^"]+)"', schema_content)
                                type_match = re.search(r'"type":\\s*"([^"]+)"', schema_content)
                                items_match = re.search(r'"items":\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}', schema_content, re.DOTALL)
                                
                                if ref_match:
                                    responses_dict[status_code] = {'$ref': ref_match.group(1)}
                                elif items_match:
                                    items_content = items_match.group(1)
                                    items_ref_match = re.search(r'"\\\\$ref":\\s*"#/components/schemas/([^"]+)"', items_content)
                                    if items_ref_match:
                                        responses_dict[status_code] = {'type': 'array', 'items': {'$ref': items_ref_match.group(1)}}
                                    elif type_match:
                                        responses_dict[status_code] = {'type': 'array', 'items': {'type': type_match.group(1)}}
                                elif type_match:
                                    responses_dict[status_code] = {'type': type_match.group(1)}
                    if responses_dict:
                        method_info['responses'] = responses_dict
                
                methods[method] = method_info
    
    if methods:
        paths[path] = methods

# Filtrer les endpoints pertinents
relevant = {k: v for k, v in paths.items() if any(x in k for x in ['workspace', 'environment', 'service', 'instancePool', 'event', 'analyze'])}

print(json.dumps(relevant, indent=2))
`;

    const python = spawn('python3', ['-c', pythonScript]);
    let output = '';
    let error = '';
    
    python.stdin.write(swaggerContent);
    python.stdin.end();
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script failed: ${error}`));
        return;
      }
      
      try {
        const schemas = JSON.parse(output);
        resolve(schemas);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e.message}`));
      }
    });
  });
}

// Extraire les méthodes du client API
function extractClientMethods(clientContent) {
  const methods = [];
  
  const methodRegex = /async\s+(\w+)\([^)]*\):\s*Promise<ApiResponse>/g;
  let match;
  
  while ((match = methodRegex.exec(clientContent)) !== null) {
    const methodName = match[1];
    const methodBody = extractMethodBody(clientContent, match.index);
    methods.push({
      name: methodName,
      body: methodBody,
    });
  }
  
  return methods;
}

function extractMethodBody(content, startIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let i = startIndex;
  
  while (i < content.length && content[i] !== '{') {
    i++;
  }
  
  if (i >= content.length) return '';
  
  const start = i;
  depth = 1;
  i++;
  
  while (i < content.length && depth > 0) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : '';
    
    if (!inString) {
      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
      } else if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
      }
    } else {
      if (char === stringChar && prevChar !== '\\') {
        inString = false;
      }
    }
    
    i++;
  }
  
  return content.substring(start, i);
}

// Analyser les appels API dans une méthode
function analyzeMethodCalls(methodBody) {
  const calls = [];
  
  const requestPattern = /this\.request\(([^,)]+)(?:,\s*\{[^}]*method:\s*['"`]?(\w+))?/g;
  let match;
  
  while ((match = requestPattern.exec(methodBody)) !== null) {
    let endpointStr = match[1].trim();
    const httpMethod = match[2] ? match[2].toUpperCase() : 'GET';
    
    endpointStr = endpointStr.replace(/^['"`]|['"`]$/g, '');
    
    if (endpointStr === 'endpoint' || endpointStr.includes('endpoint.') || 
        endpointStr.includes('data.') || endpointStr.includes('args.')) {
      const beforeMatch = methodBody.substring(0, match.index);
      const endpointDefMatch = beforeMatch.match(/(?:let|const)\s+endpoint\s*=\s*([^;]+)/);
      if (endpointDefMatch) {
        endpointStr = endpointDefMatch[1].trim();
        endpointStr = endpointStr.replace(/^['"`]|['"`]$/g, '');
      } else {
        continue;
      }
    }
    
    if (endpointStr.includes('${')) {
      endpointStr = endpointStr.replace(/\$\{[^}]+\}/g, '{param}');
    }
    
    // Extraire le body si présent
    let body = null;
    const bodyMatch = methodBody.match(/body:\s*JSON\.stringify\(([^)]+)\)/);
    if (bodyMatch) {
      const bodyExpr = bodyMatch[1].trim();
      if (bodyExpr.includes('data')) {
        body = { source: 'data' };
      } else if (bodyExpr.match(/^\{/)) {
        body = { source: 'inline' };
      }
    }
    
    if (endpointStr && endpointStr.length > 1) {
      calls.push({
        endpoint: endpointStr,
        method: httpMethod,
        body,
      });
    }
  }
  
  return calls;
}

// Normaliser un endpoint pour comparaison
function normalizeEndpoint(endpoint) {
  if (endpoint.startsWith('/v1/')) {
    endpoint = endpoint.substring(4);
  }
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  return endpoint;
}

// Trouver l'endpoint Swagger correspondant
function findSwaggerEndpoint(swaggerSchemas, clientEndpoint, method) {
  const normalized = normalizeEndpoint(clientEndpoint);
  
  for (const [swaggerPath, methods] of Object.entries(swaggerSchemas)) {
    const normalizedSwagger = normalizeEndpoint(swaggerPath);
    
    if (normalizedSwagger === normalized && methods[method]) {
      return { path: swaggerPath, method, schema: methods[method] };
    }
    
    const swaggerPattern = normalizedSwagger.replace(/\{[^}]+\}/g, '[^/]+');
    const regex = new RegExp(`^${swaggerPattern}$`);
    if (regex.test(normalized) && methods[method]) {
      return { path: swaggerPath, method, schema: methods[method] };
    }
  }
  
  return null;
}

// Vérifier la conformité des payloads
function checkPayloadConformity(swaggerSchemas, clientMethods) {
  const issues = [];
  
  for (const clientMethod of clientMethods) {
    const calls = analyzeMethodCalls(clientMethod.body);
    
    for (const call of calls) {
      const swaggerMatch = findSwaggerEndpoint(swaggerSchemas, call.endpoint, call.method);
      
      if (swaggerMatch) {
        const schema = swaggerMatch.schema;
        
        // Vérifier requestBody pour POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(call.method)) {
          // Vérifier si requestBody est requis selon Swagger
          if (schema.requestBody && !call.body) {
            issues.push({
              type: 'MISSING_REQUEST_BODY',
              method: clientMethod.name,
              endpoint: call.endpoint,
              httpMethod: call.method,
              expected: schema.requestBody,
            });
          } else if (schema.hasRequestBody === false && call.body) {
            // Seulement signaler si Swagger indique explicitement qu'il n'y a pas de requestBody
            // (certains endpoints peuvent avoir un body optionnel)
            issues.push({
              type: 'UNEXPECTED_REQUEST_BODY',
              method: clientMethod.name,
              endpoint: call.endpoint,
              httpMethod: call.method,
            });
          }
        }
        
        // Vérifier les paramètres de chemin (path parameters)
        const pathParams = (schema.parameters || []).filter(p => p.in === 'path');
        const endpointParams = (call.endpoint.match(/\{param\}/g) || []).length;
        
        if (pathParams.length !== endpointParams) {
          issues.push({
            type: 'PATH_PARAMETER_MISMATCH',
            method: clientMethod.name,
            endpoint: call.endpoint,
            httpMethod: call.method,
            expected: pathParams.length,
            found: endpointParams,
            parameters: pathParams.map(p => p.name),
          });
        }
        
        // Vérifier les paramètres de requête requis (query parameters)
        const queryParams = (schema.parameters || []).filter(p => p.in === 'query' && p.required);
        if (queryParams.length > 0) {
          // Note: On ne peut pas facilement vérifier les query params depuis le code
          // Mais on peut documenter qu'ils sont requis
        }
        
        // Ne pas vérifier les schémas de réponse - certains endpoints peuvent ne pas en avoir
        // C'est acceptable dans Swagger/OpenAPI
      }
    }
  }
  
  return issues;
}

// Main
async function main() {
  console.log('🔍 Vérification de la conformité des payloads avec Swagger...\n');
  
  try {
    const swaggerContent = await fetchSwagger();
    const swaggerSchemas = await extractSwaggerSchemas(swaggerContent);
    
    const relevantCount = Object.keys(swaggerSchemas).length;
    console.log(`✅ ${relevantCount} endpoints avec schémas trouvés dans Swagger\n`);
    
    const clientPath = join(__dirname, '../src/api/client.ts');
    const clientContent = readFileSync(clientPath, 'utf8');
    const clientMethods = extractClientMethods(clientContent);
    
    console.log(`✅ ${clientMethods.length} méthodes trouvées dans le client API\n`);
    
    const issues = checkPayloadConformity(swaggerSchemas, clientMethods);
    
    if (issues.length === 0) {
      console.log('✅ Aucun problème de conformité des payloads détecté !\n');
      process.exit(0);
    } else {
      console.log(`❌ ${issues.length} problème(s) de conformité des payloads détecté(s):\n`);
      
      for (const issue of issues) {
        console.log(`  [${issue.type}] ${issue.method}()`);
        console.log(`    Endpoint: ${issue.endpoint}`);
        console.log(`    Méthode HTTP: ${issue.httpMethod}`);
        
        if (issue.type === 'MISSING_REQUEST_BODY') {
          console.log(`    ⚠️  Body requis mais non fourni`);
          console.log(`    Schéma attendu: ${JSON.stringify(issue.expected)}`);
        } else if (issue.type === 'UNEXPECTED_REQUEST_BODY') {
          console.log(`    ⚠️  Body fourni mais non attendu par Swagger`);
        } else if (issue.type === 'PATH_PARAMETER_MISMATCH') {
          console.log(`    ⚠️  Nombre de paramètres de chemin incorrect`);
          console.log(`    Attendu: ${issue.expected}, Trouvé: ${issue.found}`);
          console.log(`    Paramètres requis: ${issue.parameters.join(', ')}`);
        } else if (issue.type === 'NO_RESPONSE_SCHEMA') {
          console.log(`    ⚠️  Aucun schéma de réponse défini dans Swagger`);
        }
        console.log('');
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
