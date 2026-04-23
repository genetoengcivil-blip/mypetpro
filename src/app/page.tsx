import React from 'react';
import { CheckCircle2, PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <PawPrint className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">MyPetPro</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
          Acessar minha conta
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          O cuidado que seu melhor amigo merece,<br className="hidden md:block" /> em um só lugar.
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Acompanhe o desenvolvimento, vacinas, medicações e tenha o histórico completo do seu pet na palma da sua mão.
        </p>
      </main>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Escolha o melhor plano para você</h2>
          <p className="mt-4 text-gray-500">Cancele quando quiser. Sem taxas ocultas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plano Mensal */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900">Mensal</h3>
            <p className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-extrabold tracking-tight">R$ 39,90</span>
              <span className="ml-1 text-xl font-semibold text-gray-500">/mês</span>
            </p>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Cadastro completo do pet</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Controle de vacinas e remédios</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Galeria de fotos</span></li>
            </ul>
            <a 
              href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=TBYYZTV" 
              className="mt-8 block w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Assinar Mensal
            </a>
          </div>

          {/* Plano Semestral */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Mais Popular
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Semestral</h3>
            <p className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-extrabold tracking-tight">R$ 219,90</span>
              <span className="ml-1 text-xl font-semibold text-gray-500">/6 meses</span>
            </p>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Todos os benefícios do Mensal</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Economia de quase R$ 20</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Suporte prioritário</span></li>
            </ul>
            <a 
              href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=7LTZ5V5" 
              className="mt-8 block w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 px-4 rounded-lg text-center shadow-md transition"
            >
              Assinar Semestral
            </a>
          </div>

          {/* Plano Anual */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col">
            <h3 className="text-xl font-semibold text-gray-900">Anual</h3>
            <p className="mt-4 flex items-baseline text-gray-900">
              <span className="text-4xl font-extrabold tracking-tight">R$ 399,90</span>
              <span className="ml-1 text-xl font-semibold text-gray-500">/ano</span>
            </p>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Todos os benefícios do Semestral</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>2 meses grátis</span></li>
              <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /> <span>Acesso a novas features antecipado</span></li>
            </ul>
            <a 
              href="https://checkout.nexano.com.br/checkout/cmobv7nty0f6o1yqmyfvn59kb?offer=4JQ030Q" 
              className="mt-8 block w-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-3 px-4 rounded-lg text-center transition"
            >
              Assinar Anual
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}