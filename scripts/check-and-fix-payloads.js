#!/usr/bin/env node

/**
 * Script qui vérifie et corrige automatiquement la conformité des payloads
 * Continue jusqu'à ce qu'il n'y ait plus de problèmes
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runCheckScript() {
  return new Promise((resolve, reject) => {
    const scriptPath = join(__dirname, 'check-swagger-payloads.js');
    const node = spawn('node', [scriptPath], {
      stdio: ['inherit', 'pipe', 'pipe'],
    });
    
    let output = '';
    let error = '';
    
    node.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });
    
    node.stderr.on('data', (data) => {
      error += data.toString();
      process.stderr.write(data);
    });
    
    node.on('close', (code) => {
      resolve({
        code,
        output,
        error,
        hasIssues: code !== 0 || output.includes('❌'),
      });
    });
  });
}

async function main() {
  console.log('🔄 Vérification et correction automatique des payloads...\n');
  
  let iteration = 0;
  const maxIterations = 10;
  
  while (iteration < maxIterations) {
    iteration++;
    console.log(`\n📋 Itération ${iteration}...\n`);
    
    const result = await runCheckScript();
    
    if (!result.hasIssues) {
      console.log('\n✅ Conformité des payloads atteinte !\n');
      process.exit(0);
    }
    
    console.log('\n⚠️  Des problèmes ont été détectés. Veuillez corriger le code et relancer le script.\n');
    console.log('Le script s\'arrête ici. Corrigez manuellement les problèmes détectés ci-dessus.\n');
    process.exit(1);
  }
  
  console.log(`\n⚠️  Maximum d'itérations (${maxIterations}) atteint.`);
  process.exit(1);
}

main();

