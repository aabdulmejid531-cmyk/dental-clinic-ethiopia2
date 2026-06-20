import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArchMotif } from '../components/ArchMotif';

export function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/patient');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-sand-50 px-4 py-16">
      <ArchMotif className="pointer-events-none absolute -left-32 -top-20 h-[420px] w-[420px] text-teal-700/40" />
      <div className="card relative w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-teal-900">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/55">Log in to manage your appointments and chat with our AI assistant.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label-field" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label-field" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-coral-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
          <span className="h-px flex-1 bg-teal-700/10" /> or <span className="h-px flex-1 bg-teal-700/10" />
        </div>

        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="btn-secondary w-full"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-ink/55">
          New here?{' '}
          <Link to="/register" className="font-semibold text-teal-800 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
