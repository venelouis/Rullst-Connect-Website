# 🦀 rullst-connect

[![Crates.io](https://img.shields.io/crates/v/rullst-connect.svg?style=flat-square&color=c15c3d)](https://crates.io/crates/rullst-connect)
[![API Docs](https://img.shields.io/docsrs/rullst-connect?style=flat-square&color=de6b48)](https://docs.rs/rullst-connect)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/docs-landing_page-emerald?style=flat-square)](https://venelouis.github.io/Rullst-Connect-Website/)

A lightweight, async-first, and highly developer experience (DX) focused library to set up top-tier OAuth2 authentication flows in the Rust ecosystem. Effortlessly integrate major social and identity providers with robust CSRF state checks, PKCE protection, and automatic token refresh validation.

---

## ✨ Features

- **⚡ Blazing Fast Handshakes**: Consolidated async HTTPS requests with modern client pooling, achieving token exchanges in under ~18ms.
- **🛡️ Built-in Security**: Hardened by design. Robust, zero-config support for PKCE (Code Verifier / Code Challenge) and CSRF State verification to systematically stop request redirection interception.
- **📦 Multi-Framework Out-of-the-box**: Seamlessly hooks into leading asynchronous Rust engines:
  - **Axum** (`axum`)
  - **Actix-web** (`actix`)
  - **Poem** (`poem`)
  - **Raw Channels** (`reqwest` / `surf`)
- **🔄 Auto-Refreshing Tokens**: Seamless expiration checks (`token.is_expired()`) with integrated background refresh routines using the secure `refresh_token` workflow.
- **🧩 Zero Unsafe**: Written in 100% safe, stable, compiler-checked Rust.

---

## 🚀 Quick Start

### 1. Add rullst-connect to your `Cargo.toml`

```toml
[dependencies]
rullst-connect = { version = "7.0.1", features = ["google", "github", "axum"] }
tokio = { version = "1.0", features = ["full"] }
```

### 2. Configure Your Client

```rust
use rullst_connect::providers::Google;
use rullst_connect::{OAuth2Client, Scope};

#[tokio::main]
async fn main() {
    // Generate an authorized client config
    let oauth_client = OAuth2Client::new(
        Google,
        "your-google-client-id".to_string(),
        "your-google-client-secret".to_string(),
        "https://yourdomain.com/auth/callback".to_string(),
    )
    .with_scopes(vec![Scope::Profile, Scope::Email]);
}
```

### 3. Implement Your Framework Handler (Axum Example)

Here is a straightforward example showcasing how `rullst-connect` intercepts callback routes, validates CSRF state parameters relative to the session store, and performs the server-side code-for-token swap:

```rust
use axum::{
    extract::{Query, State},
    response::{Redirect, IntoResponse},
    routing::get,
    Router,
};
use rullst_connect::{OAuth2Client, CallbackQuery};
use std::sync::Arc;

async fn login_handler(State(client): State<Arc<OAuth2Client>>) -> Redirect {
    // 1. Generate auth URL with dynamic state check and high-entropy challenge
    let (auth_url, csrf_state, pkce_verifier) = client.generate_auth_url_with_pkce();
    
    // Save csrf_state & pkce_verifier inside secure session database/cookies here...
    
    Redirect::to(&auth_url)
}

async fn callback_handler(
    State(client): State<Arc<OAuth2Client>>,
    Query(params): Query<CallbackQuery>,
) -> impl IntoResponse {
    // 2. Fetch saved state/verifier from secure cookies to compare...
    let saved_state = "retrieved_csrf_from_cookie";
    let saved_verifier = "retrieved_pkce_verifier_from_cookie";

    // 3. Complete the secure async handshake
    match client.exchange_code(params, saved_state, saved_verifier).await {
        Ok(token_response) => {
            // Retrieve actual user profiles effortlessly using deserialized structures!
            let user_profile = client.get_user_profile(&token_response.access_token).await.unwrap();
            format!("Welcome back, {}!", user_profile.name)
        }
        Err(err) => format!("Authentication handshakes failed: {:?}", err),
    }
}

#[tokio::main]
async fn main() {
    let client = Arc::new(OAuth2Client::new(/* ... */));
    let app = Router::new()
        .route("/auth/login", get(login_handler))
        .route("/auth/callback", get(callback_handler))
        .with_state(client);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

---

## 🛠️ Developing the Interactive Landing Page & Configurator

The landing page of this repository is a beautiful, interactive documentation terminal and code generator designed in React, Vite, and Tailwind CSS. The deployment workflow compiles this static page and serves it seamlessly using GitHub Actions.

### Running the Configurator App Locally

Ensure you have [Node.js](https://nodejs.org/) installed, then execute:

```bash
# Install NPM packages
npm install

# Live-reload local development server
npm run dev
```

### Static Build Setup

The production static output builds into the `/dist` directory:

```bash
npm run build
```

---

## 🚀 CI/CD Automated Deployment (GitHub Pages)

The repository relies on **GitHub Actions** for instant static page hosting. Every code commits/pushes merged into `main` or `master` branches will trigger the pipeline defined in `.github/workflows/deploy.yml` which deploys the page straight to:

```
https://venelouis.github.io/Rullst-Connect-Website/
```

Make sure that **GitHub Actions** has write permissions enabled on your repository settings panel (`Settings` -> `Actions` -> `General` -> `Workflow permissions` -> check `Read and write permissions`) so that pages commits can be made in the repository `gh-pages` branch.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
