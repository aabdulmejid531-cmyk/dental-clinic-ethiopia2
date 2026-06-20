import { Link } from 'react-router-dom';
import type { Language } from '../utils/translations';
import { t } from '../utils/translations';

export function Footer({ lang }: { lang: Language }) {
  return (
    <footer className="border-t border-teal-700/10 bg-teal-800 text-sand-100">
      <div className="container-page flex flex-col gap-3 py-3">
        <p className="text-xs font-semibold text-gold-400">{t(lang, 'footer_emergency')} +251 11 555 0142</p>
      </div>
      <div className="container-page flex flex-col gap-8 pb-10 pt-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-lg font-semibold text-white">Dama Dental</p>
          <p className="mt-2 text-sm text-sand-100/70">
            Bole Road, Addis Ababa · Open Mon–Sat, 8:00–19:00
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div>
            <p className="mb-2 font-semibold text-white/90">Clinic</p>
            <ul className="space-y-1.5 text-sand-100/70">
              <li><Link to="/#services" className="hover:text-white">Services</Link></li>
              <li><Link to="/#ai" className="hover:text-white">AI Assistant</Link></li>
              <li><Link to="/register" className="hover:text-white">Book a visit</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white/90">For doctors</p>
            <ul className="space-y-1.5 text-sand-100/70">
              <li><Link to="/login" className="hover:text-white">Doctor login</Link></li>
              <li><Link to="/admin" className="hover:text-white">Admin panel</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-semibold text-white/90">Contact</p>
            <ul className="space-y-1.5 text-sand-100/70">
              <li>hello@damadental.et</li>
              <li>+251 11 555 0142</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className="container-page text-xs text-sand-100/50">
          © {new Date().getFullYear()} Dama Dental. {t(lang, 'footer_rights')}
        </p>
      </div>
    </footer>
  );
}
