import { Link } from 'react-router-dom';
import { ArchMotif } from '../components/ArchMotif';
import type { Language } from '../utils/translations';
import { t } from '../utils/translations';

const SERVICES = [
  {
    en: { name: 'General & Preventive', desc: 'Cleanings, fillings, and checkups that catch problems before they hurt.' },
    am: { name: 'መደበኛ እና መከላከያ', desc: 'ህመም ከመድረሱ በፊት ችግሮችን የሚይዙ ጽዳቶች፣ ሙሌቶች እና ምርመራዎች።' }
  },
  {
    en: { name: 'Orthodontics', desc: 'Braces and clear aligners fitted for adult and teen smiles.' },
    am: { name: 'ኦርቶዶንቲክስ', desc: 'ለአዋቂዎችና ለወጣቶች ፈገግታ የተዘጋጁ ብሬስ እና ግልጽ አላይነሮች።' }
  },
  {
    en: { name: 'Emergency Care', desc: 'Same-day visits for breaks, abscesses, and sudden pain.' },
    am: { name: 'አስቸኳይ እንክብካቤ', desc: 'ለስብራት፣ ለመግል እና ላልተጠበቀ ህመም በተመሳሳይ ቀን ምርመራ።' }
  },
  {
    en: { name: 'AI Consultation', desc: 'A bilingual first read on your symptoms, any hour of the day.' },
    am: { name: 'AI ምክክር', desc: 'በማንኛውም ሰዓት ለምልክቶችዎ የመጀመሪያ ግምገማ በሁለት ቋንቋ።' }
  }
];

export function Landing({ lang }: { lang: Language }) {
  const stats = [
    { value: '5,000+', label: t(lang, 'trust_patients') },
    { value: '24/7', label: t(lang, 'trust_ai') },
    { value: 'EN · አማ', label: t(lang, 'trust_languages') }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <ArchMotif className="pointer-events-none absolute -right-24 -top-10 h-[480px] w-[480px] text-teal-700 sm:-right-10" />
        <div className="container-page relative grid grid-cols-1 items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center rounded-full border border-teal-700/20 bg-teal-700/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t(lang, 'hero_eyebrow')}
            </span>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] text-teal-900 sm:text-6xl">
              {t(lang, 'hero_title')}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              {t(lang, 'hero_subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary">
                {t(lang, 'hero_cta_primary')}
              </Link>
              <a href="#ai" className="btn-secondary">
                {t(lang, 'hero_cta_secondary')}
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-teal-700/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-2xl font-semibold text-teal-800 sm:text-3xl">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-snug text-ink/55 sm:text-sm">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <div className="absolute inset-0 rounded-[40%_40%_8%_8%/30%_30%_8%_8%] bg-gradient-to-b from-teal-200 to-teal-100" />
            <div className="absolute inset-6 flex flex-col justify-between rounded-[36%_36%_6%_6%/26%_26%_6%_6%] border border-white/40 bg-white/40 p-6 backdrop-blur-sm">
              <div className="rounded-2xl bg-white/90 p-4 shadow-soft">
                <p className="text-xs font-semibold text-teal-700">Next appointment</p>
                <p className="mt-1 font-display text-lg font-semibold text-teal-900">Tue, Jun 23 · 10:30</p>
                <p className="text-xs text-ink/60">Cleaning & checkup with Dr. Hana</p>
              </div>
              <div className="rounded-2xl bg-teal-800 p-4 text-white shadow-soft">
                <p className="text-xs font-semibold text-gold-400">AI Assistant</p>
                <p className="mt-1 text-sm leading-relaxed">
                  “Mild gum bleeding after brushing is usually plaque buildup — let's get you in for a cleaning.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-t border-teal-700/10 bg-white py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium text-teal-900 sm:text-4xl">
              {t(lang, 'services_title')}
            </h2>
            <p className="mt-3 text-ink/65">{t(lang, 'services_subtitle')}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <div key={i} className="card flex flex-col gap-3">
                <ArchMotif className="h-10 w-10 text-teal-500" />
                <h3 className="font-display text-lg font-semibold text-teal-900">{s[lang].name}</h3>
                <p className="text-sm leading-relaxed text-ink/60">{s[lang].desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section id="ai" className="border-t border-teal-700/10 bg-teal-900 py-20 text-sand-50">
        <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-gold-400/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-400">
              {t(lang, 'nav_ai')}
            </span>
            <h2 className="mt-5 font-display text-3xl font-medium sm:text-4xl">{t(lang, 'ai_section_title')}</h2>
            <p className="mt-4 max-w-md text-sand-100/75">{t(lang, 'ai_section_subtitle')}</p>
            <Link to="/register" className="btn-gold mt-7 inline-flex">
              {t(lang, 'hero_cta_secondary')}
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Khat-related gum recession — what helps?', a: 'Reducing chewing frequency, switching sides, and a soft-bristle routine slow it down; a hygienist visit treats existing recession.' },
              { q: 'White patches on my back teeth', a: 'Could be early fluorosis, common in groundwater regions like parts of the Rift Valley. Worth a look at your next cleaning.' },
              { q: 'Coffee ceremony stains', a: 'Surface staining from coffee and bunna polishes off with a routine cleaning — not a sign of decay on its own.' }
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-gold-400">{item.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-sand-100/75">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sand-50 py-20">
        <div className="container-page flex flex-col items-center justify-between gap-6 rounded-3xl border border-teal-700/10 bg-white px-8 py-12 text-center shadow-soft sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-medium text-teal-900 sm:text-3xl">
              {lang === 'am' ? 'ዛሬ ቀጠሮ ይያዙ' : 'Book your visit today'}
            </h3>
            <p className="mt-2 text-ink/60">
              {lang === 'am'
                ? 'ምዝገባ ከ2 ደቂቃ በታች ይወስዳል።'
                : 'Registration takes less than two minutes.'}
            </p>
          </div>
          <Link to="/register" className="btn-primary whitespace-nowrap">
            {t(lang, 'hero_cta_primary')}
          </Link>
        </div>
      </section>
    </div>
  );
}
