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
import { useRouter } from 'next/navigation';

// --- INICIALIZAÇÃO DO SUPABASE ---
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
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    
    // Verificar se já existe uma sessão ativa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validação básica
      if (!email || !password) {
        setError('Preencha todos os campos');
        setIsLoading(false);
        return;
      }

      // Tentativa de login no Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        console.error('Erro de login:', signInError);
        
        // Mensagens amigáveis para erros comuns
        if (signInError.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login');
        } else {
          setError('Erro ao fazer login. Tente novamente.');
        }
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido
      if (data?.session && data?.user) {
        const userId = data.user.id;
        
        try {
          // Buscar perfil do tutor usando user_id (não id)
          const { data: tutorData, error: tutorError } = await supabase
            .from('tutores')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle(); // Usar maybeSingle em vez de single para evitar erro se não existir
          
          if (tutorError) {
            console.error('Erro ao buscar tutor:', tutorError);
          }
          
          if (tutorData) {
            // Perfil encontrado
            localStorage.setItem('nexus_tutor_profile', JSON.stringify(tutorData));
            console.log('Perfil carregado:', tutorData);
          } else {
            // Perfil não existe - criar um novo
            const defaultTutor = {
              name: data.user.email?.split('@')[0] || 'Usuário',
              email: data.user.email,
              phone: '',
              plan: 'Enterprise Elite',
              photo: ''
            };
            
            // Tentar inserir no banco de dados
            const { data: newTutor, error: insertError } = await supabase
              .from('tutores')
              .insert([
                { 
                  user_id: userId,
                  name: defaultTutor.name, 
                  email: defaultTutor.email,
                  plan: defaultTutor.plan,
                  phone: '',
                  photo: ''
                }
              ])
              .select()
              .maybeSingle();
            
            if (insertError) {
              console.error('Erro ao criar perfil:', insertError);
              // Mesmo com erro, salvar no localStorage
              localStorage.setItem('nexus_tutor_profile', JSON.stringify(defaultTutor));
            } else if (newTutor) {
              localStorage.setItem('nexus_tutor_profile', JSON.stringify(newTutor));
            } else {
              localStorage.setItem('nexus_tutor_profile', JSON.stringify(defaultTutor));
            }
          }
        } catch (profileError) {
          console.error('Erro ao processar perfil:', profileError);
          // Fallback: criar perfil temporário no localStorage
          const fallbackTutor = {
            name: data.user.email?.split('@')[0] || 'Usuário',
            email: data.user.email,
            phone: '',
            plan: 'Enterprise Elite',
            photo: ''
          };
          localStorage.setItem('nexus_tutor_profile', JSON.stringify(fallbackTutor));
        }
        
        // Redirecionar para o dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para criar conta demo (cadastro + login)
  const handleCreateDemoAccount = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const demoEmail = `demo_${Date.now()}@mypetpro.com`;
      const demoPassword = 'demo123456';
      
      // Tentar criar usuário
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPassword,
        options: {
          data: {
            name: 'Usuário Demo'
          }
        }
      });
      
      if (signUpError) {
        console.error('Erro ao criar conta demo:', signUpError);
        setError('Erro ao criar conta demo. Tente novamente.');
        setIsLoading(false);
        return;
      }
      
      if (signUpData?.user) {
        // Fazer login automaticamente
        setEmail(demoEmail);
        setPassword(demoPassword);
        
        // Aguardar um pouco para o trigger criar o perfil
        setTimeout(async () => {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });
          
          if (signInError) {
            setError('Conta criada, mas erro ao fazer login. Tente manualmente.');
            setEmail(demoEmail);
            setPassword('');
          } else {
            router.push('/dashboard');
          }
          setIsLoading(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao criar conta demo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-red-500 selection:text-white flex items-center justify-center p-6 overflow-hidden">
      
      {/* BACKGROUND CINEMATOGRÁFICO */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10"></div>
        {mounted && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale opacity-30"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* CARD DE LOGIN (GLASSMORPHISM) */}
      <div className="relative z-20 w-full max-w-[500px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-2xl">
          
          {/* LOGO GIGANTE DENTRO DO CARD */}
          <div className="flex justify-center mb-12">
            <img src="/logo.png" alt="MyPetPro" className="h-48 md:h-64 w-auto object-contain" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">Seja Bem Vindo!</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Acesse sua conta</p>
          </div>

          {/* Exibir erro se houver */}
          {error && (
            <div className="mb-6 p-4 bg-red-600/20 border border-red-600/50 rounded-2xl">
              <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
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

            {/* SENHA */}
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

            {/* BOTÃO ENTRAR */}
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

          
          {/* SIGN UP LINK */}
          <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-widest">
            Ainda não é cliente? <Link href="/#planos" className="text-red-600 hover:text-white transition-colors ml-1">Assinar Agora</Link>
          </p>

        </div>
      </div>

      {/* DECORAÇÃO FUNDO */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

    </div>
  );
}