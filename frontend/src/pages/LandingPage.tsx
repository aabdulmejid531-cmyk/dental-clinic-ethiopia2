import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Bot, Shield, Award, Users, Stethoscope, Activity, Sparkles, ChevronRight } from 'lucide-react';

const services = [
  { icon: Stethoscope, title: 'General Dentistry', desc: 'Cleanings, fillings, extractions, and comprehensive preventive care for the whole family.' },
  { icon: Sparkles, title: 'Cosmetic Dentistry', desc: 'Teeth whitening, veneers, and smile makeovers to boost your confidence.' },
  { icon: Activity, title: 'Orthodontics', desc: 'Braces, Invisalign, and bite correction for perfectly aligned teeth.' },
  { icon: Bot, title: 'AI-Powered Care', desc: 'Smart diagnostics, symptom checking, and personalized treatment planning.' },
  { icon: Shield, title: 'Oral Surgery', desc: 'Wisdom tooth extraction, dental implants, and advanced surgical procedures.' },
  { icon: Calendar, title: 'Emergency Care', desc: 'Same-day appointments for dental emergencies with rapid response.' },
];

const stats = [
  { value: '5,000+', label: 'Happy Patients' },
  { value: '15+', label: 'Years Experience' },
  { value: '12+', label: 'Expert Doctors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const testimonials = [
  { name: 'Sarah T.', text: 'Best dental clinic in Addis! The AI symptom checker helped me understand my tooth pain before my visit.', rating: 5 },
  { name: 'Michael K.', text: 'Professional staff and modern equipment. My smile has never looked better after the whitening treatment.', rating: 5 },
  { name: 'Hanna W.', text: 'The online booking system is so convenient. I can schedule appointments anytime, anywhere.', rating: 5 },
];

export const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Modern Dental Care
                <span className="text-blue-200"> Powered by AI</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-xl">
                Experience world-class dentistry in Addis Ababa. From routine checkups to AI-assisted diagnostics, 
                we combine cutting-edge technology with compassionate care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={user ? '/appointments' : '/register'}
                  className="px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to={user ? '/ai-chat' : '/login'}
                  className="px-8 py-4 bg-blue-500/30 text-white rounded-xl font-semibold hover:bg-blue-500/40 transition-all flex items-center gap-2 border border-blue-300/30">
                  <Bot className="h-5 w-5" />
                  Try AI Assistant
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-blue-200">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive dental care tailored to your needs, all in one place.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                  className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all bg-white dark:bg-gray-800">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from real patients who trust us with their smiles.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{t.text}"</p>
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4">Ready for a Brighter Smile?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust DentalClinic Ethiopia for their dental care. 
              Book your appointment today and experience the difference.
            </p>
            <Link to={user ? '/appointments' : '/register'}
              className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[Award, Shield, Users, Sparkles].map((Icon, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="flex flex-col items-center">
                <Icon className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {['Certified Dentists', 'Sterilized Equipment', '5,000+ Patients', 'Modern Technology'][i]}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
