'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Dog, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Settings, 
  LogOut, 
  Bell, 
  Plus, 
  Search,
  Heart,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function CRMDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'pets', icon: Dog, label: 'Meus Pets' },
    { id: 'agenda', icon: Calendar, label: 'Agenda & Consultas' },
    { id: 'saude', icon: ShieldCheck, label: 'Vacinas & Saúde' },
    { id: 'historico', icon: Activity, label: 'Prontuário' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-100 flex overflow-hidden">
      
      {/* ABA LATERAL (SIDEBAR) PREMIUM */}
      <aside className="w-80 bg-[#0c1222]/50 backdrop-blur-2xl border-r border-white/5 flex flex-col p-8 z-30">
        {/* LOGO IMPOENTE */}
        <div className="mb-16 flex justify-center">
          <img src="/logo.png" alt="MyPetPro" className="h-16 w-auto object-contain" />
        </div>

        {/* NAVEGAÇÃO */}
        <nav className="flex-1 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-3xl transition-all font-black uppercase text-[10px] tracking-[0.2em] group ${
                activeTab === item.id 
                ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-red-500'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-500 hover:bg-white/5 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
            <Settings className="h-5 w-5" /> Configurações
          </button>
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500/50 hover:bg-red-600 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
            <LogOut className="h-5 w-5" /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent">
        
        {/* TOP BAR */}
        <header className="h-28 px-12 flex items-center justify-between sticky top-0 z-20 bg-[#020617]/50 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10 w-96 group focus-within:border-red-600 transition-all">
            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-red-500" />
            <input type="text" placeholder="Buscar registros, vacinas..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
          </div>

          <div className="flex items-center gap-8">
            <div className="relative cursor-pointer">
              <Bell className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full border-2 border-[#020617]"></span>
            </div>
            <div className="flex items-center gap-4 pl-8 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest">Tutor Premium</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Assinante Elite</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 border border-white/20"></div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="p-12 space-y-12">
          
          {/* HERO: FOTO CENTRALIZADA EM ESCALA MAIOR */}
          <section className="relative flex flex-col items-center py-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[100px] -z-10"></div>
            
            <div className="relative group">
              {/* Moldura da Foto */}
              <div className="h-72 w-72 md:h-96 md:w-96 rounded-[4rem] border-8 border-white/5 p-4 bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative transition-transform duration-700 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800" 
                  alt="Pet Hero" 
                  className="h-full w-full object-cover rounded-[3rem] shadow-inner"
                />
                {/* Badge de Status */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-[0.3em] shadow-xl whitespace-nowrap border-4 border-[#020617]">
                  Saúde: Excelente ⭐
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-2">Maximus Golden</h2>
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Golden Retriever • 3 Anos</p>
            </div>
          </section>

          {/* GRID DE STATUS */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card de Vacina */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:border-red-600/50 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-600/20"><ShieldCheck className="h-6 w-6 text-white" /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Próxima Vacina</p>
                  <p className="text-xl font-black text-white italic uppercase">Em 12 dias</p>
                </div>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">V10 Polivalente</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Proteção contra Cinomose, Parvovirose e outras 8 doenças críticas.</p>
            </div>

            {/* Card de Peso */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:border-red-600/50 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-600/20"><TrendingUp className="h-6 w-6 text-white" /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Peso Atual</p>
                  <p className="text-xl font-black text-white italic uppercase">32.4 KG</p>
                </div>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Controle de Massa</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Ganho de 0.5kg desde o último mês. Mantendo a curva ideal de saúde.</p>
            </div>

            {/* Card de Atividade */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 hover:border-red-600/50 transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-600/20"><Heart className="text-white h-6 w-6" /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bem-estar</p>
                  <p className="text-xl font-black text-white italic uppercase">Nível Pro</p>
                </div>
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Frequência de Passeio</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Meta batida: 7 dias consecutivos com mais de 45 min de exercício.</p>
            </div>
          </div>

          {/* ÚLTIMOS REGISTROS (LISTA ELITE) */}
          <section className="bg-white/5 backdrop-blur-xl p-10 rounded-[4rem] border border-white/10">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter">Histórico Recente</h3>
               <button className="bg-red-600 hover:bg-white text-white hover:text-red-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Adicionar Novo
               </button>
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <Activity className="h-6 w-6 text-slate-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h5 className="font-black uppercase italic text-sm">Consulta de Rotina - Dr. André</h5>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">15 Abr 2026</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-slate-700 group-hover:text-red-500 transition-all" />
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #020617;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
}