import type { APIRoute } from 'astro';
import { createSupabaseServerClient, getUser } from '../../lib/supabase/server';

export const GET: APIRoute = async ({ cookies }) => {
  const user = await getUser(cookies);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const supabase = createSupabaseServerClient(cookies);
  const { data, error } = await supabase
    .from('module_progress')
    .select('module_slug, completed_at, quiz_score')
    .eq('user_id', user.id);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify(data || []), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getUser(cookies);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await request.json();
  const { moduleSlug, quizScore, quizAnswers } = body;

  if (!moduleSlug) return new Response('moduleSlug required', { status: 400 });

  const supabase = createSupabaseServerClient(cookies);

  const { error } = await supabase
    .from('module_progress')
    .upsert(
      {
        user_id: user.id,
        module_slug: moduleSlug,
        completed_at: new Date().toISOString(),
        quiz_score: quizScore ?? null,
        quiz_answers: quizAnswers ?? null,
      },
      { onConflict: 'user_id,module_slug' }
    );

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
