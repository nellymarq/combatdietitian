import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // Parse all cookies from Astro's cookie jar
          const allCookies: { name: string; value: string }[] = [];
          // Astro cookies doesn't expose a getAll, so we read known Supabase cookie names
          const cookieNames = [
            'sb-access-token',
            'sb-refresh-token',
            `sb-${import.meta.env.PUBLIC_SUPABASE_URL.split('//')[1]?.split('.')[0]}-auth-token`,
          ];
          // Try reading each possible cookie
          for (const name of cookieNames) {
            const val = cookies.get(name)?.value;
            if (val) {
              allCookies.push({ name, value: val });
            }
          }
          // Also try the standard supabase auth token cookie patterns
          const projectRef = import.meta.env.PUBLIC_SUPABASE_URL.split('//')[1]?.split('.')[0] || '';
          const authCookieName = `sb-${projectRef}-auth-token`;
          const authCookie = cookies.get(authCookieName)?.value;
          if (authCookie && !allCookies.find(c => c.name === authCookieName)) {
            allCookies.push({ name: authCookieName, value: authCookie });
          }
          return allCookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, {
              path: '/',
              httpOnly: true,
              secure: import.meta.env.PROD,
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7,
              ...options,
            });
          });
        },
      },
    }
  );
}

export async function getUser(cookies: AstroCookies) {
  try {
    const supabase = createSupabaseServerClient(cookies);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

export async function isEnrolled(cookies: AstroCookies, userId?: string) {
  try {
    const supabase = createSupabaseServerClient(cookies);
    const uid = userId || (await getUser(cookies))?.id;
    if (!uid) return false;

    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', uid)
      .limit(1)
      .single();

    return !!data;
  } catch {
    return false;
  }
}

export async function isEnrolledInCourse(cookies: AstroCookies, userId: string, courseSlug: string) {
  try {
    const supabase = createSupabaseServerClient(cookies);
    const { data } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_slug', courseSlug)
      .limit(1)
      .single();

    return !!data;
  } catch {
    return false;
  }
}
