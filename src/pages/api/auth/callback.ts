import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies, url, redirect }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/academy/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient(cookies);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next);
    }
  }

  return redirect('/academy/login?error=auth_failed');
};
