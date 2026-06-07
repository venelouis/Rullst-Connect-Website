import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  Chrome, 
  Settings, 
  User, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  ExternalLink,
  Code2, 
  Layers, 
  Terminal, 
  Info,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeConfig, SimulationStep } from '../types';

interface OAuthSimulatorProps {
  config: CodeConfig;
  userEmail?: string;
}

export default function OAuthSimulator({ config, userEmail }: OAuthSimulatorProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  // Custom states for steps
  const [copiedLink, setCopiedLink] = useState(false);
  const [userApproved, setUserApproved] = useState<boolean | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string>('');
  const [simulatedState, setSimulatedState] = useState<string>('');
  const [simulatedProfile, setSimulatedProfile] = useState<any>(null);
  
  // Particle explosion canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generates unique details once simulator resets
  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(1);
    setUserApproved(null);
    setSimulatedCode('auth_code_rullst_' + Math.random().toString(36).substring(2, 10));
    setSimulatedState('csrf_' + Math.random().toString(36).substring(2, 12));
    setSimulatedProfile(null);
  };

  const handleStepApproved = () => {
    setUserApproved(true);
    setCurrentStep(3); // transition to Rust Callback Verification
  };

  const handleStepDeclined = () => {
    setUserApproved(false);
    setIsSimulating(false);
    setCurrentStep(0);
  };

  // Trigger server token exchange and fetch profile
  const triggerTokenExchange = () => {
    setCurrentStep(4);
    const mockEmail = userEmail || 'dev@rullst.com';
    const mockUsername = mockEmail.split('@')[0];
    
    setSimulatedProfile({
      id: Math.floor(Math.random() * 900000) + 100000,
      name: mockUsername.charAt(0).toUpperCase() + mockUsername.slice(1).replace('.', ' '),
      email: mockEmail,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${mockUsername}`,
      verified: true,
      provider: config.provider,
      token_type: "Bearer",
      expires_in: 3600,
      scope: config.scopes.join(' ')
    });

    // Run celebration sparks
    setTimeout(() => {
      triggerSparks();
    }, 150);
  };

  // Sparks particle explosion simulation
  const triggerSparks = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 450;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: Particle[] = [];
    const colors = ['#f05223', '#fb923c', '#38bdf8', '#a78bfa', '#4ade80'];

    // Spawn 100 particles
    for (let i = 0; i < 110; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 40,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          active = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.06; // gravity
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (active) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const resetAll = () => {
    setCurrentStep(0);
    setIsSimulating(false);
    setUserApproved(null);
    setSimulatedProfile(null);
  };

  // Formatting strings
  const getProviderBrandName = () => {
    const p = config.provider;
    if (p === 'github') return 'GitHub';
    if (p === 'twitter') return 'Twitter / X';
    return p.charAt(0).toUpperCase() + p.slice(1);
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl" id="oauth-simulator">
      
      {/* Canvas Layer for celebration */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-30"
      />

      <div className="flex flex-col lg:flex-row justify-between gap-6">
        
        {/* Left Side: Step Tracker */}
        <div className="w-full lg:w-1/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-rust-500" />
              <h3 className="font-display font-semibold text-slate-100">OAuth2 Flow Simulator</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
              Experience the exact security mechanics behind an authenticated integration with Rullst Connect in real time.
            </p>

            {/* Stepper list */}
            <div className="mt-6 space-y-4">
              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                currentStep === 1 
                  ? 'bg-rust-500/10 border-rust-500/30 font-medium' 
                  : currentStep > 1 
                    ? 'bg-slate-950/60 border-slate-900/40 opacity-60' 
                    : 'bg-slate-900/40 border-slate-800 opacity-80'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${
                    currentStep > 1 ? 'bg-green-500/20 text-green-400' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {currentStep > 1 ? '✓' : '1'}
                  </span>
                  <div>
                    <h5 className="text-xs text-slate-200">PKCE Redirect</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">App generates secure redirect URL to prevent session hijacking</p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                currentStep === 2 
                  ? 'bg-rust-500/10 border-rust-500/30' 
                  : currentStep > 2 
                    ? 'bg-slate-950/60 border-slate-900/40 opacity-60' 
                    : 'bg-slate-900/40 border-slate-800 opacity-80'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${
                    currentStep > 2 ? 'bg-green-500/20 text-green-400' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {currentStep > 2 ? '✓' : '2'}
                  </span>
                  <div>
                    <h5 className="text-xs text-slate-200">Provider Consent</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">User consents to the client-requested scopes</p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                currentStep === 3 
                  ? 'bg-rust-500/10 border-rust-500/30' 
                  : currentStep > 3 
                    ? 'bg-slate-950/60 border-slate-900/40 opacity-60' 
                    : 'bg-slate-900/40 border-slate-800 opacity-80'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${
                    currentStep > 3 ? 'bg-green-500/20 text-green-400' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {currentStep > 3 ? '✓' : '3'}
                  </span>
                  <div>
                    <h5 className="text-xs text-slate-200">Callback Verification</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Rullst validates State, PKCE verifier and exchanges code for Token</p>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border transition-all duration-300 ${
                currentStep === 4 
                  ? 'bg-green-500/10 border-green-500/20 shadow-md shadow-green-500/5' 
                  : 'bg-slate-900/40 border-slate-800 opacity-80'
              }`}>
                <div className="flex gap-2.5 items-start">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono leading-none ${
                    currentStep === 4 ? 'bg-green-400 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'
                  }`}>
                    {currentStep === 4 ? '★' : '4'}
                  </span>
                  <div>
                    <h5 className="text-xs text-slate-200">Secure Access & Profile</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">App successfully retrieves your deserialized account profile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            {!isSimulating ? (
              <motion.button
                onClick={startSimulation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl font-display font-medium text-xs bg-rust-500 hover:bg-rust-600 text-white shadow-lg shadow-rust-500/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Start Simulation
              </motion.button>
            ) : (
              <motion.button
                onClick={resetAll}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 rounded-xl font-mono text-[11px] border border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-950 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Simulator
              </motion.button>
            )}
          </div>
        </div>

        {/* Right Side: Visual Sandbox */}
        <div className="w-full lg:w-2/3 bg-slate-950 rounded-xl border border-slate-800 p-5 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* INACTIVE STATE */}
            {currentStep === 0 && (
              <motion.div 
                key="step-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center flex-1 py-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 animate-float">
                  <Layers className="w-8 h-8 text-rust-500" />
                </div>
                <h4 className="font-display font-medium text-slate-200">Ready for Handshake</h4>
                <p className="text-slate-500 text-xs max-w-sm mt-1 mb-6">
                  Discover how Rullst Connect simplifies the complex channels of the auth code flow with built-in PKCE and CSRF protections.
                </p>
                <button
                  onClick={startSimulation}
                  className="px-5 py-2 rounded-lg bg-rust-500/10 border border-rust-500/20 text-rust-500 hover:bg-rust-500/20 text-xs font-semibold cursor-pointer"
                >
                  Trigger Flow
                </button>
              </motion.div>
            )}

            {/* STEP 1: CLIENT BUILD URL */}
            {currentStep === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-amber-500 uppercase">Step 1: Constructing Secure Endpoint</span>
                    <span className="text-[10px] font-mono text-slate-500">127.0.0.1:3000/auth/login</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    The Axum server uses Rullst Connect to build a bulletproof redirect route to <strong>{getProviderBrandName()}</strong>. Temporary validation vectors are recorded in memory:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">CSRF STATE (State Parameter)</div>
                      <div className="text-xs font-mono text-rust-500 truncate mt-1">{simulatedState}</div>
                      <div className="text-[9px] text-slate-400 mt-1">Shields the user from malicious cross-site request forgery.</div>
                    </div>

                    <div className="p-3 rounded bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">PKCE VERIFIER (Secret Seed)</div>
                      <div className="text-xs font-mono text-orange-400 truncate mt-1">random_pkce_code_verification_string_here_50_chars</div>
                      <div className="text-[9px] text-slate-400 mt-1">Ensures the application requesting the code is the same executing the exchange.</div>
                    </div>
                  </div>

                  {/* Generated Redirect URI */}
                  <div className="bg-slate-900 rounded border border-slate-800 p-2 text-[10px] font-mono text-slate-400 truncate select-all flex items-center justify-between">
                    <span className="truncate">
                      https://accounts.{config.provider}.com/o/oauth2/v2/auth?client_id={config.clientId}&redirect_uri={config.redirectUri}&response_type=code&scope={config.scopes.join(',')}&state={simulatedState}{config.usePkce ? '&code_challenge=z8c9f0X_verifier' : ''}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-900 mt-4">
                  <motion.button
                    onClick={() => setCurrentStep(2)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-4 rounded-lg bg-rust-500 hover:bg-rust-600 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    Simulate Redirect
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: MOCK CLIENT CONSENT SCREEN */}
            {currentStep === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-indigo-500 uppercase">Step 2: User Authorization Page</span>
                    <span className="text-[10px] font-mono text-slate-500">accounts.{config.provider}.com</span>
                  </div>

                  {/* Built mock browser client */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-auto overflow-hidden shadow-lg mb-4">
                    {/* Tiny Browser address header */}
                    <div className="bg-slate-950 px-3 py-2 border-b border-slate-900 flex items-center gap-1.5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500/40" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/40" />
                        <span className="w-2 h-2 rounded-full bg-green-500/40" />
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[8px] font-mono text-slate-400 w-full text-center flex items-center justify-center gap-1 truncate">
                        <Chrome className="w-2.5 h-2.5" /> 
                        accounts.{config.provider}.com/o/oauth2/auth
                      </div>
                    </div>

                    {/* Authorization panel */}
                    <div className="p-4 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center shadow">
                        <span className="text-xl">🦀</span>
                      </div>
                      <h5 className="font-display font-medium text-xs text-slate-200 mt-2 text-center">
                        Rullst Connect App
                      </h5>
                      <p className="text-[10px] text-slate-500 text-center mb-4">requests authorization for your {getProviderBrandName()} account</p>

                      <div className="w-full bg-slate-950/60 rounded-lg p-3 border border-slate-800/50 space-y-2 text-left mb-4">
                        <div className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Requested Scopes:</div>
                        {config.scopes.map((scope) => (
                          <div key={scope} className="text-[9px] text-slate-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rust-500/80" />
                            Scope: <strong className="font-mono text-slate-100">{scope}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 w-full">
                        <button
                          onClick={handleStepDeclined}
                          className="flex-1 py-1 px-3 text-[10px] border border-slate-800 hover:border-slate-700 bg-slate-950 rounded text-slate-400 hover:text-slate-200 transition-all"
                        >
                          Decline
                        </button>
                        <button
                          onClick={handleStepApproved}
                          className="flex-1 py-1 px-3 text-[10px] bg-rust-500 hover:bg-rust-600 rounded text-white font-semibold shadow-md shadow-rust-500/10"
                        >
                          Authorize
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 text-center leading-relaxed">
                  Upon clicking <strong>Authorize</strong>, the provider redirects back to your application's redirect URI (<span className="text-rust-500/80">callback_uri</span>) with a temporary authorization code.
                </div>
              </motion.div>
            )}

            {/* STEP 3: RUST CALLBACK ROUTE HANDLER */}
            {currentStep === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-green-500 uppercase">Step 3: Callback Handler Interception</span>
                    <span className="text-[10px] font-mono text-slate-500">GET /auth/callback?code={simulatedCode.substring(0,10)}...</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    The user returns! Your Axum fallback route intercepts the HTTP params. Now, <strong>Rullst Connect</strong> validates credentials on your behalf:
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2.5 p-2 bg-slate-900/60 border border-slate-800 rounded">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[10px] leading-relaxed">
                        <strong className="text-slate-200">CSRF State Comparison:</strong> Received state parameter <span className="font-mono text-rust-500">{simulatedState.substring(0, 8)}...</span> matches perfectly!
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-900/60 border border-slate-800 rounded">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-[10px] leading-relaxed">
                        <strong className="text-slate-200">PKCE Verifier Integration:</strong> Code verifier verified! Secures high-integrity native code exchanges against interception.
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-2 bg-slate-900/60 border border-slate-800 rounded">
                      <RefreshCw className="w-4 h-4 text-rust-500 mt-0.5 flex-shrink-0 animate-spin-slow" />
                      <div className="text-[10px] leading-relaxed">
                        <strong className="text-slate-200">Secondary Direct Handshake:</strong> Exchanging the temporary authorization code for a high-security <span className="font-semibold text-slate-100">Access Token</span> via server-side async HTTPS request.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-900 mt-4">
                  <motion.button
                    onClick={triggerTokenExchange}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-2 px-4 rounded-lg bg-rust-500 hover:bg-rust-600 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rust-500/10"
                  >
                    Exchange Code for Token
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: ACCESS RESTRICTED SECURE DATA */}
            {currentStep === 4 && simulatedProfile && (
              <motion.div 
                key="step-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-green-400 uppercase flex items-center gap-1">
                      <PartyPopper className="w-3.5 h-3.5 animate-bounce" />
                      Integration Seamlessly Completed!
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-sm shadow-emerald-500/5 anim-pulse">HTTP 200 OK</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Bearer token confidently recovered! The server utilized the client to execute secure profile lookups and parsed provider entities instantly:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-4">
                    {/* Premium profile card display */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 flex flex-col justify-center items-center text-center shadow-lg hover:border-rust-500/20 transition-all">
                      <div className="relative">
                        <img 
                          src={simulatedProfile.avatar} 
                          alt="Avatar" 
                          className="w-16 h-16 rounded-full bg-slate-900 border-2 border-rust-500 shadow-md p-1"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center font-bold text-slate-950 text-[8px]">✓</div>
                      </div>

                      <h5 className="font-display font-bold text-sm text-slate-100 mt-2.5">
                        {simulatedProfile.name}
                      </h5>
                      
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {simulatedProfile.email}
                      </span>

                      <div className="mt-3 flex gap-1.5">
                        <span className="text-[8px] px-2 py-0.5 rounded bg-rust-500/10 text-rust-500 font-mono uppercase tracking-wider font-semibold border border-rust-500/15">
                          {simulatedProfile.provider}
                        </span>
                        <span className="text-[8px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono uppercase tracking-wider font-semibold border border-emerald-500/15">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Decoded rust response JSON */}
                    <div className="bg-slate-900/60 rounded-xl border border-slate-800/60 overflow-hidden flex flex-col p-3">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-2">
                        <span>Profile Native Struct JSON</span>
                        <span>struct_profile.json</span>
                      </div>
                      <pre className="text-[9px] font-mono text-green-400 overflow-auto max-h-[140px] leading-relaxed scrollbar-none flex-1">
                        <code>
                          {JSON.stringify(simulatedProfile, null, 2)}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between border-t border-slate-900 items-center mt-2">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Info className="w-3.5 h-3.5 text-rust-500" />
                    Estimated handshake overhead: 18ms
                  </span>
                  <motion.button
                    onClick={resetAll}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="py-1.5 px-3 rounded-lg border border-slate-800 text-slate-400 hover:text-white bg-slate-950 transition-all font-semibold text-xs cursor-pointer"
                  >
                    Simulate Again
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
