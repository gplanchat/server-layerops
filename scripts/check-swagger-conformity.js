#!/usr/bin/env node

/**
 * Script de vérification de conformité du client API avec la définition Swagger
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

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

// Extraire les endpoints Swagger
function extractSwaggerEndpoints(swaggerContent) {
  const endpoints = {};
  
  // Méthode simple: chercher tous les patterns "/v1/..." suivis d'une méthode HTTP
  // Utiliser une approche plus simple et robuste
  
  // D'abord, trouver tous les chemins "/v1/..."
  const allPaths = new Set();
  const pathRegex = /"(\/v1\/[^"]+)":\s*\{/g;
  let match;
  
  while ((match = pathRegex.exec(swaggerContent)) !== null) {
    allPaths.add(match[1]);
  }
  
  // Pour chaque chemin, chercher les méthodes HTTP dans un rayon autour
  for (const path of allPaths) {
    const methods = {};
    
    // Chercher toutes les occurrences de ce chemin
    const pathRegex2 = new RegExp(`"${path.replace(/[{}]/g, '\\$&')}":\\s*\\{`, 'g');
    let pathMatch;
    
    while ((pathMatch = pathRegex2.exec(swaggerContent)) !== null) {
      const start = pathMatch.index;
      // Chercher les méthodes HTTP dans les 2000 caractères suivants
      const section = swaggerContent.substring(start, Math.min(start + 2000, swaggerContent.length));
      
      // Extraire les méthodes HTTP
      const methodRegex = /"(get|post|put|patch|delete)":\s*\{/gi;
      let methodMatch;
      
      while ((methodMatch = methodRegex.exec(section)) !== null) {
        const httpMethod = methodMatch[1].toUpperCase();
        const methodStart = methodMatch.index + methodMatch[0].length;
        
        // Trouver l'operationId dans les 500 caractères suivants
        const methodSection = section.substring(methodStart, Math.min(methodStart + 500, section.length));
        const opIdMatch = methodSection.match(/"operationId":\s*"([^"]+)"/);
        if (opIdMatch) {
          methods[httpMethod] = opIdMatch[1];
        }
      }
    }
    
    if (Object.keys(methods).length > 0) {
      endpoints[path] = methods;
    }
  }
  
  return endpoints;
}

// Extraire les méthodes du client API
function extractClientMethods(clientContent) {
  const methods = [];
  
  // Extraire les méthodes async
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

// Extraire le corps d'une méthode
function extractMethodBody(content, startIndex) {
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let i = startIndex;
  
  // Trouver le début de la fonction
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
  
  // Chercher this.request(...) avec template literals
  // Pattern: this.request(`/path/${variable}`) ou this.request('/path', {method: 'POST'})
  // ou let endpoint = ...; this.request(endpoint)
  const requestPattern = /this\.request\(([^,)]+)(?:,\s*\{[^}]*method:\s*['"`]?(\w+))?/g;
  let match;
  
  while ((match = requestPattern.exec(methodBody)) !== null) {
    let endpointStr = match[1].trim();
    const httpMethod = match[2] ? match[2].toUpperCase() : 'GET';
    
    // Nettoyer les quotes et backticks
    endpointStr = endpointStr.replace(/^['"`]|['"`]$/g, '');
    
    // Ignorer si c'est juste "endpoint" (variable)
    if (endpointStr === 'endpoint' || endpointStr.includes('endpoint.') || 
        endpointStr.includes('data.') || endpointStr.includes('args.')) {
      // Essayer de trouver la construction de l'endpoint avant
      const beforeMatch = methodBody.substring(0, match.index);
      // Chercher let endpoint = ... ou const endpoint = ...
      const endpointDefMatch = beforeMatch.match(/(?:let|const)\s+endpoint\s*=\s*([^;]+)/);
      if (endpointDefMatch) {
        endpointStr = endpointDefMatch[1].trim();
        endpointStr = endpointStr.replace(/^['"`]|['"`]$/g, '');
      } else {
        continue; // Ignorer si on ne peut pas trouver la définition
      }
    }
    
    // Si c'est un template literal avec ${variable}, extraire le pattern
    // Ex: `/workspaces/${projectId}/environments` -> `/workspaces/{projectId}/environments`
    if (endpointStr.includes('${')) {
      endpointStr = endpointStr.replace(/\$\{[^}]+\}/g, (match) => {
        // Extraire le nom de la variable si possible
        const varName = match.replace(/\$\{|\}/g, '');
        // Simplifier: remplacer par un placeholder générique
        return '{' + varName + '}';
      });
    }
    
    // Ignorer les endpoints vides ou invalides
    if (endpointStr && endpointStr.length > 1 && !endpointStr.includes('data.') && !endpointStr.includes('args.')) {
      calls.push({
        endpoint: endpointStr,
        method: httpMethod,
      });
    }
  }
  
  return calls;
}

// Normaliser un endpoint pour comparaison
function normalizeEndpoint(endpoint) {
  // Enlever le préfixe /v1/ si présent
  if (endpoint.startsWith('/v1/')) {
    endpoint = endpoint.substring(4);
  }
  // Ajouter / au début si absent
  if (!endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  return endpoint;
}

// Trouver l'endpoint Swagger correspondant
function findSwaggerEndpoint(swaggerEndpoints, clientEndpoint, method) {
  const normalized = normalizeEndpoint(clientEndpoint);
  
  for (const [swaggerPath, methods] of Object.entries(swaggerEndpoints)) {
    const normalizedSwagger = normalizeEndpoint(swaggerPath);
    
    // Correspondance exacte
    if (normalizedSwagger === normalized && methods[method]) {
      return { path: swaggerPath, method, operationId: methods[method] };
    }
    
    // Correspondance avec paramètres (remplacer {param} par .+)
    const swaggerPattern = normalizedSwagger.replace(/\{[^}]+\}/g, '[^/]+');
    const regex = new RegExp(`^${swaggerPattern}$`);
    if (regex.test(normalized) && methods[method]) {
      return { path: swaggerPath, method, operationId: methods[method] };
    }
  }
  
  return null;
}

// Vérifier la conformité
function checkConformity(swaggerEndpoints, clientMethods) {
  const issues = [];
  const coveredEndpoints = new Set();
  
  for (const clientMethod of clientMethods) {
    const calls = analyzeMethodCalls(clientMethod.body);
    
    for (const call of calls) {
      const normalized = normalizeEndpoint(call.endpoint);
      const swaggerMatch = findSwaggerEndpoint(swaggerEndpoints, call.endpoint, call.method);
      
      if (!swaggerMatch) {
        // Chercher si l'endpoint existe avec une autre méthode
        let foundWithOtherMethod = false;
        for (const [swaggerPath, methods] of Object.entries(swaggerEndpoints)) {
          const normalizedSwagger = normalizeEndpoint(swaggerPath);
          const swaggerPattern = normalizedSwagger.replace(/\{[^}]+\}/g, '[^/]+');
          const regex = new RegExp(`^${swaggerPattern}$`);
          
          if (regex.test(normalized)) {
            foundWithOtherMethod = true;
            const availableMethods = Object.keys(methods).join(', ');
            issues.push({
              type: 'WRONG_METHOD',
              method: clientMethod.name,
              endpoint: call.endpoint,
              usedMethod: call.method,
              availableMethods,
              swaggerPath,
            });
            break;
          }
        }
        
        if (!foundWithOtherMethod) {
          issues.push({
            type: 'MISSING_ENDPOINT',
            method: clientMethod.name,
            endpoint: call.endpoint,
            httpMethod: call.method,
          });
        }
      } else {
        coveredEndpoints.add(`${swaggerMatch.path}:${swaggerMatch.method}`);
      }
    }
  }
  
  // Vérifier les endpoints Swagger non utilisés (optionnel, pour information)
  const unusedEndpoints = [];
  for (const [path, methods] of Object.entries(swaggerEndpoints)) {
    if (path.includes('workspace') || path.includes('environment') || 
        path.includes('service') || path.includes('instancePool') ||
        path.includes('event') || path.includes('monitoring') || 
        path.includes('analyze')) {
      for (const [method, opId] of Object.entries(methods)) {
        const key = `${path}:${method}`;
        if (!coveredEndpoints.has(key)) {
          unusedEndpoints.push({ path, method, operationId: opId });
        }
      }
    }
  }
  
  return { issues, unusedEndpoints };
}

// Main
async function main() {
  console.log('🔍 Vérification de la conformité avec Swagger...\n');
  
  try {
    // Télécharger Swagger
    const swaggerContent = await fetchSwagger();
    const swaggerEndpoints = extractSwaggerEndpoints(swaggerContent);
    
    console.log(`✅ ${Object.keys(swaggerEndpoints).length} endpoints trouvés dans Swagger\n`);
    
    // Lire le client API
    const clientPath = join(__dirname, '../src/api/client.ts');
    const clientContent = readFileSync(clientPath, 'utf8');
    const clientMethods = extractClientMethods(clientContent);
    
    console.log(`✅ ${clientMethods.length} méthodes trouvées dans le client API\n`);
    
    // Vérifier la conformité
    const { issues, unusedEndpoints } = checkConformity(swaggerEndpoints, clientMethods);
    
    // Afficher les résultats
    if (issues.length === 0) {
      console.log('✅ Aucun problème de conformité détecté !\n');
    } else {
      console.log(`❌ ${issues.length} problème(s) de conformité détecté(s):\n`);
      
      for (const issue of issues) {
        console.log(`  [${issue.type}] ${issue.method}()`);
        console.log(`    Endpoint: ${issue.endpoint}`);
        if (issue.type === 'WRONG_METHOD') {
          console.log(`    Méthode utilisée: ${issue.usedMethod}`);
          console.log(`    Méthodes disponibles dans Swagger: ${issue.availableMethods}`);
          console.log(`    Endpoint Swagger: ${issue.swaggerPath}`);
        } else {
          console.log(`    Méthode HTTP: ${issue.httpMethod}`);
          console.log(`    ⚠️  Cet endpoint n'existe pas dans Swagger`);
        }
        console.log('');
      }
    }
    
    // Afficher les endpoints Swagger non utilisés (pour information)
    if (unusedEndpoints.length > 0 && issues.length === 0) {
      console.log(`\nℹ️  ${unusedEndpoints.length} endpoint(s) Swagger non utilisé(s) (pour information):\n`);
      for (const endpoint of unusedEndpoints.slice(0, 10)) {
        console.log(`    ${endpoint.method} ${endpoint.path} (${endpoint.operationId})`);
      }
      if (unusedEndpoints.length > 10) {
        console.log(`    ... et ${unusedEndpoints.length - 10} autres`);
      }
    }
    
    // Retourner le code de sortie
    process.exit(issues.length > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();

