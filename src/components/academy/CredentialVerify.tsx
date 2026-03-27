import { useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/browser';

export default function CredentialVerify() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ valid: boolean; name?: string; date?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('enrollments')
        .select('completed_at, user_id')
        .eq('certificate_code', code.trim().toUpperCase())
        .single();

      if (data?.completed_at) {
        // Get user name
        const { data: { user } } = await supabase.auth.admin?.getUser?.(data.user_id) || { data: { user: null } };
        setResult({
          valid: true,
          name: 'Credential Holder', // Can't get other user's name via anon key — that's fine
          date: new Date(data.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        });
      } else {
        setResult({ valid: false });
      }
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={verify} className="flex gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="MPS-CSNS-2026-XXXXX"
          className="flex-1 bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors uppercase"
        />
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {loading ? 'Checking...' : 'Verify'}
        </button>
      </form>

      {result && (
        <div className={`mt-6 p-6 rounded-xl border ${result.valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          {result.valid ? (
            <>
              <p className="text-green-400 font-bold text-lg">Valid Credential</p>
              <p className="text-white/60 text-sm mt-1">
                MPS Combat Sports Nutrition Specialist (MPS-CSNS)<br />
                Issued: {result.date}
              </p>
            </>
          ) : (
            <>
              <p className="text-red-400 font-bold">Credential Not Found</p>
              <p className="text-white/50 text-sm mt-1">
                The code you entered does not match any active credential. Please check the code and try again.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
