import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Github, 
  GitBranch, 
  ArrowRight, 
  Check, 
  Copy, 
  HelpCircle,
  FileCode,
  Globe,
  Settings,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DocumentationTabs() {
  const [activeTab, setActiveTab] = useState<'install' | 'ghpages' | 'faq'>('install');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => {
      setCopiedScript(null);
    }, 2000);
  };

  const deployActionYaml = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v4

      - name: Install and Build 🔧
        run: |
          npm ci
          npm run build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages`;

  const viteConfigSample = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/rullst-connect/', // IMPORTANT: Replace with your actual GitHub repository name!
});`;

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="docs-section">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-850 bg-slate-950/80 px-4 md:px-6">
        <button
          onClick={() => setActiveTab('install')}
          className={`py-4 px-4 font-display text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'install'
              ? 'border-rust-500 text-rust-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Rust Usage
        </button>

        <button
          onClick={() => setActiveTab('ghpages')}
          className={`py-4 px-4 font-display text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ghpages'
              ? 'border-rust-500 text-rust-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Rocket className="w-4 h-4 text-orange-400" />
          Deploy to GitHub Pages
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`py-4 px-4 font-display text-xs md:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'faq'
              ? 'border-rust-500 text-rust-500 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          FAQ
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: RUST INSTALLATION */}
          {activeTab === 'install' && (
            <motion.div
              key="install-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-sm font-semibold text-slate-100 font-display">Getting Started: Add to Cargo.toml</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Add <code className="text-rust-500 font-mono">rullst-connect</code> to your service directly using the cargo tool:
                </p>

                <div className="mt-3 bg-slate-950 rounded-xl p-4 border border-slate-900 flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-300">cargo add rullst-connect --features google github axum</span>
                  <button
                    onClick={() => copyToClipboard('cargo add rullst-connect --features google github axum', 'cargo')}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    {copiedScript === 'cargo' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-100 font-display">Premium Capability: Automated Token Refresh</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Prevent API commands from failing due to expired credentials. Rullst Connect provides automated expiration tracking and seamless token renewal using the <code className="text-slate-200 font-mono">refresh_token</code> parameter:
                </p>

                <div className="mt-3 bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-[10px] md:text-xs text-slate-300 relative overflow-x-auto leading-relaxed">
                  <button
                    onClick={() => copyToClipboard(`let renewed_token = oauth_client\n    .refresh_token(&expired_token.refresh_token)\n    .await\n    .expect("Failed to renew expired token");`, 'refresh')}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white"
                  >
                    {copiedScript === 'refresh' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre>{`// Check asynchronously if the token is expired
if token.is_expired() {
    let renewed_token = oauth_client
        .refresh_token(&expired_token.refresh_token)
        .await
        .expect("Failed to renew expired access token");
        
    println!("New token generated successfully: {}", renewed_token.access_token);
}`}</pre>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DEPLOY TO GITHUB PAGES */}
          {activeTab === 'ghpages' && (
            <motion.div
              key="ghpages-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 font-mono text-[10px] font-semibold border border-orange-500/20">Official Guide</span>
                  <h4 className="text-sm font-semibold text-slate-100 font-display">Publishing this Site to your GitHub Pages</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Excellent choice! This landing page was designed entirely as a static React and Tailwind CSS SPA, making it <strong>100% compatible</strong> with free hosting on GitHub Pages.
                </p>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-4 font-sans text-xs">
                
                {/* STEP 1: GitHub RepName Config */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-500 flex items-center justify-center font-mono font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="font-semibold text-slate-200">Configure Vite Base Path</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Inside the <code className="text-slate-200 font-mono">vite.config.ts</code> configuration file, define the <code className="text-rust-500 font-mono">base</code> property with your repository subdirectory to ensure correct resolution of CSS and JavaScript assets under GitHub Pages:
                    </p>
                    <div className="relative font-mono text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-900/60 overflow-x-auto text-slate-300">
                      <button
                        onClick={() => copyToClipboard(viteConfigSample, 'vite-cfg')}
                        className="absolute top-2 right-2 p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-white"
                      >
                        {copiedScript === 'vite-cfg' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <pre>{viteConfigSample}</pre>
                    </div>
                  </div>
                </div>

                {/* STEP 2: Github Actions Deployment */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-500 flex items-center justify-center font-mono font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1 space-y-2">
                    <h5 className="font-semibold text-slate-200">Configure GitHub Actions CI/CD Workflow</h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Create a new file named <code className="text-slate-200 font-mono">.github/workflows/deploy.yml</code> inside your directory, and paste the YAML instructions below. It will automatically compile and deploy your landing page straight to production on every master/main push!
                    </p>
                    <div className="relative font-mono text-[10px] bg-slate-950 p-3 rounded-lg border border-slate-900/60 overflow-x-auto text-slate-300 max-h-[160px] scrollbar-none">
                      <button
                        onClick={() => copyToClipboard(deployActionYaml, 'actions-yaml')}
                        className="absolute top-2 right-2 p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-white"
                      >
                        {copiedScript === 'actions-yaml' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <pre>{deployActionYaml}</pre>
                    </div>
                  </div>
                </div>

                {/* STEP 3: Enable on settings page */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-500 flex items-center justify-center font-mono font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-slate-200">Activate Hosting under Repository Settings</h5>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">
                      Head over to the <code className="font-semibold text-slate-200">Settings</code> tab of your GitHub repository, select <code className="font-semibold text-slate-200">Pages</code> in the navigation pane, spot the <code className="font-semibold text-slate-200">Build and deployment</code> section, and change the source selection from <em>Deploy from branch</em> to <strong>GitHub Actions</strong>.
                    </p>
                    <p className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      That's it! Your landing page will be instantly available at: https://venelouis.github.io/rullst-connect/ 🚀
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                <h5 className="text-xs font-semibold text-slate-200">How do I add a custom OAuth provider to Rullst Connect?</h5>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  It is extremely straightforward! Since the library is entirely DX-focused, you simply implement the <code className="text-slate-300 font-mono">OAuthProvider</code> trait and declare the target endpoints (authorization path, token path, and API profile mapping). This requires under 15 lines of safe Rust code!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                <h5 className="text-xs font-semibold text-slate-200">Does Rullst Connect support WebAssembly (WASM) targets?</h5>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Yes! Because the library rests on browser-agnostic async client integrations (supporting standard <code className="text-slate-300 font-mono">reqwest</code> or <code className="text-slate-300 font-mono">surf</code> crates), it compiles flawlessly to WASM, making it compatible with frontend Rust frameworks like Yew or Leptos.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-900/60">
                <h5 className="text-xs font-semibold text-slate-200">How does user session persistence work?</h5>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Rullst Connect is intentionally optimized for token exchange, PKCE validation, and handshake operations. Web session mechanics (e.g. secure HTTP-only cookies, JWT encryption, memory records) remain entirely adaptable so they can align with your custom web framework selection (e.g. using axum-extra-sessions).
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
