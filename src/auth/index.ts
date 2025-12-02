/**
 * Gestion de l'authentification LayerOps
 * Supporte actuellement les tokens API, préparé pour OAuth2
 */

import type { LayerOpsConfig } from '../types/index.js';

export interface AuthProvider {
  getAuthHeaders(): Record<string, string>;
}

/**
 * Provider d'authentification par token API
 */
export class TokenAuthProvider implements AuthProvider {
  private apiKeyId: string;
  private apiKeySecret: string;

  constructor(config: LayerOpsConfig) {
    this.apiKeyId = config.apiKeyId;
    this.apiKeySecret = config.apiKeySecret;
  }

  getAuthHeaders(): Record<string, string> {
    return {
      'X-API-KEY': `${this.apiKeyId}:${this.apiKeySecret}`,
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Provider d'authentification OAuth2 (pour usage futur)
 */
export class OAuth2AuthProvider implements AuthProvider {
  private accessToken: string;
  private refreshToken?: string;
  private tokenExpiry?: Date;

  constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async refreshAccessToken(): Promise<void> {
    // Implémentation future pour le refresh token OAuth2
    throw new Error('OAuth2 refresh not yet implemented');
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiry) return false;
    return new Date() >= this.tokenExpiry;
  }
}

/**
 * Factory pour créer le provider d'authentification approprié
 */
export function createAuthProvider(config: LayerOpsConfig): AuthProvider {
  // Pour l'instant, on utilise toujours TokenAuthProvider
  // À l'avenir, on pourra détecter le type d'auth requis
  return new TokenAuthProvider(config);
}

