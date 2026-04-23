'use client';

import React, { useState, useRef } from 'react';
import { X, Loader2, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPetModal({ isOpen, onClose, onSuccess }: AddPetModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    especie: 'Cachorro',
    raca: '',
    sexo: 'Macho',
    data_nascimento: '',
    peso: '',
    observacoes: ''
  });

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não identificado.");

      let foto_url = null;

      // 1. Upload da imagem se houver
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Pega a URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('pet-photos')
          .getPublicUrl(filePath);
        
        foto_url = publicUrl;
      }

      // 2. Salvar no Banco de Dados
      const { error } = await supabase.from('pets').insert([
        {
          tutor_id: user.id,
          nome: formData.nome,
          especie: formData.especie,
          raca: formData.raca,
          sexo: formData.sexo,
          data_nascimento: formData.data_nascimento || null,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          foto_url: foto_url,
          observacoes: formData.observacoes
        }
      ]);

      if (error) throw error;

      onSuccess();
      onClose();
      setPreviewUrl(null);
      setImageFile(null);
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-extrabold text-gray-900">Cadastrar Novo Pet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Upload de Foto */}
          <div className="flex flex-col items-center mb-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 bg-gray-50 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-600 transition"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            <span className="text-sm font-medium text-gray-600 mt-2">Clique para adicionar foto</span>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Nome do Pet *</label>
            <input
              required
              type="text"
              className="appearance-none block w-full px-3 py-2 bg-white border-2 border-gray-400 text-black font-bold rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              placeholder="Digite o nome do pet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Espécie</label>
              <select 
                className="appearance-none block w-full px-3 py-2 bg-white border-2 border-gray-400 text-black font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={formData.especie}
                onChange={(e) => setFormData({...formData, especie: e.target.value})}
              >
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
                <option value="Pássaro">Pássaro</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Sexo</label>
              <select 
                className="appearance-none block w-full px-3 py-2 bg-white border-2 border-gray-400 text-black font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">Raça</label>
            <input
              type="text"
              className="appearance-none block w-full px-3 py-2 bg-white border-2 border-gray-400 text-black font-bold rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              value={formData.raca}
              onChange={(e) => setFormData({...formData, raca: e.target.value})}
              placeholder="Ex: Golden Retriever"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border-2 border-gray-300 rounded-md text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 flex justify-center items-center transition-colors"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Salvar Pet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}