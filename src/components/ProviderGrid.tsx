import React from 'react';
import { 
  Github, 
  Chrome, 
  Globe, 
  MessageSquare, 
  Slack, 
  Twitter, 
  Music, 
  Twitch, 
  Monitor, 
  ShieldCheck, 
  Lock,
  GitBranch,
  KeyRound
} from 'lucide-react';
import { OAuthProvider, CodeConfig } from '../types';
import { motion } from 'motion/react';

const PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    logo: 'chrome',
    color: 'from-blue-600 to-red-500',
    borderColor: 'group-hover:border-blue-500/50',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    defaultScopes: ['openid', 'email', 'profile'],
    docUrl: 'https://developers.google.com/identity/protocols/oauth2',
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: 'github',
    color: 'from-gray-700 to-gray-900',
    borderColor: 'group-hover:border-purple-500/50',
    glowColor: 'rgba(120, 119, 119, 0.4)',
    defaultScopes: ['user:email', 'read:user', 'repo'],
    docUrl: 'https://docs.github.com/en/apps/oauth-apps',
  },
  {
    id: 'discord',
    name: 'Discord',
    logo: 'discord',
    color: 'from-indigo-600 to-indigo-800',
    borderColor: 'group-hover:border-indigo-500/50',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    defaultScopes: ['identify', 'email', 'guilds'],
    docUrl: 'https://discord.com/developers/docs/topics/oauth2',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'microsoft',
    color: 'from-teal-600 to-blue-500',
    borderColor: 'group-hover:border-teal-500/50',
    glowColor: 'rgba(13, 148, 136, 0.4)',
    defaultScopes: ['User.Read', 'openid', 'profile', 'offline_access'],
    docUrl: 'https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: 'slack',
    color: 'from-amber-500 to-pink-500',
    borderColor: 'group-hover:border-pink-500/50',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    defaultScopes: ['users:read', 'users:read.email'],
    docUrl: 'https://api.slack.com/authentication/oauth-v2',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    logo: 'twitter',
    color: 'from-gray-900 to-black',
    borderColor: 'group-hover:border-sky-500/50',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    defaultScopes: ['tweet.read', 'users.read', 'offline.access'],
    docUrl: 'https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    logo: 'spotify',
    color: 'from-green-500 to-green-700',
    borderColor: 'group-hover:border-green-500/50',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    defaultScopes: ['user-read-private', 'user-read-email'],
    docUrl: 'https://developer.spotify.com/documentation/web-api/tutorials/code-flow',
  },
  {
    id: 'twitch',
    name: 'Twitch',
    logo: 'twitch',
    color: 'from-purple-600 to-purple-800',
    borderColor: 'group-hover:border-purple-500/50',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    defaultScopes: ['user:read:email', 'user:read:follows'],
    docUrl: 'https://dev.twitch.tv/docs/authentication',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    logo: 'gitlab',
    color: 'from-orange-500 to-yellow-500',
    borderColor: 'group-hover:border-orange-500/50',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    defaultScopes: ['read_user', 'openid', 'profile'],
    docUrl: 'https://docs.gitlab.com/ee/api/oauth2.html',
  },
  {
    id: 'keycloak',
    name: 'Keycloak',
    logo: 'keycloak',
    color: 'from-red-600 to-cyan-500',
    borderColor: 'group-hover:border-red-500/50',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    defaultScopes: ['openid', 'profile', 'email'],
    docUrl: 'https://www.keycloak.org/docs/latest/securing_apps/',
  },
];

interface ProviderGridProps {
  config: CodeConfig;
  onSelectProvider: (providerId: string, defaultScopes: string[]) => void;
}

export default function ProviderGrid({ config, onSelectProvider }: ProviderGridProps) {
  
  const getIcon = (logo: string) => {
    switch (logo) {
      case 'github': return <Github className="w-6 h-6 text-white" />;
      case 'chrome': return <Chrome className="w-6 h-6 text-red-400" />;
      case 'discord': return <MessageSquare className="w-6 h-6 text-indigo-400" />;
      case 'microsoft': return <Monitor className="w-6 h-6 text-teal-400" />;
      case 'slack': return <Slack className="w-6 h-6 text-pink-400" />;
      case 'twitter': return <Twitter className="w-6 h-6 text-sky-400" />;
      case 'spotify': return <Music className="w-6 h-6 text-green-400" />;
      case 'twitch': return <Twitch className="w-6 h-6 text-purple-400" />;
      case 'gitlab': return <GitBranch className="w-6 h-6 text-orange-400" />;
      case 'keycloak': return <KeyRound className="w-6 h-6 text-red-400" />;
      default: return <Globe className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col mb-6">
        <h3 className="font-display text-lg font-medium text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rust-500" />
          Supported Native Providers
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          Click on any provider to dynamically update the active configuration templates and raw code generator boilerplate below.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {PROVIDERS.map((provider) => {
          const isSelected = config.provider === provider.id;
          
          return (
            <motion.button
              key={provider.id}
              onClick={() => onSelectProvider(provider.id, provider.defaultScopes)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 overflow-hidden text-center cursor-pointer ${
                isSelected 
                  ? 'bg-slate-900 border-rust-500/80 shadow-[0_0_20px_rgba(240,82,35,0.15)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {/* Active glow backing */}
              {isSelected && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    background: `radial-gradient(circle, ${provider.glowColor} 0%, transparent 75%)`,
                  }}
                />
              )}

              {/* Shimmer line if selected */}
              {isSelected && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-rust-500 to-transparent animate-pulse" />
              )}

              <div className={`p-3 rounded-xl bg-slate-950/60 transition-transform duration-300 group-hover:scale-110 shadow-lg ${
                isSelected ? 'border border-rust-500/20' : 'border border-slate-800'
              }`}>
                {getIcon(provider.logo)}
              </div>

              <span className={`mt-3 font-display text-xs font-semibold tracking-wide transition-colors ${
                isSelected ? 'text-rust-500' : 'text-slate-300 group-hover:text-white'
              }`}>
                {provider.name}
              </span>

              {/* Badges for PKCE inside cards */}
              <div className="flex gap-1 mt-2">
                {provider.id === 'twitter' || provider.id === 'google' || provider.id === 'microsoft' ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-mono flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> PKCE
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/40 text-slate-500 font-mono">
                    Standard
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
