export interface OAuthProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  borderColor: string;
  glowColor: string;
  defaultScopes: string[];
  docUrl: string;
}

export type WebFramework = 'axum' | 'actix' | 'poem' | 'raw';

export interface CodeConfig {
  provider: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
  framework: WebFramework;
  usePkce: boolean;
  validateState: boolean;
  features: string[];
}

export interface SimulationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'success' | 'error';
  details?: string;
}
