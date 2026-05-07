'use client';

import React, { useEffect, useState } from 'react';
import { 
  Heart, Shield, Activity, ArrowRight, Check, Star, 
  Smartphone, Bell, Cloud, HelpCircle, Camera, CheckCircle2, Zap
} from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const technologies = [
    "Prontuário Digital", "Vacinas Smart", "Alertas Real-time", "Cloud Sync", 
    "Relatórios Pro", "Histórico 360", "Segurança Bancária", "App Mobile"
  ];

  const testimonials = [
    {q: "O melhor investimento que já fiz para o Fred. Tudo na palma da mão.", n: "Mariana Costa", a: "https://i.pravatar.cc/100?img=20"},
    {q: "Prontuário completo em 2 segundos. Salvou a gente em uma emergência.", n: "Rodrigo Almeida", a: "https://i.pravatar.cc/100?img=33"},
    {q: "Nunca mais perdi uma vacina. O sistema de alertas é impecável!", n: "Leticia Lima", a: "https://i.pravatar.cc/100?img=26"},
    {q: "Design impecável e muito fácil de usar. Meus dois cães estão cadastrados.", n: "Bruno Matos", a: "https://i.pravatar.cc/100?img=12"},
    {q: "Finalmente um CRM de elite para quem ama pets de verdade.", n: "Felipe G.", a: "https://i.pravatar.cc/100?img=11"}
  ];

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-red-500 selection:text-white overflow-x-hidden text-slate-100">
      
      {/* HEADER: LOGO PREMIUM */}
      <header className="fixed top-0 w-full bg-[#020617]/90 backdrop-blur-xl border-b border-slate-800 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-28 flex justify-center items-center">
          <img src="/logo.png" alt="MyPetPro" className="h-20 md:h-28 w-auto object-contain" />
        </div>
      </header>

      {/* HERO SECTION: TEXTO À ESQUERDA + DUPLO DEGRADÊ */}
      <section className="relative h-screen min-h-[600px] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-10 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950 via-transparent to-transparent z-10 opacity-80"></div>
          
        
          <video 
            key="hero-video-player"
            autoPlay 
            loop 
            muted 
            playsInline 
            poster="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200"
            className="w-full h-full object-cover object-top scale-105"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          
        </div>

        <div className="relative z-20 max-w-[1600px] mx-auto px-6 md:px-16 w-full h-full flex flex-col justify-center">
          <div className="max-w-4xl text-left mt-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-10 shadow-2xl animate-pulse">
               <Star className="h-4 w-4 fill-white" />
               <span>O Padrão Ouro em Cuidado Pet</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8 md:mb-10 uppercase italic drop-shadow-2xl text-white">
              VIVA CADA <br />
              <span className="text-red-600 underline decoration-white/20 underline-offset-[10px]">SEGUNDO</span> <br />
              COM ELES.
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mb-12 md:mb-20 max-w-2xl opacity-100 leading-tight drop-shadow-lg text-slate-100">
              A plataforma premium que organiza os cuidados que seu pet precisa, para você focar no que importa: a felicidade em família.
            </p>
          </div>

          <div className="absolute bottom-10 md:bottom-20 left-0 right-0 flex justify-center px-6">
            <a href="#planos" className="group bg-red-600 hover:bg-white text-white hover:text-red-600 text-lg md:text-2xl font-black px-10 md:px-16 py-6 md:py-8 rounded-3xl md:rounded-[2.5rem] transition-all shadow-3xl flex items-center gap-4 active:scale-95 border-2 md:border-4 border-transparent hover:border-red-600 w-full md:w-auto justify-center">
              ASSINAR AGORA <ArrowRight className="group-hover:translate-x-2 transition-transform w-6 h-6 md:w-8 md:h-8" />
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE NÚMEROS */}
      <div className="bg-white py-16 md:py-24 border-y border-slate-200">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center text-slate-900">
               <div className="space-y-1">
                  <div className="text-4xl md:text-7xl font-black leading-none">+50K</div>
                  <p className="font-black uppercase tracking-widest text-[9px] text-red-600">Assinaturas</p>
               </div>
               <div className="space-y-1">
                  <div className="text-4xl md:text-7xl font-black leading-none">4.9</div>
                  <div className="flex justify-center gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 md:h-5 md:w-5 fill-yellow-500" />)}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-4xl md:text-7xl font-black leading-none">+2.4K</div>
                  <p className="font-black uppercase tracking-widest text-[9px] text-red-600">Pets Ativos</p>
               </div>
               <div className="space-y-1">
                  <div className="text-4xl md:text-7xl font-black leading-none">100%</div>
                  <p className="font-black uppercase tracking-widest text-[9px] text-slate-400">Cloud Pro</p>
               </div>
            </div>
         </div>
      </div>

      {/* MARQUEE DE TECNOLOGIAS */}
      <div className="bg-slate-900 py-10 md:py-14 overflow-hidden border-b border-slate-800">
         <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...technologies, ...technologies].map((text, i) => (
              <div key={i} className="flex flex-col items-center gap-2 px-10 md:px-16">
                 <div className="flex gap-0.5 text-red-600">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-2 w-2 md:h-3 md:w-3 fill-red-600" />)}
                 </div>
                 <span className="text-white text-[9px] md:text-xs font-black uppercase tracking-[0.4em]">{text}</span>
              </div>
            ))}
         </div>
      </div>

      {/* SEÇÃO: FAMÍLIA COM PET (IMAGEM ESTÁVEL) */}
      <section className="py-24 md:py-40 bg-white text-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 md:-inset-6 bg-red-50 rounded-[3rem] md:rounded-[4rem] rotate-2 -z-10 group-hover:rotate-0 transition-transform"></div>
              <img 
                src="/familia-pet.jpg" 
                className="rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl h-[400px] sm:h-[600px] lg:h-[750px] w-full object-cover border-4 md:border-8 border-white"
                alt="Família feliz com seu pet"
              />
            </div>
            <div className="space-y-8 md:space-y-12 order-1 lg:order-2">
              <h2 className="text-5xl md:text-[90px] font-black uppercase italic tracking-tighter leading-[0.85]">
                TODA A <br /><span className="text-red-600 underline decoration-red-100 underline-offset-[10px]">FAMÍLIA</span> <br />EM PAZ.
              </h2>
              <p className="text-lg md:text-2xl font-bold text-slate-500 max-w-xl leading-relaxed">
                A tranquilidade de saber que cada detalhe da saúde do seu melhor amigo está protegido.
              </p>
              <div className="flex gap-6 md:gap-8 items-center bg-slate-50 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100">
                <Zap className="text-red-600 w-10 h-10 md:w-12 md:h-12 flex-shrink-0" />
                <span className="text-lg md:text-xl font-black uppercase italic leading-tight text-slate-900">Tecnologia Preventiva de Elite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOVO: CARROSSEL DE DEPOIMENTOS (RESTAURADO) */}
      <section className="py-24 md:py-40 bg-slate-50 overflow-hidden text-slate-950 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-6 tracking-tighter">FEEDBACK <span className="text-red-600">CLIENTES.</span></h2>
          <div className="h-2 w-32 bg-red-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="flex animate-marquee-slow gap-6 md:gap-10 items-stretch">
          {[...testimonials, ...testimonials].map((item, i) => (
            <div key={i} className="inline-block p-10 md:p-12 bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-100 shadow-2xl w-[350px] md:w-[450px] flex-shrink-0 whitespace-normal">
               <div className="flex gap-1 mb-6 md:mb-8 text-yellow-500">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-5 w-5 md:h-6 md:w-6 fill-yellow-500" />)}
               </div>
               <p className="text-lg md:text-2xl font-bold text-slate-800 mb-8 md:mb-12 leading-snug italic">“{item.q}”</p>
               <div className="flex items-center gap-4 md:gap-5 pt-4 md:pt-6 border-t border-slate-50">
                  <img src={item.a} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-slate-50 shadow-md" alt={item.n} />
                  <span className="font-black uppercase text-[10px] md:text-xs tracking-widest text-slate-900">{item.n}</span>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="py-24 md:py-44 bg-[#020617] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-[90px] font-black uppercase italic mb-20 md:mb-32 tracking-tighter text-white leading-none">PLANOS <span className="text-red-600">PRO.</span></h2>

          <div className="grid lg:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto items-stretch">
            {/* Semestral - DESTAQUE */}
            <div className="bg-white p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] border-4 border-red-600 flex flex-col justify-between relative transform lg:scale-110 shadow-[0_0_50px_rgba(220,38,38,0.3)] text-slate-950 order-1 lg:order-2">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.3em] shadow-2xl whitespace-nowrap">Valor Semestral ⭐</div>
              <div className="text-left">
                <h3 className="text-[10px] font-black uppercase text-red-600 mb-6 tracking-[0.4em] pt-4 italic">Assinatura Semestral</h3>
                <div className="text-6xl md:text-8xl font-black mb-8 md:mb-12 italic tracking-tighter leading-none text-slate-900">R$ 219<span className="text-2xl text-slate-300 font-bold">,90</span></div>
                <ul className="space-y-4 md:space-y-6 mb-10 md:mb-16 font-bold text-slate-800 text-base md:text-xl text-left">
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-5 h-5 md:w-7 md:h-7 shrink-0" /> Tudo do Mensal</li>
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-5 h-5 md:w-7 md:h-7 shrink-0" /> Suporte VIP Priority</li>
                  <li className="flex gap-4 items-center font-black text-red-600 uppercase italic text-[10px] bg-red-50 py-2 px-4 rounded-full w-fit">Economize R$ 20</li>
                </ul>
              </div>
              <a href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=7LTZ5V5" className="w-full py-6 md:py-8 rounded-2xl md:rounded-[2rem] bg-red-600 text-white font-black uppercase text-lg md:text-2xl shadow-xl hover:bg-slate-950 transition-all active:scale-95">ASSINAR AGORA</a>
            </div>

            {/* Mensal */}
            <div className="bg-slate-900/40 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-slate-800 flex flex-col justify-between hover:border-red-950 transition-all order-2 lg:order-1">
              <div className="text-left">
                <h3 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-[0.4em]">Assinatura Mensal</h3>
                <div className="text-5xl md:text-6xl font-black mb-8 md:mb-12 italic text-white leading-none">R$ 39<span className="text-xl text-slate-600 font-bold">,90/mês</span></div>
                <ul className="space-y-4 md:space-y-6 mb-10 md:mb-16 font-bold text-slate-400 text-left">
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-6 h-6 shrink-0" /> Cadastro ilimitado</li>
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-6 h-6 shrink-0" /> Gestão de Vacinas</li>
                </ul>
              </div>
              <a href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=TBYYZTV" className="w-full py-5 md:py-6 rounded-2xl md:rounded-[2rem] bg-slate-800 text-white font-black uppercase hover:bg-white hover:text-black transition-all">ASSINAR</a>
            </div>

            {/* Anual */}
            <div className="bg-slate-900/40 p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border border-slate-800 flex flex-col justify-between hover:border-red-950 transition-all order-3">
              <div className="text-left">
                <h3 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-[0.4em]">Assinatura Anual</h3>
                <div className="text-5xl md:text-6xl font-black mb-8 md:mb-12 italic text-white leading-none">R$ 399<span className="text-xl text-slate-600 font-bold">,90/ano</span></div>
                <ul className="space-y-4 md:space-y-6 mb-10 md:mb-16 font-bold text-slate-400 text-left">
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-6 h-6 shrink-0" /> 2 meses TOTAL Grátis</li>
                  <li className="flex gap-4 items-center"><Check className="text-red-600 w-6 h-6 shrink-0" /> Selo Membro Fundador</li>
                </ul>
              </div>
              <a href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=4JQ030Q" className="w-full py-5 md:py-6 rounded-2xl md:rounded-[2rem] bg-slate-800 text-white font-black uppercase hover:bg-white hover:text-black transition-all">ASSINAR</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#020617] py-24 md:py-40 border-t border-slate-900 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <img src="/logo.png" alt="MyPetPro" className="h-28 md:h-48 w-auto mb-16 md:mb-28 object-contain" />
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-16">
             <a href="/termos" className="hover:text-red-600 transition-colors">Termos</a>
             <a href="/privacidade" className="hover:text-red-600 transition-colors">Privacidade</a>
             <a href="/seguranca" className="hover:text-red-600 transition-colors">Segurança</a>
             <a href="https://instagram.com/mypet.pro" target="_blank" className="hover:text-red-600 transition-colors inline-flex items-center gap-2">
                <Camera className="h-4 w-4" /> Instagram
             </a>
          </div>
          <p className="text-slate-700 font-black text-[9px] md:text-[10px] tracking-[0.6em]">© 2026 MYPETPRO SOFTWARE. TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>

      {/* CSS: INFINITE LOOPS */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }

        .animate-marquee-slow {
          display: flex;
          animation: marquee 60s linear infinite;
        }

        .animate-marquee:hover, .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}