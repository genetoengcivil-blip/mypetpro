'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Syringe, Pill, History, Calendar, Plus } from 'lucide-react';

export default function PetDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [vacinas, setVacinas] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'saude' | 'historico'>('saude');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // CORRIGIDO: Usando a tabela 'vaccines' (mesma do dashboard)
      const [petRes, vacRes, medRes] = await Promise.all([
        supabase.from('pets').select('*').eq('id', id).single(),
        supabase.from('vaccines').select('*').eq('pet_id', id).order('date', { ascending: false }),
        supabase.from('medical_records').select('*').eq('pet_id', id).order('date', { ascending: false })
      ]);

      if (petRes.data) setPet(petRes.data);
      if (vacRes.data) setVacinas(vacRes.data);
      if (medRes.data) setMedicamentos(medRes.data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    </div>
  );
  
  if (!pet) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">Pet não encontrado.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">Voltar</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto p-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="h-12 w-12 rounded-full overflow-hidden border">
            {pet.image ? (
              <img src={pet.image} className="w-full h-full object-cover" alt={pet.name} />
            ) : (
              <div className="bg-blue-100 w-full h-full flex items-center justify-center text-blue-600 font-bold text-lg">
                {pet.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pet.name}</h1>
            <p className="text-sm text-gray-500">{pet.breed} • {pet.weight}</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button 
            onClick={() => setActiveTab('saude')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'saude' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💉 Saúde (Vacinas/Registros)
          </button>
          <button 
            onClick={() => setActiveTab('historico')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'historico' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Linha do Tempo
          </button>
        </div>

        {activeTab === 'saude' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seção Vacinas */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-blue-500" /> 
                  Vacinas
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-2">
                {vacinas.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    Nenhuma vacina registrada.
                    <br />
                    <span className="text-xs">Cadastre no dashboard principal.</span>
                  </p>
                ) : (
                  vacinas.map(v => (
                    <div key={v.id} className="p-3 border-b last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{v.name}</p>
                          <p className="text-xs text-gray-500">
                            {v.date ? new Date(v.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Sem data'}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                          v.status === 'Em dia' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      {v.next_date && (
                        <p className="text-[10px] text-orange-600 mt-1">
                          🔄 Reforço: {new Date(v.next_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Seção Registros Médicos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Pill className="h-5 w-5 text-green-500" /> 
                  Prontuário
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-2">
                {medicamentos.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">
                    Nenhum registro médico.
                  </p>
                ) : (
                  medicamentos.map(m => (
                    <div key={m.id} className="p-3 border-b last:border-0">
                      <p className="font-semibold text-gray-900">{m.title}</p>
                      <p className="text-xs text-gray-500">
                        {m.date ? new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR') : ''} 
                        {m.vet ? ` • Dr(a). ${m.vet}` : ''}
                      </p>
                      {m.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{m.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Linha do Tempo</p>
            <p className="text-sm">O histórico completo de eventos do seu pet aparecerá aqui em breve.</p>
          </div>
        )}
      </main>
    </div>
  );
}