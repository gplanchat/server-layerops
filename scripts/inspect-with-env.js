#!/usr/bin/env node

/**
 * Script wrapper pour MCP Inspector qui charge le fichier .env
 * et passe les variables d'environnement au serveur MCP
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Charger le fichier .env
function loadEnvFile() {
  try {
    const envPath = join(projectRoot, '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach((line) => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key) {
          const value = valueParts.join('=').trim();
          // Supprimer les guillemets si présents
          env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('Warning: Could not load .env file:', error.message);
    return {};
  }
}

// Charger les variables d'environnement depuis .env
const envVars = loadEnvFile();

// Fusionner avec les variables d'environnement existantes
// Les variables d'environnement système ont la priorité
const finalEnv = { ...envVars, ...process.env };

// Construire la commande avec les variables d'environnement
const envArgs = Object.entries(finalEnv)
  .filter(([key]) => key.startsWith('LAYEROPS_'))
  .map(([key, value]) => `${key}=${value}`)
  .join(' ');

// Lancer MCP Inspector avec les variables d'environnement
import { spawn } from 'child_process';

const inspectorProcess = spawn('npx', ['@modelcontextprotocol/inspector', 'node', 'dist/index.js'], {
  cwd: projectRoot,
  env: finalEnv,
  stdio: 'inherit',
  shell: true,
});

inspectorProcess.on('error', (error) => {
  console.error('Error starting MCP Inspector:', error);
  process.exit(1);
});

inspectorProcess.on('exit', (code) => {
  process.exit(code || 0);
});

