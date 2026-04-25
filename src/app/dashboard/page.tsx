'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Dog, Calendar, ShieldCheck, Activity, Settings, 
  Plus, ChevronRight, TrendingUp, ChevronLeft, Bell,
  Weight, Edit3, Trash2, Camera, Clock, Star, Zap, Dumbbell, Utensils, 
  X, Shield, Thermometer, Heart, Target, LogOut, Printer, Lock, CheckCircle, FileText, Trophy,
  Wallet, FolderOpen, Scissors, Download, DollarSign, Sparkles, PieChart
} from 'lucide-react';

// --- INICIALIZAÇÃO DO SUPABASE ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MyPetProEnterprise() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [actForm, setActForm] = useState({ title: 'Caminhada Leve', duration: '20 min', distance: 'Leve', xp: 30 });

  const [tutor, setTutor] = useState({ name: 'Geraldo Neto', email: 'geraldo@nexus.io', phone: '+55 83 9999-9999', plan: 'Enterprise Elite', photo: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // ESTADOS DOS DADOS
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [nutrition, setNutrition] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [finances, setFinances] = useState<any[]>([]);
  const [grooming, setGrooming] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  
  const getTodayFormatted = () => {
     const tzOffset = (new Date()).getTimezoneOffset() * 60000;
     return (new Date(Date.now() - tzOffset)).toISOString().split('T')[0];
  };

  const calcularIdade = (birthDate: string) => {
    if (!birthDate) return "N/D";
    const today = new Date(); const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age <= 0) return `${(today.getFullYear() - birth.getFullYear()) * 12 + today.getMonth() - birth.getMonth() || 1} Meses`;
    return `${age} Anos`;
  };

  const formatCurrency = (value: number) => {
     return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // --- FUNÇÃO DE LOGOUT (FUNCIONAL) ---
  const handleLogout = async () => {
    if (confirm("Deseja realmente encerrar a sessão?")) {
      try {
        // Faz logout do Supabase
        await supabase.auth.signOut();
        // Remove o perfil do tutor do localStorage
        localStorage.removeItem('nexus_tutor_profile');
        // Redireciona para a página de login/recarregar
        window.location.href = '/';
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao encerrar sessão. Tente novamente.');
      }
    }
  };

  const petActivities = activities?.filter(a => a.pet_id === selectedPet?.id) || [];
  const totalXp = petActivities.reduce((acc, curr) => acc + (Number(curr.xp) || 0), 0);
  const currentLevel = Math.floor(totalXp / 1000) + 1;
  const currentXp = totalXp % 1000;

  const alerts = useMemo(() => {
    if(!selectedPet) return [];
    const today = getTodayFormatted();
    const upcApts = appointments.filter(a => a.pet_id === selectedPet.id && a.date >= today && a.status !== 'Concluído').sort((a,b) => a.date.localeCompare(b.date));
    const pendVacs = vaccines.filter(v => v.pet_id === selectedPet.id && v.status === 'Pendente');
    const pendGrooming = grooming.filter(g => g.pet_id === selectedPet.id && g.next_date && g.next_date >= today && g.next_date <= new Date(Date.now() + 7*86400000).toISOString().split('T')[0]);
    
    return [
       ...pendVacs.map(v => ({ id: `v-${v.id}`, type: 'vacina', msg: `Vacina Pendente: ${v.name}`, date: v.date })),
       ...pendGrooming.map(g => ({ id: `g-${g.id}`, type: 'higiene', msg: `Estética: ${g.service}`, date: g.next_date })),
       ...upcApts.map(a => ({ id: `a-${a.id}`, type: 'agenda', msg: `Agendado: ${a.title}`, date: `${a.date} às ${a.time}` }))
    ];
  }, [appointments, vaccines, grooming, selectedPet]);

  useEffect(() => { 
    setMounted(true); 

    const savedTutor = localStorage.getItem('nexus_tutor_profile');
    if (savedTutor) setTutor(JSON.parse(savedTutor));

    const fetchAllData = async () => {
      try {
        if (!supabaseUrl) { setFetchError("Chaves do Supabase ausentes"); return setIsLoading(false); }

        const { data: petsData } = await supabase.from('pets').select('*');
        if (petsData && petsData.length > 0) { setPets(petsData); setSelectedPet(petsData[0]); }

        const [ timeRes, aptRes, vacRes, medRes, nutRes, actRes, finRes, groomRes, docRes ] = await Promise.all([
          supabase.from('timeline').select('*').order('date', { ascending: false }),
          supabase.from('appointments').select('*').order('date', { ascending: true }),
          supabase.from('vaccines').select('*'),
          supabase.from('medical_records').select('*'),
          supabase.from('nutrition').select('*'),
          supabase.from('activities').select('*'),
          supabase.from('finances').select('*').order('date', { ascending: false }),
          supabase.from('grooming').select('*').order('date', { ascending: false }),
          supabase.from('documents').select('*')
        ]);

        if (timeRes.data) setTimeline(timeRes.data);
        if (aptRes.data) setAppointments(aptRes.data);
        if (vacRes.data) setVaccines(vacRes.data);
        if (medRes.data) setMedicalRecords(medRes.data);
        if (nutRes.data) setNutrition(nutRes.data);
        if (actRes.data) setActivities(actRes.data);
        if (finRes.data) setFinances(finRes.data);
        if (groomRes.data) setGrooming(groomRes.data);
        if (docRes.data) setDocuments(docRes.data);

      } catch (error) { setFetchError("Falha ao conectar com o banco de dados. Tabelas criadas?"); } finally { setIsLoading(false); }
    };

    fetchAllData();
  }, []);

  const calendar = useMemo(() => {
    const month = currentDate.getMonth(); const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); const firstDay = new Date(year, month, 1).getDay();
    const names = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return { daysInMonth, firstDay, monthName: names[month], year, month };
  }, [currentDate]);

  const selectedFullDateStr = useMemo(() => {
     return `${calendar.year}-${String(calendar.month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  }, [calendar, selectedDay]);

  // CÁLCULOS DO DASHBOARD FINANCEIRO (COM GRÁFICO)
  const monthlyFinances = useMemo(() => {
     if(!selectedPet) return [];
     return finances.filter(f => {
        if(f.pet_id !== selectedPet.id) return false;
        const [y, m] = f.date.split('-');
        return parseInt(y) === calendar.year && parseInt(m) === calendar.month + 1;
     });
  }, [finances, selectedPet, calendar]);

  const totalMensal = monthlyFinances.reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Função para calcular o percentual e o ângulo do gráfico
  const getChartData = useMemo(() => {
    const expensesByCategory = monthlyFinances.reduce((acc: any, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + Number(curr.amount);
      return acc;
    }, {});
    
    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 4);
    
    // Calcular percentuais para o gráfico donut
    let currentAngle = 0;
    const segments = sortedCategories.map(([cat, amount]: any) => {
      const percent = totalMensal > 0 ? (amount / totalMensal) * 100 : 0;
      const angle = percent * 3.6;
      const start = currentAngle;
      const end = start + angle;
      currentAngle = end;
      return { cat, amount, percent, start, end };
    });
    
    return segments;
  }, [monthlyFinances, totalMensal]);

  // Função para desenhar o arco SVG
  const getArcPath = (startAngle: number, endAngle: number, radius: number = 16) => {
    const center = 18;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  if (!mounted) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image(); img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas'); const MAX = 800; let w = img.width; let h = img.height;
        if (w > h && w > MAX) { h *= MAX / w; w = MAX; } else if (h > MAX) { w *= MAX / h; h = MAX; }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
        setImagePreview(canvas.toDataURL('image/jpeg', 0.7));
      };
    };
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]; if (!file) return;
     const reader = new FileReader(); reader.readAsDataURL(file);
     reader.onload = (event) => { setFilePreview(event.target?.result as string); };
  };

  const handleTutorPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image(); img.src = event.target?.result as string;
      img.onload = () => {
         const canvas = document.createElement('canvas'); const MAX = 400; let w = img.width; let h = img.height;
         if (w > h && w > MAX) { h *= MAX / w; w = MAX; } else if (h > MAX) { w *= MAX / h; h = MAX; }
         canvas.width = w; canvas.height = h;
         const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
         
         const finalImage = canvas.toDataURL('image/jpeg', 0.8);
         const newTutor = {...tutor, photo: finalImage};
         setTutor(newTutor);
         localStorage.setItem('nexus_tutor_profile', JSON.stringify(newTutor)); 
      };
    };
  };

  const handleUpdateTutor = (e: React.FormEvent<HTMLFormElement>) => { 
     e.preventDefault(); 
     const fd = new FormData(e.currentTarget); 
     const newTutor = { ...tutor, name: fd.get('name') as string, email: fd.get('email') as string, phone: fd.get('phone') as string };
     setTutor(newTutor); 
     localStorage.setItem('nexus_tutor_profile', JSON.stringify(newTutor));
     alert("Configurações atualizadas e salvas!"); 
  };

  const openModal = (type: string, item: any = null) => { 
     setEditingItem(item); 
     setImagePreview(item?.image || item?.photo || null); 
     setFilePreview(item?.file_data || null);
     
     if (type === 'atividade') {
        if (item) setActForm({ title: item.title, duration: item.duration, distance: item.distance, xp: item.xp });
        else setActForm({ title: 'Caminhada Leve', duration: '20 min', distance: 'Leve', xp: 30 });
     }
     setActiveModal(type); 
  };

  const deleteItem = async (table: string, stateSetter: any, items: any[], id: string) => {
    if(!window.confirm("Tem certeza que deseja excluir este registro fisicamente?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      stateSetter(items.filter((item: any) => item.id !== id));
      if (table === 'pets' && selectedPet?.id === id) setSelectedPet(items.find((item: any) => item.id !== id) || null);
    } else { alert('Erro ao apagar item. Tabela criada?'); }
  };

  const handleCompleteAppointment = async (item: any) => {
     if(!window.confirm("Marcar compromisso como concluído? Ele ficará salvo no histórico da agenda.")) return;
     const { error } = await supabase.from('appointments').update({ status: 'Concluído' }).eq('id', item.id);
     if (!error) setAppointments(appointments.map((a: any) => a.id === item.id ? { ...a, status: 'Concluído' } : a));
     else { alert("Aviso: Adicione a coluna 'status' na tabela 'appointments' no Supabase."); setAppointments(appointments.map((a: any) => a.id === item.id ? { ...a, status: 'Concluído' } : a)); }
  };
  
  const handleSavePet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const fd = new FormData(e.currentTarget);
    const petData = { name: fd.get('name') as string, breed: fd.get('breed') as string, weight: fd.get('weight') as string + 'kg', birth_date: fd.get('birth_date') as string, image: imagePreview || editingItem?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400', status: editingItem?.status || 'Excelente', level: editingItem?.level || 1, xp: editingItem?.xp || 0, next_xp: 1000 };
    if (editingItem) { const { data } = await supabase.from('pets').update(petData).eq('id', editingItem.id).select(); if (data) { setPets(pets.map(p => p.id === data[0].id ? data[0] : p)); if(selectedPet?.id === data[0].id) setSelectedPet(data[0]); } } 
    else { const { data } = await supabase.from('pets').insert([petData]).select(); if (data) { setPets([data[0], ...pets]); setSelectedPet(data[0]); setActiveTab('dashboard'); } }
    setActiveModal(null);
  };

  const handleSaveTimeline = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
    const itemData = { pet_id: selectedPet.id, title: fd.get('title') as string, date: fd.get('date') as string, weight: fd.get('weight') as string + 'kg', photo: imagePreview || editingItem?.photo || 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400' };
    if(editingItem) { const { data } = await supabase.from('timeline').update(itemData).eq('id', editingItem.id).select(); if(data) setTimeline(timeline.map(t => t.id === data[0].id ? data[0] : t).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())); } 
    else { const { data } = await supabase.from('timeline').insert([itemData]).select(); if(data) setTimeline([data[0], ...timeline].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())); }
    setActiveModal(null);
  };

  const handleSaveAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
    const itemData = { pet_id: selectedPet.id, title: fd.get('title') as string, date: fd.get('date') as string, time: fd.get('time') as string, clinic: fd.get('clinic') as string, vet: fd.get('vet') as string, status: editingItem?.status || 'Pendente' };
    if(editingItem) { const { data, error } = await supabase.from('appointments').update(itemData).eq('id', editingItem.id).select(); if(data && !error) { setAppointments(appointments.map(a => a.id === data[0].id ? data[0] : a).sort((a,b) => a.date.localeCompare(b.date))); } else setAppointments(appointments.map(a => a.id === editingItem.id ? { ...a, ...itemData } : a).sort((a,b) => a.date.localeCompare(b.date))); } 
    else { const { data, error } = await supabase.from('appointments').insert([itemData]).select(); if(data && !error) { setAppointments([...appointments, data[0]].sort((a,b) => a.date.localeCompare(b.date))); } else setAppointments([...appointments, { ...itemData, id: Date.now().toString() }].sort((a,b) => a.date.localeCompare(b.date))); }
    setActiveModal(null);
  };

  const handleSaveVaccine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
    const itemData = { pet_id: selectedPet.id, name: fd.get('name') as string, date: fd.get('date') as string, next_date: fd.get('next_date') as string, status: fd.get('status') as string };
    
    if(editingItem) { 
       const { data } = await supabase.from('vaccines').update(itemData).eq('id', editingItem.id).select(); 
       if(data) setVaccines(vaccines.map(v => v.id === data[0].id ? data[0] : v)); 
    } else { 
       const { data } = await supabase.from('vaccines').insert([itemData]).select(); 
       if(data) {
          setVaccines([data[0], ...vaccines]); 
          if(itemData.next_date) {
             const aptData = { pet_id: selectedPet.id, title: `Reforço da Vacina: ${itemData.name}`, date: itemData.next_date, time: '08:00', clinic: 'Lembrete de Imunização', vet: '', status: 'Pendente' };
             const { data: aptRes, error } = await supabase.from('appointments').insert([aptData]).select();
             if(aptRes && !error) setAppointments(prev => [...prev, aptRes[0]].sort((a,b) => a.date.localeCompare(b.date)));
             else setAppointments(prev => [...prev, { ...aptData, id: Date.now().toString() }].sort((a,b) => a.date.localeCompare(b.date)));
          }
       }
    }
    setActiveModal(null);
  };

  const handleSaveMedical = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
    const itemData = { pet_id: selectedPet.id, title: fd.get('title') as string, date: fd.get('date') as string, description: fd.get('desc') as string, vet: fd.get('vet') as string, clinic: fd.get('clinic') as string };
    if(editingItem) { const { data } = await supabase.from('medical_records').update(itemData).eq('id', editingItem.id).select(); if(data) setMedicalRecords(medicalRecords.map(m => m.id === data[0].id ? data[0] : m)); } 
    else { const { data } = await supabase.from('medical_records').insert([itemData]).select(); if(data) setMedicalRecords([data[0], ...medicalRecords]); }
    setActiveModal(null);
  };

  const handleSaveNutrition = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
    const itemData = { pet_id: selectedPet.id, title: fd.get('title') as string, value: fd.get('value') as string, detail: fd.get('detail') as string };
    if(editingItem) { const { data } = await supabase.from('nutrition').update(itemData).eq('id', editingItem.id).select(); if(data) setNutrition(nutrition.map(n => n.id === data[0].id ? data[0] : n)); } 
    else { const { data } = await supabase.from('nutrition').insert([itemData]).select(); if(data) setNutrition([...nutrition, data[0]]); }
    setActiveModal(null);
  };

  const handleSaveActivity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if(!selectedPet) return; 
    const itemData = { pet_id: selectedPet.id, title: actForm.title, duration: actForm.duration, distance: actForm.distance, xp: Number(actForm.xp) };
    if(editingItem) { const { data } = await supabase.from('activities').update(itemData).eq('id', editingItem.id).select(); if(data) setActivities(activities.map(a => a.id === data[0].id ? data[0] : a)); } 
    else { const { data } = await supabase.from('activities').insert([itemData]).select(); if(data) setActivities([data[0], ...activities]); }
    setActiveModal(null);
  };

  const handleSaveFinance = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
     const itemData = { pet_id: selectedPet.id, type: fd.get('type') as string, amount: parseFloat(fd.get('amount') as string), date: fd.get('date') as string, description: fd.get('desc') as string };
     if(editingItem) { const { data, error } = await supabase.from('finances').update(itemData).eq('id', editingItem.id).select(); if(data && !error) setFinances(finances.map(f => f.id === data[0].id ? data[0] : f)); else setFinances(finances.map(f => f.id === editingItem.id ? {...f, ...itemData} : f)); }
     else { const { data, error } = await supabase.from('finances').insert([itemData]).select(); if(data && !error) setFinances([data[0], ...finances]); else setFinances([{...itemData, id: Date.now().toString()}, ...finances]); }
     setActiveModal(null);
  };

  const handleSaveDocument = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
     const itemData = { pet_id: selectedPet.id, title: fd.get('title') as string, category: fd.get('category') as string, file_data: filePreview || editingItem?.file_data || '' };
     if(editingItem) { const { data, error } = await supabase.from('documents').update(itemData).eq('id', editingItem.id).select(); if(data && !error) setDocuments(documents.map(d => d.id === data[0].id ? data[0] : d)); else setDocuments(documents.map(d => d.id === editingItem.id ? {...d, ...itemData} : d)); }
     else { const { data, error } = await supabase.from('documents').insert([itemData]).select(); if(data && !error) setDocuments([data[0], ...documents]); else setDocuments([{...itemData, id: Date.now().toString()}, ...documents]); }
     setActiveModal(null);
  };

  const handleSaveGrooming = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault(); if(!selectedPet) return; const fd = new FormData(e.currentTarget);
     const itemData = { pet_id: selectedPet.id, service: fd.get('service') as string, date: fd.get('date') as string, next_date: fd.get('next_date') as string, notes: fd.get('notes') as string };
     
     if(editingItem) { 
        const { data, error } = await supabase.from('grooming').update(itemData).eq('id', editingItem.id).select(); 
        if(data && !error) setGrooming(grooming.map(g => g.id === data[0].id ? data[0] : g)); 
        else setGrooming(grooming.map(g => g.id === editingItem.id ? {...g, ...itemData} : g));
     } else { 
        const { data, error } = await supabase.from('grooming').insert([itemData]).select(); 
        if(data && !error) {
           setGrooming([data[0], ...grooming]); 
           if(itemData.next_date) {
              const aptData = { pet_id: selectedPet.id, title: `Higiene: ${itemData.service}`, date: itemData.next_date, time: '09:00', clinic: 'Petshop / Estética', vet: '', status: 'Pendente' };
              const { data: aptRes } = await supabase.from('appointments').insert([aptData]).select();
              if(aptRes) setAppointments(prev => [...prev, aptRes[0]].sort((a,b) => a.date.localeCompare(b.date)));
           }
        } else {
           setGrooming([{...itemData, id: Date.now().toString()}, ...grooming]);
        }
     }
     setActiveModal(null);
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (passwordForm.new !== passwordForm.confirm) { alert("Senhas não coincidem!"); return; } alert("Senha atualizada!"); setPasswordForm({ current: '', new: '', confirm: '' }); };
  const handlePrintReport = () => { window.print(); };

  if (isLoading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4"><Zap className="h-16 w-16 text-orange-600 animate-pulse" /><p className="text-white font-black uppercase tracking-widest text-sm italic">Sincronizando Banco de Dados...</p></div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-[#020617] font-sans text-slate-100 flex overflow-hidden selection:bg-orange-600/30 print:hidden">
        
        {/* SIDEBAR */}
        <aside className={`relative bg-[#0c1222]/95 border-r border-white/5 flex flex-col z-30 transition-all duration-500 ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-32 bg-orange-600 p-2 rounded-full border-4 border-[#020617] text-white z-50 shadow-xl hover:scale-110"><ChevronLeft className={`h-4 w-4 ${!isSidebarOpen && "rotate-180"}`} /></button>
          <div className="h-32 flex items-center justify-center border-b border-white/5 p-6">
             <img src="/logo.png" alt="Logo" className={`transition-all duration-500 object-contain ${isSidebarOpen ? 'max-h-38 w-auto' : 'max-h-38 w-auto'}`} />
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {[
              { t: "Dashboard", i: [{ id: 'dashboard', icon: LayoutDashboard, l: 'Painel Geral' }, { id: 'pets', icon: Dog, l: 'Meus Pets' }, { id: 'evolução', icon: TrendingUp, l: 'Evolução (Timeline)' }] },
              { t: "Saúde & Estética", i: [{ id: 'agenda', icon: Calendar, l: 'Agenda' }, { id: 'vacinas', icon: ShieldCheck, l: 'Vacinas' }, { id: 'prontuario', icon: Activity, l: 'Prontuário' }, { id: 'higiene', icon: Scissors, l: 'Higiene & Estética' }] },
              { t: "Gestão", i: [{ id: 'alimentacao', icon: Utensils, l: 'Nutrição' }, { id: 'atividades', icon: Dumbbell, l: 'Atividades' }, { id: 'financeiro', icon: Wallet, l: 'Financeiro' }, { id: 'documentos', icon: FolderOpen, l: 'Cofre (Docs)' }, { id: 'config', icon: Settings, l: 'Configurações' }] }
            ].map((sec, idx) => (
              <div key={idx} className="mb-6">{isSidebarOpen && <h3 className="px-6 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-600">{sec.t}</h3>}
                {sec.i.map(item => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center rounded-2xl transition-all h-12 mb-1 font-bold uppercase text-[10px] tracking-widest ${activeTab === item.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'} ${isSidebarOpen ? 'px-6 gap-4' : 'justify-center'}`}><item.icon className="h-4 w-4 shrink-0" />{isSidebarOpen && <span className="truncate">{item.l}</span>}</button>))}
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest"
            >
              <LogOut className="h-4 w-4" /> {isSidebarOpen && "Sair do Sistema"}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.05),_transparent)]">
          <header className="h-28 px-12 flex items-center justify-between sticky top-0 z-20 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
             <div className="flex flex-col"><h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">{activeTab.toUpperCase()}</h2><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">{selectedPet ? `Sessão: ${selectedPet.name}` : 'Nenhum Pet Selecionado'}</p></div>
             
             {fetchError && <div className="bg-red-600/20 text-red-500 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/50">{fetchError}</div>}

             {selectedPet && (
               <div className="flex gap-6 items-center">
                 
                  {/* SININHO DE ALERTAS */}
                  <div className="relative">
                     <button onClick={() => setIsAlertOpen(!isAlertOpen)} className="relative p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                        <Bell className="h-5 w-5 text-slate-300" />
                        {alerts.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-orange-600 items-center justify-center text-[8px] font-black">{alerts.length}</span></span>}
                     </button>
                     {isAlertOpen && (
                        <div className="absolute right-0 mt-4 w-80 bg-[#0c1222] border border-white/10 shadow-2xl rounded-3xl p-6 z-50 animate-in fade-in slide-in-from-top-4">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Lembretes do Pet</h4>
                           {alerts.length > 0 ? alerts.map(a => (
                              <div key={a.id} className="border-b border-white/5 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
                                 <p className="text-xs font-black text-white italic mb-1">{a.msg}</p>
                                 <p className="text-[10px] font-bold text-orange-500 uppercase">{a.date.split('-').reverse().join('/')}</p>
                              </div>
                           )) : <p className="text-xs font-bold text-slate-500">Nenhum alerta pendente.</p>}
                        </div>
                     )}
                  </div>

                  <button onClick={handlePrintReport} className="hidden md:flex bg-white/10 hover:bg-white hover:text-[#020617] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest items-center gap-2 transition-all"><Printer className="h-4 w-4" /> Dossiê PDF</button>

                  <select value={selectedPet.id} onChange={(e) => { const pet = pets.find(p => p.id === e.target.value); if(pet) setSelectedPet(pet); }} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black uppercase text-white outline-none cursor-pointer">
                     {pets?.map(p => <option key={p.id} value={p.id} className="bg-[#020617]">{p.name}</option>)}
                  </select>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-900 flex items-center justify-center font-black italic shadow-lg border border-white/10 text-white text-xl uppercase overflow-hidden">
                     {selectedPet.image ? <img src={selectedPet.image} className="w-full h-full object-cover" /> : selectedPet.name?.[0]}
                  </div>
               </div>
             )}
          </header>

          <div className="p-12 space-y-12 pb-32">
            {!selectedPet && activeTab !== 'pets' && activeTab !== 'config' ? (
               <div className="flex flex-col items-center justify-center h-96 border-4 border-dashed border-white/5 rounded-[4rem]"><Dog className="h-16 w-16 text-slate-500 mb-4" /><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Nenhum Pet Selecionado</h3><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2 mb-8">Cadastre um animal ou selecione um existente no topo.</p><button onClick={() => {setActiveTab('pets'); openModal('pet');}} className="bg-orange-600 px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Cadastrar Pet</button></div>
            ) : (
              <>
                {/* === ABA DASHBOARD (COM GRÁFICO FINANCEIRO) === */}
                {activeTab === 'dashboard' && selectedPet && (
                  <div className="space-y-8 animate-in fade-in duration-700">
                     <section className="flex flex-col xl:flex-row gap-12 items-center bg-white/5 p-12 rounded-[4rem] border border-white/5 shadow-2xl relative">
                        <div className="shrink-0 relative">
                          <div className="h-[320px] w-[320px] rounded-[3.5rem] border-[10px] border-white/5 p-2 bg-gradient-to-b from-white/10 to-transparent shadow-2xl overflow-hidden"><img src={selectedPet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400'} className="h-full w-full object-cover rounded-[2.8rem]" alt="Hero" /></div>
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl border-4 border-[#020617] flex items-center gap-2"><Star className="h-3 w-3" /> Lvl {currentLevel}</div>
                        </div>
                        <div className="flex-1 w-full space-y-8">
                           <div className="flex justify-between items-end border-b border-white/10 pb-8">
                              <div><h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">{selectedPet.name}</h1><p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">{selectedPet.breed}</p></div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black text-orange-400 uppercase mb-3 tracking-widest">{currentXp} / 1000 XP</p>
                                 <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-orange-600 transition-all duration-1000 ease-out" style={{ width: `${(currentXp / 1000) * 100}%` }}></div></div>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {[ { i: Weight, l: "Massa", v: selectedPet.weight }, { i: Heart, l: "Saúde", v: selectedPet.status }, { i: Clock, l: "Idade", v: calcularIdade(selectedPet.birth_date) }, { i: Thermometer, l: "Monitor", v: "Ativo" } ].map((c, i) => (
                                <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-orange-600 transition-all group flex flex-col items-center text-center">
                                   <c.i className="h-6 w-6 text-orange-600 mb-3 group-hover:scale-110" /><p className="text-[9px] font-black text-slate-500 uppercase">{c.l}</p><p className="text-xl font-black uppercase italic text-white mt-1">{c.v}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                     </section>

                     <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col">
                           <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                              <h3 className="text-2xl font-black uppercase italic text-white">Próximos Compromissos</h3>
                              <button onClick={() => setActiveTab('agenda')} className="text-[10px] uppercase font-black tracking-widest text-orange-500 hover:text-white transition-colors">Ver Agenda</button>
                           </div>
                           <div className="space-y-4 flex-1">
                              {appointments?.filter(a => a.pet_id === selectedPet.id && a.date >= getTodayFormatted() && a.status !== 'Concluído').slice(0, 3).map(a => (
                                 <div key={a.id} className="bg-[#020617] p-5 rounded-3xl border border-white/5 flex items-center justify-between group">
                                    <div>
                                       <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">{a.date.split('-').reverse().join('/')} • {a.time}</p>
                                       <h4 className="font-black text-white italic">{a.title}</h4>
                                    </div>
                                    <button onClick={() => handleCompleteAppointment(a)} title="Marcar como concluído" className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:bg-green-600 hover:text-white transition-colors">
                                       <CheckCircle className="h-5 w-5" />
                                    </button>
                                 </div>
                              ))}
                              {appointments?.filter(a => a.pet_id === selectedPet.id && a.date >= getTodayFormatted() && a.status !== 'Concluído').length === 0 && (
                                 <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-6 text-slate-600 font-bold uppercase text-[10px] tracking-widest">Nenhum compromisso próximo.</div>
                              )}
                           </div>
                        </div>

                        {/* NOVO BLOCO: RESUMO FINANCEIRO MENSAL COM GRÁFICO DONUT ESTILIZADO */}
                        <div className="flex flex-col justify-between bg-gradient-to-br from-emerald-600/10 to-transparent p-10 rounded-[3rem] border border-emerald-600/20 shadow-2xl">
                           <div>
                              <div className="flex justify-between items-start mb-6">
                                 <div className="h-16 w-16 bg-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl"><DollarSign className="h-8 w-8" /></div>
                                 <button onClick={() => setActiveTab('financeiro')} className="text-[10px] uppercase font-black tracking-widest text-emerald-500 hover:text-white transition-colors mt-2">Detalhes Financeiros</button>
                              </div>
                              <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter mb-1">Despesas Mensais</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Competência: {calendar.monthName} / {calendar.year}</p>
                              
                              <div className="flex items-center gap-10 mb-8 flex-wrap">
                                <h2 className="text-5xl font-black italic text-emerald-500">{formatCurrency(totalMensal)}</h2>
                                {/* GRÁFICO DONUT ESTILIZADO */}
                                {totalMensal > 0 && getChartData.length > 0 && (
                                  <div className="relative h-28 w-28">
                                    <svg viewBox="0 0 36 36" className="h-full w-full">
                                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#10b98120" strokeWidth="3.5"></circle>
                                      {getChartData.map((segment, idx) => {
                                        const radius = 15.9155;
                                        const startRad = (segment.start * Math.PI) / 180;
                                        const endRad = (segment.end * Math.PI) / 180;
                                        const x1 = 18 + radius * Math.cos(startRad);
                                        const y1 = 18 + radius * Math.sin(startRad);
                                        const x2 = 18 + radius * Math.cos(endRad);
                                        const y2 = 18 + radius * Math.sin(endRad);
                                        const largeArc = segment.end - segment.start > 180 ? 1 : 0;
                                        const pathData = `M 18 18 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                                        const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857'];
                                        return (
                                          <path 
                                            key={idx}
                                            d={pathData}
                                            fill={colors[idx % colors.length]}
                                            stroke="#020617"
                                            strokeWidth="0.5"
                                            className="transition-all duration-700 ease-out hover:opacity-80"
                                          />
                                        );
                                      })}
                                      <circle cx="18" cy="18" r="10" fill="#0c1222" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <PieChart className="h-5 w-5 text-emerald-500" />
                                    </div>
                                  </div>
                                )}
                              </div>
                           </div>

                           <div className="space-y-4">
                              {getChartData.length > 0 ? (
                                 getChartData.map((segment, idx) => {
                                    const colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857'];
                                    return (
                                       <div key={idx}>
                                          <div className="flex justify-between text-[10px] text-white font-black uppercase mb-2 tracking-widest">
                                             <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }}></span>{segment.cat}</span>
                                             <span>{formatCurrency(segment.amount)}</span>
                                          </div>
                                          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                                             <div className="h-full rounded-full transition-all duration-1000" style={{width: `${segment.percent}%`, backgroundColor: colors[idx % colors.length]}}></div>
                                          </div>
                                       </div>
                                    )
                                 })
                              ) : (
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-4 border-t border-white/10 pt-4">Nenhum custo registrado este mês.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                )}

                {/* === ABA FINANCEIRO === */}
                {activeTab === 'financeiro' && selectedPet && (
                  <div className="animate-in fade-in duration-700 max-w-5xl">
                     <div className="bg-gradient-to-r from-emerald-600/20 to-transparent p-10 rounded-[4rem] border border-emerald-600/30 shadow-2xl mb-12 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="h-20 w-20 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl"><DollarSign className="h-10 w-10" /></div>
                           <div>
                              <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Custo Total Histórico</h3>
                              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Soma de todo o período no App</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-5xl font-black italic text-emerald-500">
                              {formatCurrency(finances?.filter(f => f.pet_id === selectedPet.id).reduce((acc, curr) => acc + Number(curr.amount), 0) || 0)}
                           </span>
                        </div>
                     </div>

                     <div className="bg-white/5 p-12 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-5"><Wallet className="h-64 w-64 text-emerald-600" /></div>
                        <div className="flex justify-between items-center mb-12 relative z-10"><h3 className="text-4xl font-black uppercase italic text-white">Histórico de Despesas</h3><button onClick={() => openModal('financeiro')} className="bg-emerald-600 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 flex items-center gap-2"><Plus className="h-4 w-4"/> Nova Despesa</button></div>
                        <div className="space-y-4 relative z-10">
                           {finances?.filter(f => f.pet_id === selectedPet.id).map(f => (
                             <div key={f.id} className="p-8 bg-[#020617] border border-white/5 rounded-[3rem] flex justify-between items-center hover:border-emerald-600 transition-all">
                                <div><h5 className="font-black uppercase text-white italic text-xl">{f.type}</h5><p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{f.date.split('-').reverse().join('/')} • {f.description}</p></div>
                                <div className="flex items-center gap-6">
                                   <span className="text-2xl font-black italic text-emerald-500">{formatCurrency(f.amount)}</span>
                                   <div className="flex gap-2"><button onClick={() => openModal('financeiro', f)} className="bg-white/5 p-3 rounded-xl hover:bg-emerald-600 text-slate-500 hover:text-white"><Edit3 className="h-5 w-5"/></button><button onClick={() => deleteItem('finances', setFinances, finances, f.id)} className="bg-white/5 p-3 rounded-xl hover:bg-red-600 text-slate-500 hover:text-white"><Trash2 className="h-5 w-5"/></button></div>
                                </div>
                             </div>
                           ))}
                           {finances?.filter(f => f.pet_id === selectedPet.id).length === 0 && <div className="border-2 border-dashed border-white/10 p-10 rounded-[3rem] text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">Nenhuma despesa registrada.</div>}
                        </div>
                     </div>
                  </div>
                )}

                {/* === ABA COFRE DE DOCUMENTOS === */}
                {activeTab === 'documentos' && selectedPet && (
                  <div className="space-y-12 animate-in fade-in duration-700">
                     <div className="flex justify-between items-center bg-white/5 p-10 rounded-[3rem] border border-white/5"><div><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Cofre de Documentos</h3><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Exames, Pedigree e Receitas</p></div><button onClick={() => openModal('documento')} className="bg-orange-600 px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl hover:scale-105"><Plus className="h-5 w-5" /> Fazer Upload</button></div>
                     <div className="grid md:grid-cols-3 gap-8">
                        {documents?.filter(d => d.pet_id === selectedPet.id).map(d => (
                          <div key={d.id} className="p-10 bg-white/5 rounded-[3rem] border border-white/5 hover:border-orange-600 transition-all flex flex-col items-center text-center shadow-xl">
                             <div className="h-20 w-20 bg-orange-600/20 rounded-3xl flex items-center justify-center text-orange-500 mb-6"><FolderOpen className="h-10 w-10" /></div>
                             <h4 className="text-xl font-black uppercase italic text-white mb-1 leading-tight">{d.title}</h4>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">{d.category}</p>
                             <div className="flex gap-2 w-full">
                                <a href={d.file_data} download={d.title} className="flex-1 bg-white/10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all hover:bg-orange-600 text-white flex items-center justify-center gap-2"><Download className="h-4 w-4"/> Baixar</a>
                                <button onClick={() => deleteItem('documents', setDocuments, documents, d.id)} className="p-3 bg-white/10 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-600/20"><Trash2 className="h-4 w-4" /></button>
                             </div>
                          </div>
                        ))}
                        {documents?.filter(d => d.pet_id === selectedPet.id).length === 0 && <div className="col-span-3 border-2 border-dashed border-white/10 p-20 rounded-[4rem] text-center text-slate-500 font-bold uppercase text-xs tracking-widest">Nenhum documento no cofre.</div>}
                     </div>
                  </div>
                )}

                {/* === ABA HIGIENE E ESTÉTICA === */}
                {activeTab === 'higiene' && selectedPet && (
                  <div className="animate-in fade-in duration-700 max-w-5xl">
                     <div className="bg-white/5 p-12 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-5"><Scissors className="h-64 w-64 text-orange-600" /></div>
                        <div className="flex justify-between items-center mb-12 relative z-10"><h3 className="text-4xl font-black uppercase italic text-white">Higiene & Estética</h3><button onClick={() => openModal('higiene')} className="bg-orange-600 p-4 rounded-2xl"><Plus className="h-6 w-6 text-white" /></button></div>
                        <div className="space-y-6 relative z-10">
                           {grooming?.filter(g => g.pet_id === selectedPet.id).map(g => (
                             <div key={g.id} className="p-8 bg-[#020617] border border-white/5 rounded-[3rem] flex justify-between items-center hover:border-orange-600 transition-all">
                                <div className="flex items-center gap-6">
                                   <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500"><Sparkles className="h-6 w-6" /></div>
                                   <div><h5 className="font-black uppercase text-white italic text-xl">{g.service}</h5><p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{g.date.split('-').reverse().join('/')} {g.notes && `• ${g.notes}`}</p></div>
                                </div>
                                <div className="flex items-center gap-6">
                                   <div className="text-right mr-4"><p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Próximo</p><p className="text-lg font-black text-orange-500 italic">{g.next_date ? g.next_date.split('-').reverse().join('/') : '-'}</p></div>
                                   <div className="flex gap-2"><button onClick={() => openModal('higiene', g)} className="bg-white/5 p-3 rounded-xl hover:bg-orange-600 text-slate-500 hover:text-white"><Edit3 className="h-5 w-5"/></button><button onClick={() => deleteItem('grooming', setGrooming, grooming, g.id)} className="bg-white/5 p-3 rounded-xl hover:bg-red-600 text-slate-500 hover:text-white"><Trash2 className="h-5 w-5"/></button></div>
                                </div>
                             </div>
                           ))}
                           {grooming?.filter(g => g.pet_id === selectedPet.id).length === 0 && <div className="border-2 border-dashed border-white/10 p-10 rounded-[3rem] text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">Nenhum registro de higiene.</div>}
                        </div>
                     </div>
                  </div>
                )}

                {/* === ABA PETS === */}
                {activeTab === 'pets' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                     <div className="flex justify-between items-center bg-white/5 p-10 rounded-[3rem] border border-white/5"><div><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Gerenciar Pets</h3><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Total: {pets?.length || 0}</p></div><button onClick={() => openModal('pet')} className="bg-orange-600 px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl hover:scale-105"><Plus className="h-5 w-5" /> Adicionar Pet</button></div>
                     <div className="grid md:grid-cols-3 gap-8">
                        {pets?.map(p => (
                          <div key={p.id} className={`p-10 rounded-[4.5rem] border-2 transition-all ${selectedPet?.id === p.id ? 'border-orange-600 bg-white/10 shadow-2xl' : 'border-white/5 bg-white/5'}`}>
                             <img src={p.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400'} className="h-24 w-24 rounded-3xl object-cover mb-8 shadow-xl" alt={p.name} /><h4 className="text-3xl font-black uppercase italic text-white mb-1">{p.name}</h4><p className="text-[10px] font-bold text-slate-500 uppercase mb-8">{p.breed} • {p.weight}</p>
                             <div className="flex gap-2">
                                <button onClick={() => {setSelectedPet(p); setActiveTab('dashboard');}} className="flex-1 bg-orange-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Focar</button>
                                <button onClick={() => openModal('pet', p)} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-white"><Edit3 className="h-5 w-5" /></button>
                                <button onClick={() => deleteItem('pets', setPets, pets, p.id)} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-red-500"><Trash2 className="h-5 w-5" /></button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* === ABA EVOLUÇÃO === */}
                {activeTab === 'evolução' && selectedPet && (
                  <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl mx-auto">
                     <div className="flex justify-between items-center bg-white/5 p-10 rounded-[4rem] border border-white/5 shadow-2xl">
                        <div><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Linha do Tempo</h3><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Evolução de {selectedPet.name}</p></div>
                        <button onClick={() => openModal('timeline')} className="bg-orange-600 px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-4"><Camera className="h-5 w-5" /> Novo Registro</button>
                     </div>
                     <div className="relative pl-12 space-y-10 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-1 before:bg-white/10 before:rounded-full">
                        {timeline?.filter(t => t.pet_id === selectedPet.id).map(t => (
                          <div key={t.id} className="relative group">
                             <div className="absolute -left-[43px] top-8 h-8 w-8 bg-[#020617] border-4 border-orange-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.5)] z-10 group-hover:scale-125 transition-transform"><div className="h-2 w-2 bg-orange-600 rounded-full"></div></div>
                             <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5 flex flex-col md:flex-row gap-8 items-center shadow-xl hover:border-orange-600/50 transition-all">
                                <img src={t.photo} className="w-full md:w-56 h-56 rounded-[2rem] object-cover shrink-0 border-4 border-white/10 shadow-2xl" alt={t.title} />
                                <div className="flex-1 w-full text-center md:text-left">
                                   <div className="flex items-center justify-center md:justify-start gap-3 mb-2"><span className="text-xs text-orange-500 font-black uppercase tracking-widest bg-orange-600/10 px-4 py-1 rounded-full">{t.date.split('-').reverse().join('/')}</span><span className="h-1 w-1 bg-slate-600 rounded-full"></span><span className="text-[10px] text-slate-400 font-black uppercase">{t.weight}</span></div>
                                   <h4 className="text-4xl font-black italic uppercase text-white mb-6 mt-4 leading-none">{t.title}</h4>
                                   <div className="flex gap-2 justify-center md:justify-start">
                                      <button onClick={() => openModal('timeline', t)} className="px-6 py-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-orange-600 font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"><Edit3 className="h-4 w-4" /> Editar</button>
                                      <button onClick={() => deleteItem('timeline', setTimeline, timeline, t.id)} className="px-6 py-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-red-600 font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"><Trash2 className="h-4 w-4" /> Excluir</button>
                                   </div>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* === ABA AGENDA === */}
                {activeTab === 'agenda' && selectedPet && (
                  <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-700">
                     <div className="w-full lg:w-[400px] bg-white/5 p-12 rounded-[4rem] border border-white/5 h-fit shadow-2xl backdrop-blur-3xl sticky top-40">
                        <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black uppercase italic text-orange-500">{calendar.monthName}</h3><div className="flex gap-2"><button onClick={() => setCurrentDate(new Date(calendar.year, currentDate.getMonth() - 1))} className="p-3 bg-white/5 rounded-2xl hover:bg-orange-600"><ChevronLeft className="h-5 w-5" /></button><button onClick={() => setCurrentDate(new Date(calendar.year, currentDate.getMonth() + 1))} className="p-3 bg-white/5 rounded-2xl hover:bg-orange-600"><ChevronRight className="h-5 w-5" /></button></div></div>
                        <div className="grid grid-cols-7 gap-2 text-center">
                           {['D','S','T','Q','Q','S','S'].map((d, index) => <span key={`day-${index}`} className="text-[10px] font-black text-slate-600 uppercase mb-5">{d}</span>)}
                           {Array.from({length: calendar.firstDay}).map((_, i) => <div key={`empty-${i}`}></div>)}
                           {Array.from({length: calendar.daysInMonth}).map((_, i) => {
                              const day = i + 1; 
                              const formattedDate = `${calendar.year}-${String(calendar.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                              const hasApt = appointments?.some(a => a.pet_id === selectedPet.id && a.date === formattedDate && a.status !== 'Concluído');
                              return ( <button key={day} onClick={() => setSelectedDay(day)} className={`aspect-square rounded-2xl text-[11px] font-black transition-all flex flex-col items-center justify-center relative border-2 cursor-pointer ${selectedDay === day ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-110' : 'bg-white/5 border-transparent text-slate-500 hover:border-orange-600'}`}>{day}{hasApt && <div className="absolute bottom-2 h-1 w-1 bg-white rounded-full"></div>}</button> )
                           })}
                        </div>
                        <button onClick={() => openModal('agenda')} className="w-full bg-orange-600 py-6 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest mt-10 shadow-2xl hover:scale-[1.02]">Agendar no Dia {selectedDay}</button>
                     </div>

                     <div className="flex-1 space-y-12">
                        <div>
                           <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                              <h3 className="text-4xl font-black uppercase italic text-white tracking-tighter">Eventos do Dia {selectedDay}</h3>
                              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">({selectedFullDateStr.split('-').reverse().join('/')})</p>
                           </div>
                           <div className="space-y-4">
                              {appointments?.filter(a => a.pet_id === selectedPet.id && a.date === selectedFullDateStr).length > 0 ? (
                                appointments.filter(a => a.pet_id === selectedPet.id && a.date === selectedFullDateStr).map(a => {
                                  const isCompleted = a.status === 'Concluído';
                                  return (
                                      <div key={a.id} className={`p-8 rounded-[3rem] border flex items-center justify-between group transition-all shadow-xl ${isCompleted ? 'bg-white/5 border-white/5 opacity-50' : 'bg-[#0c1222] border-white/10 hover:border-orange-600'}`}>
                                         <div className="flex items-center gap-8">
                                            <button onClick={() => handleCompleteAppointment(a)} disabled={isCompleted} title="Concluir e Arquivar" className={`h-16 w-16 border-4 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${isCompleted ? 'bg-green-600 border-green-500 text-white cursor-not-allowed' : 'bg-[#020617] border-white/10 text-slate-600 hover:border-green-500 hover:text-green-500'}`}><CheckCircle className="h-8 w-8" /></button>
                                            <div>
                                               <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-green-500' : 'text-orange-500'}`}>{isCompleted ? '✅ Concluído' : 'Pendente'} • {a.time}</p>
                                               <h4 className={`text-2xl font-black uppercase italic mb-1 leading-none ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>{a.title}</h4>
                                               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{a.clinic}</p>
                                            </div>
                                         </div>
                                         <div className="flex gap-2">
                                            <button onClick={() => openModal('agenda', a)} className="p-4 rounded-2xl bg-white/5 hover:bg-orange-600 text-slate-500 hover:text-white transition-all"><Edit3 className="h-6 w-6" /></button>
                                            <button onClick={() => deleteItem('appointments', setAppointments, appointments, a.id)} className="p-4 rounded-2xl bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white transition-all"><Trash2 className="h-6 w-6" /></button>
                                         </div>
                                      </div>
                                  )
                                })
                              ) : ( <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-600"><p className="font-black uppercase text-xs tracking-widest">Nenhum evento neste dia.</p></div> )}
                           </div>
                        </div>

                        <div>
                           <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                              <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">Histórico Geral</h3>
                              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Todos os Registros</p>
                           </div>
                           <div className="space-y-4">
                              {appointments?.filter(a => a.pet_id === selectedPet.id).sort((a, b) => b.date.localeCompare(a.date)).map(a => {
                                const isCompleted = a.status === 'Concluído';
                                return (
                                    <div key={a.id} className={`p-6 rounded-[2rem] border flex items-center justify-between transition-all ${isCompleted ? 'bg-white/5 border-white/5 opacity-50' : 'bg-[#0c1222] border-white/10'}`}>
                                       <div className="flex items-center gap-6">
                                          <div className="text-center w-24">
                                             <p className={`text-xs font-black uppercase tracking-widest mb-1 ${isCompleted ? 'text-slate-500' : 'text-orange-500'}`}>{a.date.split('-').reverse().join('/')}</p>
                                             <p className="text-[10px] font-bold text-slate-500">{a.time}</p>
                                          </div>
                                          <div>
                                             <h4 className={`text-xl font-black uppercase italic mb-1 leading-none ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>{a.title}</h4>
                                             <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isCompleted ? 'bg-green-600/20 text-green-500' : 'bg-orange-600/20 text-orange-500'}`}>{isCompleted ? 'Concluído' : 'Pendente'}</span>
                                          </div>
                                       </div>
                                       <div className="flex gap-2">
                                          <button onClick={() => openModal('agenda', a)} className="p-3 rounded-xl bg-white/5 hover:bg-orange-600 text-slate-500 hover:text-white transition-all"><Edit3 className="h-4 w-4" /></button>
                                          <button onClick={() => deleteItem('appointments', setAppointments, appointments, a.id)} className="p-3 rounded-xl bg-white/5 hover:bg-red-600 text-slate-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                       </div>
                                    </div>
                                )
                              })}
                           </div>
                        </div>

                     </div>
                  </div>
                )}

                {/* === ABA VACINAS === */}
                {activeTab === 'vacinas' && selectedPet && (
                  <div className="space-y-12 animate-in fade-in duration-700">
                     <div className="flex justify-between items-center"><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Cartão de Vacinas</h3><button onClick={() => openModal('vacina')} className="bg-orange-600 px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105"><Plus className="h-4 w-4 inline mr-2"/>Nova Vacina</button></div>
                     <div className="bg-white/5 rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl">
                        <table className="w-full text-left font-black italic">
                           <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500"><tr><th className="p-10">Imunizante</th><th className="p-10 text-center">Status</th><th className="p-10 text-center">Última Dose</th><th className="p-10 text-center">Reforço (Agenda)</th><th className="p-10 text-right">Ação</th></tr></thead>
                           <tbody className="divide-y divide-white/5 text-white">
                              {vaccines?.filter(v => v.pet_id === selectedPet.id).map(v => (
                                 <tr key={v.id} className="hover:bg-white/5 transition-all">
                                    <td className="p-10 text-2xl uppercase">{v.name}</td><td className="p-10 text-center"><span className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest ${v.status === 'Em dia' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-500'}`}>{v.status}</span></td><td className="p-10 text-center text-sm font-bold text-slate-500">{v.date.split('-').reverse().join('/')}</td><td className="p-10 text-center text-xl text-orange-600">{v.next_date ? v.next_date.split('-').reverse().join('/') : '-'}</td>
                                    <td className="p-10 text-right flex justify-end gap-2">
                                       <button onClick={() => openModal('vacina', v)} className="p-3 bg-white/5 rounded-xl hover:bg-orange-600 transition-colors"><Edit3 className="h-5 w-5"/></button>
                                       <button onClick={() => deleteItem('vaccines', setVaccines, vaccines, v.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-600 transition-colors"><Trash2 className="h-5 w-5"/></button>
                                     </td>
                                  </tr>
                              ))}
                           </tbody>
                         </table>
                     </div>
                  </div>
                )}

                {/* === ABA PRONTUÁRIO === */}
                {activeTab === 'prontuario' && selectedPet && (
                  <div className="space-y-12 animate-in fade-in duration-700">
                     <div className="flex justify-between items-center"><h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Histórico Médico</h3><button onClick={() => openModal('prontuario')} className="bg-orange-600 px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105"><Plus className="h-4 w-4 inline mr-2"/>Adicionar Ficha</button></div>
                     <div className="relative pl-12 space-y-10 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                        {medicalRecords?.filter(m => m.pet_id === selectedPet.id).map(m => (
                          <div key={m.id} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 relative shadow-xl hover:border-orange-600 transition-all">
                             <div className="absolute -left-[56px] top-10 h-6 w-6 bg-orange-600 rounded-full border-[4px] border-[#020617]"></div>
                             <div className="flex justify-between items-start">
                                <div><p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">{m.date.split('-').reverse().join('/')} • {m.vet} ({m.clinic})</p><h4 className="text-3xl font-black uppercase italic text-white mb-4 leading-none">{m.title}</h4><p className="text-slate-400 font-bold leading-relaxed text-lg max-w-3xl">{m.description}</p></div>
                                <div className="flex gap-2">
                                   <button onClick={() => openModal('prontuario', m)} className="p-3 bg-white/5 rounded-xl hover:bg-orange-600 text-slate-500 hover:text-white transition-colors"><Edit3 className="h-5 w-5"/></button>
                                   <button onClick={() => deleteItem('medical_records', setMedicalRecords, medicalRecords, m.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-600 text-slate-500 hover:text-white transition-colors"><Trash2 className="h-5 w-5"/></button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {/* === ABA ALIMENTAÇÃO === */}
                {activeTab === 'alimentacao' && selectedPet && (
                  <div className="animate-in fade-in duration-700 max-w-5xl">
                     <div className="bg-white/5 p-12 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-5"><Utensils className="h-64 w-64 text-orange-600" /></div>
                        <div className="flex justify-between items-center mb-12 relative z-10"><h3 className="text-4xl font-black uppercase italic text-white">Plano Nutricional</h3><button onClick={() => openModal('nutricao')} className="bg-orange-600 p-4 rounded-2xl"><Plus className="h-6 w-6 text-white" /></button></div>
                        <div className="space-y-6 relative z-10">
                           {nutrition?.filter(n => n.pet_id === selectedPet.id).map(n => (
                             <div key={n.id} className="flex justify-between items-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5"><span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{n.title}</span><div className="flex items-center gap-6"><span className="text-xl font-black uppercase italic text-white">{n.value} <span className="text-sm text-slate-500">({n.detail})</span></span><div className="flex gap-2"><button onClick={() => openModal('nutricao', n)} className="text-slate-600 hover:text-orange-500"><Edit3 className="h-5 w-5" /></button><button onClick={() => deleteItem('nutrition', setNutrition, nutrition, n.id)} className="text-slate-600 hover:text-red-500"><Trash2 className="h-5 w-5" /></button></div></div></div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {/* === ABA ATIVIDADES === */}
                {activeTab === 'atividades' && selectedPet && (
                  <div className="animate-in fade-in duration-700 max-w-5xl">
                     <div className="bg-gradient-to-r from-orange-600/20 to-transparent p-10 rounded-[4rem] border border-orange-600/30 shadow-2xl mb-12 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="h-20 w-20 bg-orange-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl"><Trophy className="h-10 w-10" /></div>
                           <div>
                              <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Nível {currentLevel}</h3>
                              <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mt-1">Acumulado: {totalXp} XP Total</p>
                           </div>
                        </div>
                        <div className="text-right w-1/3">
                           <p className="text-[10px] font-black text-white uppercase mb-3 tracking-widest">Progresso pro Lvl {currentLevel + 1}: {currentXp} / 1000</p>
                           <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-orange-500" style={{ width: `${(currentXp / 1000) * 100}%` }}></div></div>
                        </div>
                     </div>

                     <div className="bg-white/5 p-12 rounded-[4.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-16 opacity-5"><Dumbbell className="h-64 w-64 text-orange-600" /></div>
                        <div className="flex justify-between items-center mb-12 relative z-10"><h3 className="text-4xl font-black uppercase italic text-white">Diário de Exercícios</h3><button onClick={() => openModal('atividade')} className="bg-orange-600 px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 flex items-center gap-2"><Plus className="h-4 w-4"/> Registrar Treino</button></div>
                        <div className="space-y-6 relative z-10">
                           {activities?.filter(a => a.pet_id === selectedPet.id).map(a => {
                              const isHighIntensity = Number(a.xp) >= 100;
                              return (
                                <div key={a.id} className={`p-8 rounded-[3rem] border flex justify-between items-center ${isHighIntensity ? 'bg-orange-600/10 border-orange-600/30' : 'bg-[#020617] border-white/5'}`}>
                                   <div className="flex items-center gap-6">
                                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${isHighIntensity ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-500'}`}><Target className="h-6 w-6" /></div>
                                      <div><h5 className="font-black uppercase text-white italic text-xl">{a.title}</h5><p className={`text-[10px] font-bold uppercase mt-1 tracking-widest ${isHighIntensity ? 'text-orange-400' : 'text-slate-500'}`}>{a.duration} • {a.distance}</p></div>
                                   </div>
                                   <div className="flex items-center gap-6">
                                      <span className={`text-3xl font-black italic ${isHighIntensity ? 'text-orange-500' : 'text-white'}`}>+{a.xp} XP</span>
                                      <div className="flex gap-2">
                                         <button onClick={() => openModal('atividade', a)} className="bg-white/5 p-3 rounded-xl hover:bg-orange-600 text-slate-500 hover:text-white"><Edit3 className="h-5 w-5"/></button>
                                         <button onClick={() => deleteItem('activities', setActivities, activities, a.id)} className="bg-white/5 p-3 rounded-xl hover:bg-red-600 text-slate-500 hover:text-white"><Trash2 className="h-5 w-5"/></button>
                                      </div>
                                   </div>
                                </div>
                              )
                           })}
                           {activities?.filter(a => a.pet_id === selectedPet.id).length === 0 && (
                              <div className="border-2 border-dashed border-white/10 p-10 rounded-[3rem] text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">Nenhuma atividade registrada ainda.</div>
                           )}
                        </div>
                     </div>
                  </div>
                )}
              </>
            )}
            
            {/* === ABA CONFIGURAÇÕES === */}
            {activeTab === 'config' && (
               <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
                  <div className="flex flex-col items-center mb-16 pt-8">
                     <div className="relative group cursor-pointer">
                        <div className="h-44 w-44 rounded-[4rem] bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-7xl font-black italic shadow-2xl border-[6px] border-white/5 text-white overflow-hidden transition-transform group-hover:scale-105">
                           {tutor.photo ? <img src={tutor.photo} className="w-full h-full object-cover" alt="Tutor" /> : tutor.name[0]}
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all rounded-[4rem] flex flex-col items-center justify-center group-hover:scale-105">
                           <Camera className="text-white h-10 w-10 mb-1" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white">Alterar Foto</span>
                        </div>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleTutorPhotoUpload} />
                     </div>
                     <h3 className="text-5xl font-black uppercase italic text-white mt-8 tracking-tighter leading-none text-center">{tutor.name}</h3>
                     <span className="bg-orange-600/20 text-orange-500 border border-orange-500/50 px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest mt-4 flex items-center gap-2">
                        <Star className="h-4 w-4" /> {tutor.plan}
                     </span>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                     <div className="bg-white/5 p-10 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden hover:border-blue-600/50 transition-colors">
                        <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6"><div className="h-16 w-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500"><Settings className="h-8 w-8" /></div><h3 className="text-3xl font-black italic uppercase text-white">Dados da Conta</h3></div>
                        <form onSubmit={handleUpdateTutor} className="space-y-6">
                           <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nome Completo</label><input name="name" defaultValue={tutor.name} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-blue-500 transition-colors" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email de Acesso (Login)</label><input name="email" type="email" defaultValue={tutor.email} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-blue-500 transition-colors" /></div>
                           <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">WhatsApp / Telefone</label><input name="phone" defaultValue={tutor.phone} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-blue-500 transition-colors" /></div>
                           <button type="submit" className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-blue-600 transition-all mt-4">Salvar Alterações</button>
                        </form>
                     </div>
                     <div className="space-y-8">
                        <div className="bg-white/5 p-10 rounded-[4rem] border border-white/5 shadow-2xl hover:border-orange-600/50 transition-colors">
                           <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6"><div className="h-16 w-16 bg-orange-600/20 rounded-2xl flex items-center justify-center text-orange-500"><Lock className="h-8 w-8" /></div><h3 className="text-3xl font-black italic uppercase text-white">Segurança</h3></div>
                           <form onSubmit={handlePasswordChange} className="space-y-6">
                              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Senha Atual</label><input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="••••••••" /></div>
                              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nova Senha</label><input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nova senha" /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Confirmar Senha</label><input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-4 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Repita a senha" /></div></div>
                              <button type="submit" className="w-full bg-orange-600 py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-4">Alterar Senha</button>
                           </form>
                        </div>
                        <div className="bg-green-600/10 p-8 rounded-[3rem] border border-green-600/30 flex items-center justify-between"><div className="flex items-center gap-6"><Zap className="h-10 w-10 text-green-500" /><div><p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Status do Banco de Dados</p><p className="text-xl font-black uppercase text-white italic">Conectado / Online</p></div></div></div>
                     </div>
                  </div>
               </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================================================================
          MODAIS LIVRES (ESCONDIDOS DURANTE A IMPRESSÃO PDF)
      ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-md animate-in zoom-in duration-300 print:hidden">
           <div className="bg-[#0c1222] border border-white/10 w-full max-w-2xl rounded-[4rem] p-12 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 text-slate-500 hover:text-white z-20 bg-white/5 p-3 rounded-full transition-colors"><X className="h-6 w-6" /></button>
              
              {/* MODAIS FINANCEIRO, DOCS E HIGIENE */}
              {activeModal === 'financeiro' && (
                <form onSubmit={handleSaveFinance}>
                   <h3 className="text-4xl font-black uppercase italic text-emerald-500 mb-8">{editingItem ? "Editar Despesa" : "Nova Despesa"}</h3>
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Categoria</label>
                            <select name="type" defaultValue={editingItem?.type || 'Ração'} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-emerald-500 transition-colors appearance-none">
                               <option value="Ração">Ração / Petiscos</option><option value="Veterinário">Veterinário / Consulta</option><option value="Vacina">Vacina / Remédios</option><option value="Banho e Tosa">Banho e Tosa</option><option value="Brinquedos">Acessórios / Brinquedos</option><option value="Outros">Outros</option>
                            </select>
                         </div>
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Valor (R$)</label>
                            <input name="amount" type="number" step="0.01" defaultValue={editingItem?.amount || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-emerald-500 transition-colors" placeholder="Ex: 150.00" />
                         </div>
                      </div>
                      <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Data</label>
                         <input name="date" type="date" defaultValue={editingItem?.date || getTodayFormatted()} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-emerald-500 transition-colors" />
                      </div>
                      <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Descrição Curta</label>
                         <input name="desc" defaultValue={editingItem?.description || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-emerald-500 transition-colors" placeholder="Ex: Pacote Premier 15kg" />
                      </div>
                   </div>
                   <button type="submit" className="w-full bg-emerald-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-emerald-600 transition-all mt-8">{editingItem ? "Atualizar Valor" : "Salvar Despesa"}</button>
                </form>
              )}

              {activeModal === 'documento' && (
                <form onSubmit={handleSaveDocument}>
                   <h3 className="text-4xl font-black uppercase italic text-orange-500 mb-8">{editingItem ? "Editar Documento" : "Salvar no Cofre"}</h3>
                   <div className="w-full h-40 mb-6 border-4 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-white/5 group transition-colors hover:border-orange-600/50 cursor-pointer">
                      <input type="file" accept=".pdf,image/*" onChange={handleDocumentUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      {filePreview ? <div className="text-center"><FolderOpen className="h-10 w-10 text-orange-500 mx-auto mb-2" /><span className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Arquivo Carregado</span></div> : <><FolderOpen className="h-10 w-10 text-slate-500 mb-2 group-hover:text-orange-500 transition-colors" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-orange-500 transition-colors">Selecionar Arquivo (PDF ou Imagem)</span></>}
                   </div>
                   <div className="space-y-4">
                      <input name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nome do Documento (Ex: Hemograma)" />
                      <select name="category" defaultValue={editingItem?.category || 'Exame'} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors appearance-none">
                         <option value="Exame">Exame Laboratorial / Raio-X</option><option value="Receita">Receita Médica</option><option value="Pedigree">Documento Oficial / Pedigree</option><option value="Outros">Outros</option>
                      </select>
                   </div>
                   <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Cofre" : "Guardar no Cofre"}</button>
                </form>
              )}

              {activeModal === 'higiene' && (
                <form onSubmit={handleSaveGrooming}>
                   <h3 className="text-4xl font-black uppercase italic text-white mb-2">{editingItem ? "Editar Higiene" : "Registrar Higiene"}</h3>
                   <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-8">💡 Se a próxima data for preenchida, o banho vai direto pra agenda!</p>
                   <div className="space-y-4">
                      <select name="service" defaultValue={editingItem?.service || 'Banho Simples'} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors appearance-none">
                         <option value="Banho Simples">Banho Simples</option><option value="Banho e Tosa">Banho e Tosa</option><option value="Corte de Unhas">Corte de Unhas</option><option value="Escovação Dentária">Escovação Dentária</option><option value="Limpeza de Ouvido">Limpeza de Ouvido</option>
                      </select>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Realizado em</label><input name="date" type="date" defaultValue={editingItem?.date || getTodayFormatted()} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /></div>
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Próxima Vez (Gera Alerta)</label><input name="next_date" type="date" defaultValue={editingItem?.next_date || ''} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /></div>
                      </div>
                      <input name="notes" defaultValue={editingItem?.notes || ''} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Observações (Ex: Usou shampoo antialérgico)" />
                   </div>
                   <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar" : "Registrar Higiene"}</button>
                </form>
              )}

              {/* MODAIS ORIGINAIS */}
              {activeModal === 'agenda' && ( 
                <form onSubmit={handleSaveAppointment}> 
                   <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Agenda" : "Novo Compromisso"}</h3> 
                   <div className="space-y-4"> 
                      <input name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Título do Compromisso" /> 
                      <div className="grid grid-cols-2 gap-4"> 
                         <input name="date" type="date" defaultValue={editingItem?.date || selectedFullDateStr} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /> 
                         <input name="time" type="time" defaultValue={editingItem?.time || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" /> 
                      </div> 
                      <input name="clinic" defaultValue={editingItem?.clinic || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Local / Clínica" /> 
                      <input name="vet" defaultValue={editingItem?.vet || ''} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Profissional Responsável (Opcional)" /> 
                   </div> 
                   <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Evento" : "Confirmar na Agenda"}</button> 
                </form> 
              )}

              {activeModal === 'atividade' && (
                <form onSubmit={handleSaveActivity}>
                   <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Treino" : "Registrar Atividade"}</h3>
                   <div className="space-y-4">
                      <div className="flex flex-col mb-4">
                         <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Selecione o tipo de atividade</label>
                         <select name="title" value={actForm.title} onChange={(e) => {
                            const val = e.target.value;
                            if(val === 'Caminhada Leve') setActForm({title: val, xp: 30, duration: '20 min', distance: 'Leve'});
                            else if(val === 'Caminhada Rápida') setActForm({title: val, xp: 50, duration: '40 min', distance: 'Média'});
                            else if(val === 'Corrida Intensa') setActForm({title: val, xp: 100, duration: '30 min', distance: 'Alta'});
                            else if(val === 'Adestramento') setActForm({title: val, xp: 150, duration: '45 min', distance: 'Foco Mental'});
                            else if(val === 'Brincadeira / Bolinha') setActForm({title: val, xp: 40, duration: '15 min', distance: 'Explosão'});
                         }} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors appearance-none cursor-pointer">
                            <option value="Caminhada Leve">🚶‍♂️ Caminhada Leve (30 XP)</option>
                            <option value="Caminhada Rápida">🏃‍♂️ Caminhada Rápida (50 XP)</option>
                            <option value="Corrida Intensa">⚡ Corrida Intensa (100 XP)</option>
                            <option value="Adestramento">🧠 Adestramento / Truques (150 XP)</option>
                            <option value="Brincadeira / Bolinha">🎾 Brincadeira com Bolinha (40 XP)</option>
                         </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <input name="duration" value={actForm.duration} onChange={e => setActForm({...actForm, duration: e.target.value})} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Duração" />
                         <input name="distance" value={actForm.distance} onChange={e => setActForm({...actForm, distance: e.target.value})} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nível de Intensidade" />
                      </div>
                      <div className="flex flex-col">
                         <label className="text-[10px] text-orange-500 font-black uppercase tracking-widest ml-2 mb-2">XP Ganho (Atualiza Barra de Nível)</label>
                         <input name="xp" type="number" value={actForm.xp} readOnly className="w-full bg-orange-600/10 border border-orange-500/30 rounded-2xl py-5 px-6 outline-none text-orange-500 font-black text-xl transition-colors cursor-not-allowed" />
                      </div>
                   </div>
                   <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Atividade" : "Computar Atividade"}</button>
                </form>
              )}

              {activeModal === 'pet' && ( <form onSubmit={handleSavePet}> <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Pet" : "Cadastrar Novo Pet"}</h3> <div className="w-full h-40 mb-6 border-4 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-white/5 group transition-colors hover:border-orange-600/50 cursor-pointer"> <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" /> {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <><Camera className="h-10 w-10 text-slate-500 mb-2 group-hover:text-orange-500 transition-colors" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-orange-500 transition-colors">Upload da Foto</span></>} </div> <div className="space-y-4"> <input name="name" defaultValue={editingItem?.name || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nome do Pet" /> <div className="grid grid-cols-2 gap-4"> <input name="breed" defaultValue={editingItem?.breed || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Espécie / Raça (Livre)" /> <input name="weight" type="number" step="0.1" defaultValue={(editingItem?.weight || '').replace('kg','')} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Peso Atual (Ex: 10.5)" /> </div> <div className="flex flex-col"> <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Data de Nascimento</label> <input name="birth_date" type="date" defaultValue={editingItem?.birth_date || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /> </div> </div> <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Perfil" : "Salvar Perfil"}</button> </form> )}
              {activeModal === 'timeline' && ( <form onSubmit={handleSaveTimeline}> <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Momento" : "Registrar Momento"}</h3> <div className="w-full h-56 mb-6 border-4 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden bg-white/5 group hover:border-orange-600/50 transition-colors cursor-pointer"> <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" /> {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" /> : <><Camera className="h-12 w-12 text-slate-500 mb-2 group-hover:text-orange-500 transition-colors" /><span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-orange-500">Escolher Imagem</span></>} </div> <div className="space-y-4"> <input name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Título da Foto / Momento" /> <div className="grid grid-cols-2 gap-4"> <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Data do Registro</label><input name="date" type="date" defaultValue={editingItem?.date || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /></div> <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Atualizar Peso?</label><input name="weight" type="number" step="0.1" defaultValue={(editingItem?.weight || '').replace('kg','')} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Opcional (kg)" /></div> </div> </div> <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Timeline" : "Adicionar à Timeline"}</button> </form> )}
              {activeModal === 'prontuario' && ( <form onSubmit={handleSaveMedical}> <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Ficha" : "Nova Ficha Médica"}</h3> <div className="space-y-4"> <input name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Motivo da Consulta / Diagnóstico" /> <div className="grid grid-cols-2 gap-4"> <input name="date" type="date" defaultValue={editingItem?.date || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /> <input name="vet" defaultValue={editingItem?.vet || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Veterinário" /> </div> <input name="clinic" defaultValue={editingItem?.clinic || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Clínica Veterinária" /> <textarea name="desc" defaultValue={editingItem?.description || ''} required className="w-full h-40 bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold resize-none focus:border-orange-500 transition-colors custom-scrollbar" placeholder="Descreva os detalhes da consulta..."></textarea> </div> <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Ficha" : "Salvar Prontuário"}</button> </form> )}
              {activeModal === 'nutricao' && ( <form onSubmit={handleSaveNutrition}> <h3 className="text-4xl font-black uppercase italic text-white mb-8">{editingItem ? "Editar Nutrição" : "Novo Item Nutricional"}</h3> <div className="space-y-4"> <input name="title" defaultValue={editingItem?.title || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Categoria (Ex: Ração, Suplemento)" /> <input name="value" defaultValue={editingItem?.value || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nome do Produto" /> <input name="detail" defaultValue={editingItem?.detail || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Dosagem / Detalhes" /> </div> <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Item" : "Salvar no Plano"}</button> </form> )}
              {activeModal === 'vacina' && (
                <form onSubmit={handleSaveVaccine}>
                   <h3 className="text-4xl font-black uppercase italic text-white mb-2">{editingItem ? "Editar Vacina" : "Registrar Vacina"}</h3>
                   <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-8">💡 Preencha a Próxima Dose para ela ir direto para a Agenda!</p>
                   <div className="space-y-4">
                      <input name="name" defaultValue={editingItem?.name || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors" placeholder="Nome da Vacina / Medicamento" />
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Data da Aplicação</label><input name="date" type="date" defaultValue={editingItem?.date || ''} required className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /></div>
                         <div className="flex flex-col"><label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2 mb-2">Próxima Dose (Gera Alerta)</label><input name="next_date" type="date" defaultValue={editingItem?.next_date || ''} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold uppercase focus:border-orange-500 transition-colors" /></div>
                      </div>
                      <select name="status" defaultValue={editingItem?.status || 'Em dia'} className="w-full bg-[#020617] border border-white/10 rounded-2xl py-5 px-6 outline-none text-white font-bold focus:border-orange-500 transition-colors appearance-none">
                         <option value="Em dia">🟢 Em dia (Aplicada)</option><option value="Pendente">🔴 Pendente (Atrasada / Aguardando)</option>
                      </select>
                   </div>
                   <button type="submit" className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:bg-white hover:text-orange-600 transition-all mt-8">{editingItem ? "Atualizar Imunização" : "Registrar Imunização"}</button>
                </form>
              )}

           </div>
        </div>
      )}

      {/* MÓDULO DE IMPRESSÃO PDF */}
      {selectedPet && (
        <div className="hidden print:block w-full bg-white text-black font-sans p-8">
           <div className="border-b-4 border-black pb-6 mb-8 flex justify-between items-end">
             <div><h1 className="text-5xl font-black uppercase italic mb-1">Dossiê Médico: {selectedPet.name}</h1><p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Relatório Oficial MyPetPro Enterprise</p></div>
             <div className="text-right"><p className="text-sm font-bold uppercase text-gray-800">Tutor: <span className="font-black text-black">{tutor.name}</span></p><p className="text-sm font-bold uppercase text-gray-800">Contato: <span className="font-black text-black">{tutor.phone}</span></p><p className="text-sm font-bold uppercase text-gray-800 mt-2">Emissão: <span className="font-black text-black">{new Date().toLocaleDateString('pt-BR')}</span></p></div>
           </div>
           <div className="flex items-start gap-10 mb-12 bg-gray-50 p-8 rounded-3xl border border-gray-200">
              <img src={selectedPet.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400'} alt={selectedPet.name} className="w-56 h-56 object-cover rounded-2xl border-4 border-white shadow-md" />
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full pt-4">
                 <div><p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Espécie / Raça</p><p className="text-2xl font-black uppercase text-gray-900 border-b-2 border-gray-200 pb-2">{selectedPet.breed}</p></div>
                 <div><p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Idade Atual</p><p className="text-2xl font-black uppercase text-gray-900 border-b-2 border-gray-200 pb-2">{calcularIdade(selectedPet.birth_date)}</p></div>
                 <div><p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Peso Registrado</p><p className="text-2xl font-black uppercase text-gray-900 border-b-2 border-gray-200 pb-2">{selectedPet.weight}</p></div>
                 <div><p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status de Saúde</p><p className="text-2xl font-black uppercase text-gray-900 border-b-2 border-gray-200 pb-2">{selectedPet.status}</p></div>
              </div>
           </div>
           <div className="mb-12">
              <h2 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4 mb-6">Histórico Médico Recente</h2>
              <div className="space-y-4">
                 {medicalRecords?.filter(m => m.pet_id === selectedPet.id).length > 0 ? medicalRecords.filter(m => m.pet_id === selectedPet.id).map(m => (
                    <div key={m.id} className="border-2 border-gray-200 p-6 rounded-2xl bg-white"><div className="flex justify-between items-center mb-3"><h3 className="font-black uppercase text-xl text-gray-900">{m.title}</h3><span className="text-xs font-black uppercase tracking-widest bg-black text-white px-4 py-1 rounded-full">{m.date.split('-').reverse().join('/')}</span></div><p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{m.clinic} • Profissional: {m.vet}</p><p className="text-sm text-gray-700 leading-relaxed font-medium">{m.description}</p></div>
                 )) : <p className="text-sm text-gray-400 font-bold border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center uppercase tracking-widest">Nenhum histórico médico registrado.</p>}
              </div>
           </div>
           <div className="mb-12 page-break-inside-avoid">
              <h2 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4 mb-6">Controle de Imunização</h2>
              <table className="w-full text-left border-2 border-gray-200 rounded-2xl overflow-hidden"><thead className="bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500"><tr><th className="p-5 border-b-2 border-gray-200">Vacina / Imunizante</th><th className="p-5 border-b-2 border-gray-200">Aplicação</th><th className="p-5 border-b-2 border-gray-200">Reforço</th><th className="p-5 border-b-2 border-gray-200">Status</th></tr></thead><tbody className="text-sm font-black text-gray-800 divide-y-2 divide-gray-100 bg-white">{vaccines?.filter(v => v.pet_id === selectedPet.id).length > 0 ? vaccines.filter(v => v.pet_id === selectedPet.id).map(v => (<tr key={v.id}><td className="p-5 uppercase">{v.name}</td><td className="p-5">{v.date.split('-').reverse().join('/')}</td><td className="p-5 text-black">{v.next_date ? v.next_date.split('-').reverse().join('/') : '-'}</td><td className="p-5 uppercase text-xs">{v.status}</td></tr>)) : <tr><td colSpan={4} className="p-8 text-center text-gray-400 uppercase tracking-widest text-xs">Nenhum registro encontrado.</td></tr>}</tbody></table>
           </div>
           <div className="page-break-inside-avoid">
              <h2 className="text-2xl font-black uppercase italic border-l-8 border-black pl-4 mb-6">Plano Nutricional</h2>
              <div className="grid grid-cols-2 gap-4">
                 {nutrition?.filter(n => n.pet_id === selectedPet.id).length > 0 ? nutrition.filter(n => n.pet_id === selectedPet.id).map(n => (
                    <div key={n.id} className="border-2 border-gray-200 p-5 rounded-2xl bg-gray-50"><p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">{n.title}</p><p className="text-lg font-black uppercase text-gray-900 mb-1">{n.value}</p><p className="text-xs text-gray-600 font-bold uppercase">{n.detail}</p></div>
                 )) : <p className="text-xs text-gray-400 font-bold col-span-2 text-center uppercase tracking-widest border-2 border-dashed border-gray-200 p-6 rounded-2xl">Nenhum plano nutricional definido.</p>}
              </div>
           </div>
           <div className="text-center mt-16 pt-8 border-t-2 border-gray-200 text-[9px] font-black text-gray-400 uppercase tracking-widest">Documento gerado automaticamente via MyPetPro Enterprise<br/>As informações médicas contidas neste documento são de responsabilidade do tutor.</div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ea580c; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        @keyframes dash {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @media print {
           @page { margin: 10mm; }
           body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
           .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}