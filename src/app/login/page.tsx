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

// --- INICIALIZAÇÃO DO SUPABASE COM VERIFICAÇÃO ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log para debug no console do navegador
console.log('Supabase URL:', supabaseUrl ? 'OK' : 'MISSING');
console.log('Supabase Key:', supabaseKey ? 'OK' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERRO: Variáveis de ambiente do Supabase não configuradas!');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

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
      try {
        console.log('Verificando sessão existente...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao verificar sessão:', sessionError);
          return;
        }
        
        if (session) {
          console.log('Sessão encontrada, redirecionando...');
          router.push('/dashboard');
        } else {
          console.log('Nenhuma sessão ativa');
        }
      } catch (err) {
        console.error('Erro inesperado ao verificar sessão:', err);
      }
    };
    
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Verificar se as variáveis estão configuradas
    if (!supabaseUrl || !supabaseKey) {
      setError('Erro de configuração: Supabase não configurado. Contate o suporte.');
      setIsLoading(false);
      return;
    }

    try {
      // Validação básica
      if (!email || !password) {
        setError('Preencha todos os campos');
        setIsLoading(false);
        return;
      }

      console.log('Tentando login para:', email);

      // Tentativa de login no Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (signInError) {
        console.error('Erro de login detalhado:', {
          message: signInError.message,
          status: signInError.status,
          name: signInError.name
        });
        
        // Mensagens amigáveis para erros comuns
        if (signInError.message === 'Invalid login credentials') {
          setError('Email ou senha incorretos');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login');
        } else if (signInError.message.includes('Invalid email')) {
          setError('Email inválido');
        } else {
          setError(`Erro: ${signInError.message}`);
        }
        setIsLoading(false);
        return;
      }

      console.log('Login bem-sucedido!', data?.user?.id);

      // Login bem-sucedido
      if (data?.session && data?.user) {
        const userId = data.user.id;
        
        try {
          // Buscar ou criar perfil do tutor
          console.log('Buscando perfil do usuário...');
          
          let { data: tutorData, error: tutorError } = await supabase
            .from('tutores')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (tutorError) {
            console.error('Erro ao buscar tutor:', tutorError);
          }
          
          if (!tutorData) {
            console.log('Perfil não encontrado, criando novo...');
            
            // Criar perfil
            const newTutor = {
              user_id: userId,
              name: data.user.email?.split('@')[0] || 'Usuário',
              email: data.user.email,
              phone: '',
              plan: 'Enterprise Elite',
              photo: ''
            };
            
            const { data: inserted, error: insertError } = await supabase
              .from('tutores')
              .insert([newTutor])
              .select()
              .maybeSingle();
            
            if (insertError) {
              console.error('Erro ao criar perfil:', insertError);
              // Salvar no localStorage mesmo assim
              localStorage.setItem('nexus_tutor_profile', JSON.stringify(newTutor));
            } else if (inserted) {
              console.log('Perfil criado com sucesso');
              localStorage.setItem('nexus_tutor_profile', JSON.stringify(inserted));
            }
          } else {
            console.log('Perfil encontrado');
            localStorage.setItem('nexus_tutor_profile', JSON.stringify(tutorData));
          }
        } catch (profileError) {
          console.error('Erro ao processar perfil:', profileError);
        }
        
        console.log('Redirecionando para dashboard...');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Erro inesperado no login:', err);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para testar conexão com Supabase
  const testConnection = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('tutores').select('count');
      if (error) {
        console.error('Erro de conexão:', error);
        alert(`Erro de conexão: ${error.message}`);
      } else {
        alert('Conexão com Supabase OK!');
      }
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao conectar com Supabase');
    }
    setIsLoading(false);
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

      {/* CARD DE LOGIN */}
      <div className="relative z-20 w-full max-w-[500px]">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-2xl">
          
          {/* LOGO */}
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

          {/* Botão Testar Conexão (apenas para debug) */}
          <button 
            onClick={testConnection}
            type="button"
            className="w-full mt-4 bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors"
          >
            Testar Conexão com Supabase
          </button>

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