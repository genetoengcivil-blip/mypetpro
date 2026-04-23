'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PlusCircle, PawPrint, LogOut, ChevronRight } from 'lucide-react';
import AddPetModal from '@/components/AddPetModal';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [pets, setPets] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('criado_em', { ascending: false });

    if (!error) setPets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <PawPrint className="h-6 w-6" />
            <span className="text-xl font-bold">MyPetPro</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Pets</h1>
            <p className="text-gray-500">Gerencie o cuidado de todos os seus companheiros.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <PlusCircle className="h-5 w-5" />
            Adicionar Pet
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <PawPrint className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum pet cadastrado</h3>
            <p className="text-gray-500">Comece adicionando seu primeiro pet agora mesmo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id} 
                onClick={() => router.push(`/dashboard/pet/${pet.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 overflow-hidden border border-blue-100">
                    {pet.foto_url ? (
                      <img src={pet.foto_url} alt={pet.nome} className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">{pet.nome}</h4>
                    <p className="text-sm text-gray-500">{pet.especie} • {pet.sexo}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition" />
              </div>
            ))}
          </div>
        )}
      </main>

      <AddPetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPets}
      />
    </div>
  );
}