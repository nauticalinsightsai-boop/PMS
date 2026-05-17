import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { CTAButton } from '../../components/ui/CTAButton';
import { BrandLogo } from '../../components/shared/BrandLogo';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    try {
      await login(email, password);
      // Success! Redirect to original destination or dashboard home
      const redirect = sessionStorage.getItem('redirect_after_login') || '/dashboard';
      sessionStorage.removeItem('redirect_after_login');
      navigate(redirect);
    } catch (error) {
      console.error('Login failed:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gw-bg-primary p-4 relative overflow-hidden">
      {/* Background blobs for atmosphere */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-gw-accent-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gw-accent-secondary/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gw-accent-primary text-white premium-shadow mb-6">
            <ShieldCheck size={32} />
          </div>
          <BrandLogo className="flex-col !gap-0" />
          <p className="text-gw-text-secondary font-medium uppercase tracking-widest text-[10px] mt-2">
            Certification Platform
          </p>
        </div>

        <GlassCard variant="modal" className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gw-text-secondary" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gw-accent-primary transition-all"
                  placeholder="admin@pms.os"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gw-text-secondary ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gw-text-secondary" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-gw-accent-primary transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <p className="text-[10px] text-gw-text-secondary mt-1 ml-1">Hint: Use <span className="text-gw-accent-primary font-bold">admin@pms.os</span> and <span className="text-gw-accent-primary font-bold">admin</span></p>
            </div>

            {isError && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 rounded-xl font-medium"
              >
                Invalid credentials. Please try again.
              </motion.div>
            )}

            <CTAButton type="submit" isLoading={isLoading} className="w-full">
              Enter Dashboard <ArrowRight className="ml-2" size={18} />
            </CTAButton>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5">
            <button className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
              <Github size={18} /> Continue with GitHub
            </button>
          </div>
        </GlassCard>

        <p className="text-center mt-8 text-xs text-gw-text-secondary font-medium">
          Protected by end-to-end encryption & Supabase Auth.<br/>
          Unauthorized access is logged & monitored.
        </p>
      </motion.div>
    </div>
  );
};
