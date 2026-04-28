import { createServerClient, type NextRequest } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Inicializa o cliente Supabase para o Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Verifica a sessão do usuário de forma segura
  // IMPORTANTE: Use getUser() em vez de getSession() para segurança real no servidor
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isProtectedRoute = url.pathname.startsWith('/dashboard')
  const isAuthPage = url.pathname === '/login' || url.pathname === '/'

  // 3. LOGICA DE REDIRECIONAMENTO:
  
  // Se não estiver logado e tentar entrar no Dashboard -> Redireciona para Login
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se já estiver logado e tentar entrar na página de Login -> Redireciona para Dashboard
  if (user && isAuthPage) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

// 4. Configuração do Matcher
// Garante que o middleware NÃO rode em arquivos estáticos (imagens, css, etc)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}