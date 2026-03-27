import { useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/browser';

interface Props {
  mode: 'login' | 'register';
  redirectTo?: string;
}

export default function AuthForm({ mode, redirectTo = '/academy/dashboard' }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/academy/login?verified=true`,
          },
        });
        if (signUpError) throw signUpError;
        setRegistrationComplete(true);
        return;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        window.location.href = redirectTo;
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/academy/login`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (showReset) {
    return (
      <form onSubmit={handleReset} className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">Reset Password</h2>
        {resetSent ? (
          <p className="text-green-400">Check your email for a reset link.</p>
        ) : (
          <>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors"
                placeholder="you@email.com"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => { setShowReset(false); setResetSent(false); }}
          className="text-accent-400 hover:text-accent-500 text-sm"
        >
          Back to login
        </button>
      </form>
    );
  }

  if (registrationComplete) {
    return (
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-green-400 text-3xl">&#9993;</span>
        </div>
        <h2 className="text-2xl font-bold">Check Your Email</h2>
        <p className="text-white/60">
          We sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link in the email to verify your account.
        </p>
        <div className="bg-brand-800/40 border border-white/5 rounded-xl p-5 text-left">
          <p className="text-white/50 text-sm">
            <strong className="text-white/70">Didn't receive it?</strong> Check your spam folder. The email comes from Supabase (noreply@mail.app.supabase.io).
          </p>
        </div>
        <a
          href="/academy/login"
          className="inline-block text-accent-400 hover:text-accent-500 text-sm"
        >
          Already confirmed? Log in here
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      {mode === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
          <input
            id="name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors"
            placeholder="Your full name"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors"
          placeholder="Min 8 characters"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg text-lg transition-colors"
      >
        {loading ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Log In'}
      </button>
      {mode === 'login' && (
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-accent-400 hover:text-accent-500"
          >
            Forgot password?
          </button>
          <a href="/academy/register" className="text-accent-400 hover:text-accent-500">
            Create account
          </a>
        </div>
      )}
      {mode === 'register' && (
        <p className="text-center text-sm text-white/50">
          Already have an account?{' '}
          <a href="/academy/login" className="text-accent-400 hover:text-accent-500">Log in</a>
        </p>
      )}
    </form>
  );
}
