import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Language } from '../utils/translations';
import { t } from '../utils/translations';

interface NavbarProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
}

export function Navbar({ lang, onLangChange }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath =
    profile?.role === 'doctor' ? '/doctor' : profile?.role === 'admin' ? '/admin' : '/patient';

  return (
    <header className="sticky top-0 z-40 border-b border-teal-700/10 bg-sand-50/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-teal-800">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path
              d="M4 24V11.5C4 6.3 8.3 2 13 2s9 4.3 9 9.5V24"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          Dama Dental
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink/80 md:flex">
          <Link to="/#services" className="hover:text-teal-800">
            {t(lang, 'nav_services')}
          </Link>
          <Link to="/#ai" className="hover:text-teal-800">
            {t(lang, 'nav_ai')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onLangChange(lang === 'en' ? 'am' : 'en')}
            className="rounded-full border border-teal-700/20 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-700/5"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'አማ' : 'EN'}
          </button>

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to={dashboardPath} className="text-sm font-semibold text-teal-800 hover:underline">
                {profile?.full_name?.split(' ')[0] ?? 'Dashboard'}
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="btn-secondary !px-4 !py-2 text-xs"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/login" className="text-sm font-semibold text-teal-800 hover:underline">
                {t(lang, 'nav_login')}
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-xs">
                {t(lang, 'nav_register')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
