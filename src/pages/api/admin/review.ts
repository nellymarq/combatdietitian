import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getUser(cookies);
  if (!user || user.email !== import.meta.env.ADMIN_EMAIL) {
    return new Response('Forbidden', { status: 403 });
  }

  const formData = await request.formData();
  const submissionId = formData.get('submission_id') as string;
  const userId = formData.get('user_id') as string;
  const action = formData.get('action') as string;
  const notes = formData.get('notes') as string || '';

  if (!submissionId || !action) {
    return new Response('Missing fields', { status: 400 });
  }

  const supabaseAdmin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const passed = action === 'pass';

  // Update submission
  await supabaseAdmin
    .from('assessment_submissions')
    .update({
      reviewed_at: new Date().toISOString(),
      passed,
      reviewer_notes: notes || null,
    })
    .eq('id', submissionId);

  // If passed, mark enrollment as complete and generate certificate code
  if (passed && userId) {
    const certCode = `MPS-CSNS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    await supabaseAdmin
      .from('enrollments')
      .update({
        completed_at: new Date().toISOString(),
        certificate_code: certCode,
      })
      .eq('user_id', userId);
  }

  return redirect('/academy/admin');
};
