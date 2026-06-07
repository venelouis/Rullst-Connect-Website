import React, { useState } from 'react';
import { 
  CodeConfig, 
  WebFramework 
} from '../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Sliders, 
  FileCode, 
  Layers, 
  Cpu, 
  Flame,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface CodeGeneratorProps {
  config: CodeConfig;
  onChangeConfig: (newConfig: CodeConfig) => void;
}

export default function CodeGenerator({ config, onChangeConfig }: CodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'cargo'>('main');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = activeTab === 'main' ? generateRustMainCode() : generateCargoToml();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateParam = (key: keyof CodeConfig, value: any) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  // Capitalize the provider formatted for Rust Structs (e.g., Google, Github, Discord)
  const getProviderStructName = () => {
    const p = config.provider;
    if (p === 'github') return 'Github';
    if (p === 'twitter') return 'Twitter';
    if (p === 'keycloak') return 'Keycloak';
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  const getFeaturesString = () => {
    const defaultFeat = [config.provider];
    if (config.usePkce) defaultFeat.push('pkce');
    return defaultFeat.map(f => `"${f}"`).join(', ');
  };

  const generateCargoToml = () => {
    return `[package]
name = "rullst_auth_app"
version = "0.1.0"
edition = "2021"

[dependencies]
rullst-connect = { version = "0.1.0", features = [${getFeaturesString()}] }
tokio = { version = "1.35", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
${config.framework === 'axum' ? 'axum = "0.7"\ntower-http = { version = "0.5", features = ["fs", "cors"] }' : ''}${config.framework === 'actix' ? 'actix-web = "4.4"' : ''}${config.framework === 'poem' ? 'poem = "1.3"' : ''}`;
  };

  const generateRustMainCode = () => {
    const structName = getProviderStructName();
    const formattedScopes = config.scopes.map(s => `"${s}"`).join(', ');
    
    // Generates localized codes depending on frameworks
    switch (config.framework) {
      case 'axum':
        return `// main.rs - Rullst Connect + Axum Framework Integration
use axum::{
    extract::{Query, State},
    response::{Redirect, IntoResponse},
    routing::get,
    Router,
};
use rullst_connect::{
    providers::${structName},
    ClientConfig, OAuth2Client, TokenResponse,
};
use serde::Deserialize;
use std::sync::Arc;

struct AppState {
    oauth_client: OAuth2Client<${structName}>,
}

#[tokio::main]
async fn main() {
    // 1. Configure the Client Parameters
    let client_config = ClientConfig::new(
        "${config.clientId || 'YOUR_CLIENT_ID'}".to_string(),
        "${config.clientSecret || 'YOUR_CLIENT_SECRET'}".to_string(),
        "${config.redirectUri || 'http://localhost:3000/auth/callback'}".to_string(),
    );

    let oauth_client = OAuth2Client::new(${structName}, client_config);
    let app_state = Arc::new(AppState { oauth_client });

    // 2. Set up Axum Endpoints
    let app = Router::new()
        .route("/auth/login", get(login_handler))
        .route("/auth/callback", get(callback_handler))
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

// 3. Initiate the Redirect Flow
async fn login_handler(State(state): State<Arc<AppState>>) -> Redirect {
    let mut auth_request = state.oauth_client
        .auth_url()
        .with_scopes(vec![${formattedScopes}]);

    ${config.validateState ? `// SECURE: Inject CSRF Token Validation
    let csrf_state = "crypto_secure_state_token_here";
    auth_request = auth_request.with_state(csrf_state);` : ''}

    ${config.usePkce ? `// SECURE: Initialize PKCE (Proof Key for Code Exchange)
    let code_verifier = "random_pkce_code_verification_string_here_50_chars";
    auth_request = auth_request.with_pkce_verifier(code_verifier);` : ''}

    let target_url = auth_request.generate();
    Redirect::to(&target_url)
}

#[derive(Deserialize)]
struct CallbackParams {
    code: String,
    ${config.validateState ? 'state: String,' : ''}
}

// 4. Handle OAuth Callback & Get User Stats
async fn callback_handler(
    State(state): State<Arc<AppState>>,
    Query(params): Query<CallbackParams>,
) -> impl IntoResponse {
    ${config.validateState ? `// Check state alignment to avoid CSRF hijack
    if params.state != "crypto_secure_state_token_here" {
        return "Error: CSRF State Mismatch!".into_response();
    }` : ''}

    // Exchange Authentication code for User token
    let mut token_request = state.oauth_client.exchange_code(&params.code);
    
    ${config.usePkce ? `// Add PKCE code verifier validation
    token_request = token_request.with_pkce_verifier("random_pkce_code_verification_string_here_50_chars");` : ''}

    match token_request.await {
        Ok(token) => {
            // Fetch structured JSON profile of the user
            match state.oauth_client.get_user_profile(&token.access_token).await {
                Ok(profile) => {
                    format!("Welcome, {}! Email: {}", profile.name, profile.email).into_response()
                }
                Err(e) => format!("Failed to retrieve user profile: {:?}", e).into_response()
            }
        }
        Err(e) => format!("Failed token exchange: {:?}", e).into_response()
    }
}`;

      case 'actix':
        return `// main.rs - Rullst Connect + Actix-Web
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use rullst_connect::{
    providers::${structName},
    ClientConfig, OAuth2Client,
};
use serde::Deserialize;

struct AppState {
    oauth_client: OAuth2Client<${structName}>,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let client_config = ClientConfig::new(
        "${config.clientId || 'YOUR_CLIENT_ID'}".to_string(),
        "${config.clientSecret || 'YOUR_CLIENT_SECRET'}".to_string(),
        "${config.redirectUri || 'http://localhost:8080/auth/callback'}".to_string(),
    );

    let oauth_client = OAuth2Client::new(${structName}, client_config);
    let app_state = web::Data::new(AppState { oauth_client });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(login)
            .service(callback)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[get("/auth/login")]
async fn login(data: web::Data<AppState>) -> impl Responder {
    let mut auth_req = data.oauth_client
        .auth_url()
        .with_scopes(vec![${formattedScopes}]);

    ${config.usePkce ? `auth_req = auth_req.with_pkce_verifier("pkce_verifier_secret_string");` : ''}

    let url = auth_req.generate();
    HttpResponse::TemporaryRedirect()
        .insert_header(("Location", url))
        .finish()
}

#[derive(Deserialize)]
struct CallbackQuery {
    code: String,
    ${config.validateState ? 'state: String,' : ''}
}

#[get("/auth/callback")]
async fn callback(
    data: web::Data<AppState>,
    query: web::Query<CallbackQuery>,
) -> impl Responder {
    let mut req = data.oauth_client.exchange_code(&query.code);
    ${config.usePkce ? `req = req.with_pkce_verifier("pkce_verifier_secret_string");` : ''}

    match req.await {
        Ok(token) => {
            let profile = data.oauth_client.get_user_profile(&token.access_token).await.unwrap();
            HttpResponse::Ok().body(format!("Identity Connect: Hello {}!", profile.name))
        }
        Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}`;

      case 'poem':
        return `// main.rs - Rullst Connect + Poem Web
use poem::{
    get, handler, listener::TcpListener, 
    web::{Data, Query}, 
    EndpointExt, Route, Server, Response, IntoResponse
};
use rullst_connect::{
    providers::${structName},
    ClientConfig, OAuth2Client,
};
use serde::Deserialize;
use std::sync::Arc;

struct AppState {
    oauth_client: OAuth2Client<${structName}>,
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let client_config = ClientConfig::new(
        "${config.clientId || 'YOUR_CLIENT_ID'}".to_string(),
        "${config.clientSecret || 'YOUR_CLIENT_SECRET'}".to_string(),
        "${config.redirectUri || 'http://localhost:3000/auth/callback'}".to_string(),
    );

    let oauth_client = OAuth2Client::new(${structName}, client_config);
    let state = Arc::new(AppState { oauth_client });

    let app = Route::new()
        .at("/auth/login", get(login))
        .at("/auth/callback", get(callback))
        .data(state);

    Server::new(TcpListener::bind("127.0.0.1:3000"))
        .run(app)
        .await
}

#[handler]
async fn login(state: Data<&Arc<AppState>>) -> impl IntoResponse {
    let target = state.oauth_client
        .auth_url()
        .with_scopes(vec![${formattedScopes}])
        ${config.usePkce ? '.with_pkce_verifier("pkce_secret_string")' : ''}
        .generate();
    
    Response::builder()
        .status(poem::http::StatusCode::TEMPORARY_REDIRECT)
        .header("Location", target)
        .finish()
}

#[derive(Deserialize)]
struct CallbackQuery {
    code: String,
}

#[handler]
async fn callback(
    state: Data<&Arc<AppState>>,
    query: Query<CallbackQuery>,
) -> impl IntoResponse {
    let resp = state.oauth_client
        .exchange_code(&query.code)
        ${config.usePkce ? '.with_pkce_verifier("pkce_secret_string")' : ''}
        .await;

    match resp {
        Ok(t) => {
            let profile = state.oauth_client.get_user_profile(&t.access_token).await.unwrap();
            format!("Welcome, {}!", profile.name)
        }
        Err(e) => format!("OAuth Failure: {:?}", e),
    }
}`;

      default:
        return `// main.rs - Rullst Connect - Raw Async Rust (No Web Framework)
use rullst_connect::{
    providers::${structName},
    ClientConfig, OAuth2Client,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Elegant builder config
    let client_config = ClientConfig::new(
        "${config.clientId || 'YOUR_CLIENT_ID'}".to_string(),
        "${config.clientSecret || 'YOUR_CLIENT_SECRET'}".to_string(),
        "${config.redirectUri || 'https://example.com/callback'}".to_string(),
    );

    let client = OAuth2Client::new(${structName}, client_config);

    // 1. Generate Auth target url
    let directions = client
        .auth_url()
        .with_scopes(vec![${formattedScopes}])
        .generate();

    println!("Open this URL in your web browser:\\n{directions}");

    // 2. Perform Code exchange after browser redirect callback
    let mock_auth_code = "returned_code_from_redirect";
    let token = client
        .exchange_code(mock_auth_code)
        .await?;

    // 3. Obtain native deserialized user profiles
    let profile = client.get_user_profile(&token.access_token).await?;
    println!("Fetched User: {} <{}>", profile.name, profile.email);
    
    Ok(())
}`;
    }
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="code-generator">
      {/* Settings & Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divider-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* Left Interactive controls */}
        <div className="p-6 lg:col-span-1 space-y-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-rust-500" />
            <h4 className="font-display font-medium text-slate-100">Configuration Panel</h4>
          </div>

          <div className="space-y-4">
            {/* Direct Inputs */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Client ID</label>
              <input 
                type="text" 
                value={config.clientId}
                onChange={(e) => updateParam('clientId', e.target.value)}
                placeholder="E.g., google-oauth-id-123"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 text-xs font-mono focus:border-rust-500/50 focus:ring-1 focus:ring-rust-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Client Secret</label>
              <input 
                type="text" 
                value={config.clientSecret}
                onChange={(e) => updateParam('clientSecret', e.target.value)}
                placeholder="E.g., b3_98g7sdF4e_secret"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 text-xs font-mono focus:border-rust-500/50 focus:ring-1 focus:ring-rust-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Callback/Redirect URI</label>
              <input 
                type="text" 
                value={config.redirectUri}
                onChange={(e) => updateParam('redirectUri', e.target.value)}
                placeholder="http://localhost:3000/auth/callback"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 text-xs font-mono focus:border-rust-500/50 focus:ring-1 focus:ring-rust-500/20"
              />
            </div>

            {/* Framework Choices */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5">Web Framework</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {(['axum', 'actix', 'poem', 'raw'] as WebFramework[]).map((fw) => (
                  <button
                    key={fw}
                    onClick={() => updateParam('framework', fw)}
                    className={`py-1.5 px-2 rounded-md font-mono text-[10px] tracking-wide font-medium transition-colors ${
                      config.framework === fw
                        ? 'bg-rust-500/10 text-rust-500 border border-rust-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    {fw === 'raw' ? 'Async Raw' : fw.charAt(0).toUpperCase() + fw.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Switches */}
            <div className="pt-2 border-t border-slate-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">PKCE Support</span>
                  <span className="text-[10px] text-slate-500">Required by X/Twitter, recommended</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.usePkce}
                  onChange={(e) => updateParam('usePkce', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 hover:border-rust-500 bg-slate-950 text-rust-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">CSRF State Protection</span>
                  <span className="text-[10px] text-slate-500">Robust anti-request hijacking</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={config.validateState}
                  onChange={(e) => updateParam('validateState', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-rust-500 focus:ring-0"
                />
              </label>
            </div>
          </div>

          {/* Quick info explanation */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex gap-2">
            <Info className="w-4 h-4 text-rust-500 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-slate-400 leading-relaxed">
              <strong>Rullst Connect</strong> automatically handles TLS handshakes, JSON serialization, and asynchronous HTTP client requests to the chosen provider.
            </div>
          </div>
        </div>

        {/* Right Code Block Viewer */}
        <div className="lg:col-span-2 bg-slate-950 flex flex-col h-full min-h-[500px]">
          {/* Header tabs */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-900 bg-slate-950/80">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              
              <div className="h-4 w-[1px] bg-slate-800 mx-1" />

              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab('main')}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[10px] font-mono tracking-wide font-semibold border transition-all ${
                    activeTab === 'main' 
                      ? 'bg-slate-900 text-rust-500 border-rust-500/20' 
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  src/main.rs
                </button>

                <button
                  onClick={() => setActiveTab('cargo')}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[10px] font-mono tracking-wide font-semibold border transition-all ${
                    activeTab === 'cargo' 
                      ? 'bg-slate-900 text-rust-500 border-rust-500/20' 
                      : 'text-slate-400 border-transparent hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  Cargo.toml
                </button>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 text-[10px] font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-rust-500" />
                  Copy Code
                </>
              )}
            </button>
          </div>

          {/* Actual Code container */}
          <div className="relative flex-1 p-5 overflow-auto max-h-[480px] scrollbar-none">
            {/* Framework accent badge */}
            <div className="absolute top-3 right-5 pointer-events-none px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5 text-rust-500 animate-spin-slow" />
              {config.framework === 'raw' ? 'Async Raw' : config.framework}
            </div>

            <pre className="text-[11px] font-mono text-slate-300 leading-6 whitespace-pre">
              {activeTab === 'main' ? (
                <code>
                  {generateRustMainCode()}
                </code>
              ) : (
                <code className="text-yellow-400/95">
                  {generateCargoToml()}
                </code>
              )}
            </pre>
          </div>

          {/* Live DX stats banner */}
          <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rust-500" />
              Active Feature: {getProviderStructName()} client initialized
            </span>
            <span>UTF-8 • Rust Native • v0.1.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}
