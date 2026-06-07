import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Copy, 
  Check, 
  Github, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ArrowUpRight,
  Cpu, 
  Lock, 
  Code
} from 'lucide-react';
import { motion } from 'motion/react';
import { CodeConfig } from './types';

// Component imports
import GlowCircle from './components/GlowCircle';
import ProviderGrid from './components/ProviderGrid';
import CodeGenerator from './components/CodeGenerator';
import OAuthSimulator from './components/OAuthSimulator';
import DocumentationTabs from './components/DocumentationTabs';

export default function App() {
  const [config, setConfig] = useState<CodeConfig>({
    provider: 'google',
    clientId: 'google-oauth-client-id-xyz',
    clientSecret: 'gsec_y7B83g_secret',
    redirectUri: 'http://localhost:3000/auth/callback',
    scopes: ['openid', 'email', 'profile'],
    framework: 'axum',
    usePkce: true,
    validateState: true,
    features: ['google', 'pkce'],
  });

  const [copiedTerminal, setCopiedTerminal] = useState(false);

  const handleSelectProvider = (providerId: string, defaultScopes: string[]) => {
    setConfig(prev => ({
      ...prev,
      provider: providerId,
      scopes: defaultScopes,
      usePkce: providerId === 'twitter' || providerId === 'google' || providerId === 'microsoft',
    }));
  };

  const copyTerminalCommand = () => {
    navigator.clipboard.writeText('cargo add rullst-connect');
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 relative selection:bg-rust-500/30 selection:text-white pb-16">
      
      {/* Immersive interactive light beam backdrop */}
      <GlowCircle />

      {/* Decorative ambient beams */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent z-10" />

      {/* Primary Header/Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between border-b border-slate-900/80">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rust-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <span className="text-white text-lg font-bold">🦀</span>
          </div>
          <div>
            <div className="font-display font-bold text-slate-100 tracking-tight flex items-center gap-1.5 text-base">
              Rullst Connect
              <span className="text-[10px] bg-rust-500/15 text-rust-500 font-mono tracking-wider font-semibold border border-rust-500/20 rounded px-1.5 py-0.5">
                v7.0.1
              </span>
            </div>
            <div className="text-[9px] font-mono text-slate-500 tracking-wider">Agnostic OAuth2 Client for Rust</div>
          </div>
        </a>

        {/* Global Nav Anchors */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
          <a href="#providers" className="hover:text-slate-100 transition-colors">Providers</a>
          <a href="#code-generator" className="hover:text-slate-100 transition-colors">Configurator</a>
          <a href="#oauth-simulator" className="hover:text-slate-100 transition-colors">Simulator</a>
          <a href="#docs-section" className="hover:text-slate-100 transition-colors">Documentation</a>
        </nav>

        {/* Top CTA link to github */}
        <a 
          href="https://github.com/venelouis/rullst-connect" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold"
        >
          <Github className="w-4 h-4 text-slate-400 group-hover:text-slate-100" />
          <span>rullst-connect</span>
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
        </a>
      </header>

      {/* Hero Section Container */}
      <section id="hero" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-16 flex flex-col items-center text-center">
        
        {/* Release bubble */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rust-500/10 border border-rust-500/20 text-rust-500 text-xs font-semibold tracking-wide mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Async-First & DX-Focused Library
          <ChevronRight className="w-3 h-3" />
        </motion.div>

        {/* Big Bold Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-slate-100 tracking-tight leading-none max-w-4xl"
        >
          OAuth2 Authentication in Rust<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rust-500 via-orange-500 to-amber-500">
            Simple, Secure, and Effortless
          </span>
        </motion.h1>

        {/* Subhead narrative */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mt-5 leading-relaxed"
        >
          Rullst Connect is a lightweight, async-first, and Developer Experience (DX) focused library to set up top-tier OAuth2 flows in the Rust ecosystem. Integrate major providers like Google, GitHub, and Discord in seconds.
        </motion.p>

        {/* Quick terminal execute line */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <div 
            onClick={copyTerminalCommand}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-rust-500/50 cursor-pointer shadow-lg group transition-all text-xs font-mono"
          >
            <span className="text-slate-500 flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5" />
              $
            </span>
            <span className="text-slate-200">cargo add rullst-connect</span>
            <button className="text-slate-500 group-hover:text-slate-300 transition-colors pl-2">
              {copiedTerminal ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <a
            href="#code-generator"
            className="py-2.5 px-5 rounded-xl bg-rust-500 hover:bg-rust-600 text-white font-semibold text-xs tracking-wide shadow-lg shadow-rust-500/10 hover:shadow-rust-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            Generate Code
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Metric widgets container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-4xl"
          id="features"
        >
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-rust-500 font-mono">100%</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">Async-First</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-slate-100 font-mono">&lt; 15</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">Lines of Setup</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-orange-400 font-mono">Yes</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">PKCE & State</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-emerald-400 font-mono">Zero</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">Boilerplate</span>
          </div>
        </motion.div>

      </section>

      {/* Main Structural Layout Content */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mt-6">
        
        {/* SECTION 1: Features Bento display */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950 border border-slate-850/80 shadow-lg space-y-3 hover:border-rust-500/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-rust-500/10 border border-rust-500/20 flex items-center justify-center text-rust-500 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100">Amazing Speed</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The token exchange handshake uses unified async HTTPS requests that execute in record speed – typically under 18 milliseconds.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950 border border-slate-850/80 shadow-lg space-y-3 hover:border-rust-500/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-105 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100">Top-Tier Security (CSRF + PKCE)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Easy injection of PKCE authorization and CSRF state variables to systematically eliminate malicious session hijacked redirects.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950 border border-slate-850/80 shadow-lg space-y-3 hover:border-rust-500/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-display font-semibold text-sm text-slate-100">Native Multi-Framework</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full out-of-the-box support for leading asynchronous web frameworks of the modern Rust ecosystem like Axum, Actix-web, Poem, or raw channels.
            </p>
          </div>

        </section>

        {/* SECTION 2: Supported Providers selection screen */}
        <section id="providers" className="p-1 rounded-2xl bg-slate-950/40 border border-slate-900/60 p-6">
          <ProviderGrid config={config} onSelectProvider={handleSelectProvider} />
        </section>

        {/* SECTION 3: Live Code Generator */}
        <section className="space-y-4">
          <div className="flex flex-col">
            <h3 className="font-display text-xl font-semibold text-slate-100 flex items-center gap-2">
              <Code className="w-5 h-5 text-rust-500" />
              Interactive Configurator & Live Code Builder
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Customize your client application parameters, choose your favorite Rust web framework, and get the compiled boilerplate in real time!
            </p>
          </div>
          <CodeGenerator config={config} onChangeConfig={setConfig} />
        </section>

        {/* SECTION 4: Interactive Handshake Simulator */}
        <section>
          <OAuthSimulator config={config} userEmail="venelouistyago@gmail.com" />
        </section>

        {/* SECTION 5: Documentation Guides */}
        <section>
          <div className="flex flex-col mb-4">
            <h3 className="font-display text-xl font-semibold text-slate-100 flex items-center gap-2">
              <TerminalIcon className="w-5 h-5 text-rust-500" />
              Comprehensive Guides & Infrastructure Deploy
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Extra SDK usage tips and a step-by-step tutorial to publish this landing page to your GitHub Pages stress-free.
            </p>
          </div>
          <DocumentationTabs />
        </section>

      </main>

      {/* Styled Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-display font-medium text-slate-400">Rullst Connect 🦀</span>
          <span className="w-1 h-1 rounded-full bg-slate-800" />
          <span>DX-focused, Secure, and Fast</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>Lovingly crafted for</span>
          <a 
            href="https://github.com/venelouis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-rust-500 font-semibold transition-colors flex items-center gap-0.5"
          >
            venelouis
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <span className="w-1 h-1 rounded-full bg-slate-800 mx-1.5" />
          <span>MIT License</span>
        </div>
      </footer>

    </div>
  );
}
