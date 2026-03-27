import { useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/browser';

export default function AssessmentForm() {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 500) {
      setError('Your case study should be at least 500 characters. Please provide a thorough response.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error: insertError } = await supabase
        .from('assessment_submissions')
        .insert({ user_id: user.id, content: content.trim() });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-brand-800/40 border border-white/5 rounded-xl p-8 text-center">
        <div className="text-4xl mb-4">&#9989;</div>
        <h2 className="text-2xl font-bold">Submitted</h2>
        <p className="mt-2 text-white/60">Your case study has been submitted for review. You'll be notified once it's been graded.</p>
        <a href="/academy/dashboard" className="inline-block mt-6 border border-white/20 hover:border-white/40 text-white font-medium px-6 py-3 rounded-lg transition-colors">
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-brand-800/40 border border-white/5 rounded-xl p-6">
        <h3 className="font-bold mb-2">Case Study Prompt</h3>
        <p className="text-white/60 text-sm leading-relaxed">
          You are working with a 28-year-old male MMA fighter competing at welterweight (170 lbs / 77.1 kg).
          He currently walks around at 192 lbs (87.1 kg) with approximately 14% body fat.
          His next fight is in 12 weeks. He has cut weight 4 times previously with no complications.
        </p>
        <p className="text-white/60 text-sm leading-relaxed mt-3">
          Design a complete 12-week fight camp nutrition plan that addresses:
          macronutrient periodization across camp phases, weight management strategy,
          fight week protocol, rehydration plan, and supplement recommendations.
          Justify your decisions with evidence.
        </p>
      </div>

      <div>
        <label htmlFor="assessment" className="block text-sm font-medium text-white/80 mb-2">
          Your Response
        </label>
        <textarea
          id="assessment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          required
          className="w-full bg-brand-800/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-500 transition-colors resize-y text-sm leading-relaxed"
          placeholder="Write your case study response here. Be thorough — address all aspects of the prompt and cite evidence where appropriate."
        />
        <p className="text-white/30 text-xs mt-1">{content.length} characters (minimum 500)</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting || content.trim().length < 500}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-brand-900 font-semibold py-3.5 rounded-lg text-lg transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
}
