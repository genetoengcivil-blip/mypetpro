import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // O cliente padrão do Supabase salva cookies de sessão com o prefixo "sb-"
  const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));

  // Define qual rota você quer proteger. Altere '/dashboard' para a rota principal do seu painel
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login');

  // 1. Usuário sem sessão tentando acessar o SaaS -> Chuta para o Login
  if (!hasSession && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Usuário com sessão tentando acessar o Login -> Joga de volta para o SaaS
  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configura em quais rotas o Next.js deve executar este middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};