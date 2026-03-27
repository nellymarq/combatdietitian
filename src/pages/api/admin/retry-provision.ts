import type { APIRoute } from 'astro';
import { getUser } from '../../../lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // Admin only
  const user = await getUser(cookies);
  if (!user || user.email !== import.meta.env.ADMIN_EMAIL) {
    return new Response('Forbidden', { status: 403 });
  }

  const formData = await request.formData();
  const enrollmentId = formData.get('enrollment_id') as string;
  if (!enrollmentId) return new Response('Missing enrollment_id', { status: 400 });

  const supabaseAdmin = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Get enrollment
  const { data: enrollment } = await supabaseAdmin
    .from('enrollments')
    .select('*')
    .eq('id', enrollmentId)
    .single();

  if (!enrollment) return new Response('Enrollment not found', { status: 404 });
  if (enrollment.calsanova_provisioned) return redirect('/academy/admin');

  // Get user email
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
  const student = users?.find(u => u.id === enrollment.user_id);
  if (!student?.email) return new Response('Student email not found', { status: 404 });

  // Retry provisioning
  const apiUrl = import.meta.env.CALSANOVA_API_URL;
  const secret = import.meta.env.CALSANOVA_PROVISION_SECRET;

  try {
    const name = student.user_metadata?.full_name || student.email.split('@')[0];
    const nameParts = name.split(' ');

    const response = await fetch(`${apiUrl}/api/v1/admin/academy/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
      },
      body: JSON.stringify({
        email: student.email,
        first_name: nameParts[0] || name,
        last_name: nameParts.slice(1).join(' ') || nameParts[0] || name,
      }),
    });

    const result = await response.json();
    const success = result.status === 'provisioned' || result.status === 'already_provisioned';

    await supabaseAdmin
      .from('enrollments')
      .update({ calsanova_provisioned: success })
      .eq('id', enrollmentId);
  } catch (err) {
    console.error('Retry provisioning failed:', err);
  }

  return redirect('/academy/admin');
};
