'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { siteUrl } from '@/lib/site-config';
import Link from 'next/link';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      await login(email, password);
      const redirect = sessionStorage.getItem('redirect_after_login') || '/dashboard';
      sessionStorage.removeItem('redirect_after_login');
      router.replace(redirect);
    } catch (error) {
      console.error('Login failed:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gw-bg-primary p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-gw-accent-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard variant="raised" className="p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <BrandLogo size="lg" />
            <h1 className="text-2xl font-black mt-6">Admin Access</h1>
            <p className="text-gw-text-secondary text-sm mt-2 text-center">
              Sign in to manage your certification platform
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gw-accent-primary/50"
                placeholder="admin@pms.os"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gw-accent-primary/50"
                placeholder="••••••••"
                required
              />
            </div>

            {isError && (
              <p className="text-red-500 text-xs font-medium text-center">
                Invalid credentials. Local dev: <strong>admin@pms.os</strong> / <strong>admin</strong>.
                Or use a user from Supabase → Authentication → Users.
              </p>
            )}

            <CTAButton type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </CTAButton>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3 text-gw-text-secondary text-xs">
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} /> Secured by Supabase Auth
            </p>
            <Link href={siteUrl} className="hover:text-gw-accent-primary font-semibold transition-colors">
              ← Back to main website
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
