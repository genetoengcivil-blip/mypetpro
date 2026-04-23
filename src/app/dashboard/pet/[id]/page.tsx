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
      const [petRes, vacRes, medRes] = await Promise.all([
        supabase.from('pets').select('*').eq('id', id).single(),
        supabase.from('vacinas').select('*').eq('pet_id', id).order('data_aplicacao', { ascending: false }),
        supabase.from('medicamentos').select('*').eq('pet_id', id).order('data_inicio', { ascending: false })
      ]);

      if (petRes.data) setPet(petRes.data);
      if (vacRes.data) setVacinas(vacRes.data);
      if (medRes.data) setMedicamentos(medRes.data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Carregando detalhes...</div>;
  if (!pet) return <div className="p-10 text-center">Pet não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto p-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div className="h-12 w-12 rounded-full overflow-hidden border">
            {pet.foto_url ? <img src={pet.foto_url} className="w-full h-full object-cover" /> : <div className="bg-blue-100 w-full h-full flex items-center justify-center text-blue-600 font-bold">{pet.nome[0]}</div>}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{pet.nome}</h1>
            <p className="text-sm text-gray-500">{pet.raca || pet.especie} • {pet.sexo}</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex gap-4 border-b mb-6">
          <button 
            onClick={() => setActiveTab('saude')}
            className={`pb-4 px-2 font-medium transition ${activeTab === 'saude' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Saúde (Vacinas/Remédios)
          </button>
          <button 
            onClick={() => setActiveTab('historico')}
            className={`pb-4 px-2 font-medium transition ${activeTab === 'historico' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Linha do Tempo
          </button>
        </div>

        {activeTab === 'saude' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seção Vacinas */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2"><Syringe className="h-5 w-5 text-blue-500" /> Vacinas</h2>
                <button className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100">+ Add</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-2">
                {vacinas.length === 0 ? <p className="p-4 text-sm text-gray-500">Nenhuma vacina registrada.</p> : (
                  vacinas.map(v => (
                    <div key={v.id} className="p-3 border-b last:border-0 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{v.nome}</p>
                        <p className="text-xs text-gray-500">Aplicada em: {new Date(v.data_aplicacao).toLocaleDateString()}</p>
                      </div>
                      {v.proxima_dose && <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-full uppercase font-bold">Reforço: {new Date(v.proxima_dose).toLocaleDateString()}</span>}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Seção Medicamentos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2"><Pill className="h-5 w-5 text-green-500" /> Medicamentos</h2>
                <button className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100">+ Add</button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-2">
                {medicamentos.length === 0 ? <p className="p-4 text-sm text-gray-500">Nenhum medicamento em uso.</p> : (
                  medicamentos.map(m => (
                    <div key={m.id} className="p-3 border-b last:border-0">
                      <p className="font-semibold text-gray-900">{m.nome}</p>
                      <p className="text-xs text-gray-500">{m.dosagem} • {m.frequencia}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-6 text-center text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>O histórico de eventos do seu pet aparecerá aqui em breve.</p>
          </div>
        )}
      </main>
    </div>
  );
}