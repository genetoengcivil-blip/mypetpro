'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// === SOLUÇÃO 1: CONEXÃO ÚNICA ===
// Garante que o Supabase seja criado apenas uma vez, evitando travamentos e alertas no console
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Sem verificação de sessão automática para evitar o Loop de Redirecionamento
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        setError(signInError.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : signInError.message);
        setIsLoading(false);
        return;
      }

      if (data?.session) {
        const userData = {
          name: data.user.email?.split('@')[0] || 'Tutor',
          email: data.user.email,
          phone: '', 
          plan: 'Enterprise Elite', 
          photo: ''
        };
        
        // Salva os dados na exata chave que o Dashboard MyPetPro espera
        localStorage.setItem('mypetpro_tutor_profile', JSON.stringify(userData));
        
        // === SOLUÇÃO 2: REDIRECIONAMENTO DIRETO ===
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Erro crítico:', err);
      setError('Erro ao conectar. Verifique sua internet.');
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-red-500 selection:text-white flex items-center justify-center p-6 overflow-hidden">
      
      {/* === SOLUÇÃO 3: VÍDEO DE FUNDO CORRIGIDO === */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#020617]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          {/* NOME DO ARQUIVO ATUALIZADO AQUI */}
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
        {/* Camada escura suavizada para o vídeo aparecer com estilo */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10"></div>
      </div>

      <div className="relative z-20 w-full max-w-[500px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-2xl">
          
          <div className="flex justify-center mb-12">
            <img src="/logo.png" alt="MyPetPro" className="h-48 md:h-64 w-auto object-contain" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">Seja Bem Vindo!</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Acesse sua conta</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-2xl">
              <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 text-white placeholder:text-slate-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Senha</label>
                <a href="#" className="text-[9px] font-black uppercase tracking-widest text-red-600 hover:text-white transition-colors">Esqueceu?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-red-600 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-14 text-white placeholder:text-slate-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-medium"
                  disabled={isLoading}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-white text-white hover:text-red-600 py-6 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-red-600/20 active:scale-95 flex items-center justify-center gap-3 mt-10 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Carregando <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div></>
              ) : (
                <>Entrar na Conta <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
            Ainda não é cliente? <Link href="/#planos" className="text-red-600 hover:text-white transition-colors ml-1">Assinar Agora</Link>
          </p>

        </div>
      </div>

      {/* Efeitos de iluminação originais mantidos */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-10"></div>

    </div>
  );
}