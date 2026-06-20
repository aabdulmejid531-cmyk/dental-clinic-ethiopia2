import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArchMotif } from '../components/ArchMotif';

export function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, fullName, 'patient');
      setDone(true);
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-sand-50 px-4 py-16">
      <ArchMotif className="pointer-events-none absolute -right-32 -top-20 h-[420px] w-[420px] text-teal-700/40" />
      <div className="card relative w-full max-w-sm">
        {done ? (
          <div className="py-6 text-center">
            <h1 className="font-display text-xl font-semibold text-teal-900">Check your email</h1>
            <p className="mt-2 text-sm text-ink/60">
              We sent a confirmation link to {email}. Confirm it, then log in to book your first visit.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-teal-900">Create your account</h1>
            <p className="mt-1 text-sm text-ink/55">Takes under two minutes. Doctor and admin accounts are issued by the clinic.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label-field" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="Sara Tesfaye"
                />
              </div>
              <div>
                <label className="label-field" htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="At least 6 characters"
                />
              </div>

              {error && <p className="text-sm text-coral-500">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/55">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-teal-800 hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
