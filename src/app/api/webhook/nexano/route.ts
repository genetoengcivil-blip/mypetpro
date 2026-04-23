import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Usamos a service_role para ter permissão de criar usuários no Auth bypassando proteções de cliente
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Nexano envia geralmente: email, cpf, plano (ou equivalente no payload)
    // Verifique o payload exato na documentação da Nexano para mapear aqui
    const { email, cpf, plano_nome } = body;

    if (!email || !cpf) {
      return NextResponse.json({ error: 'Dados insuficientes' }, { status: 400 });
    }

    // 1. Limpa o CPF (apenas números) para servir de senha inicial
    const cleanCpf = cpf.replace(/\D/g, '');

    // 2. Cria o usuário no Auth do Supabase
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: cleanCpf,
      email_confirm: true // Já marca como confirmado pois o pagamento foi feito
    });

    if (authError) throw authError;

    // 3. Insere os dados na nossa tabela de usuários pública
    const { error: dbError } = await supabaseAdmin.from('usuarios').insert([
      {
        id: authData.user.id,
        email: email,
        cpf: cleanCpf,
        plano: plano_nome || 'mensal', // Fallback caso não venha
        status_assinatura: 'ativa'
      }
    ]);

    if (dbError) throw dbError;

    return NextResponse.json({ message: 'Usuário criado com sucesso' }, { status: 200 });

  } catch (err: any) {
    console.error('Erro no Webhook:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}