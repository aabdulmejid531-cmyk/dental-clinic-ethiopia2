import { Shield, Award, Users, Microscope, CheckCircle } from 'lucide-react';

const stats = [
  { label: 'Happy Patients', value: '5,000+' },
  { label: 'Years Experience', value: '15+' },
  { label: 'Expert Doctors', value: '12+' },
  { label: 'Procedures Done', value: '10,000+' },
];

const values = [
  {
    icon: Shield,
    title: 'Sterilization & Safety',
    description: 'We follow international sterilization standards for your safety.',
  },
  {
    icon: Award,
    title: 'Certified Professionals',
    description: 'Our team consists of certified dentists with international training.',
  },
  {
    icon: Users,
    title: 'Patient-Centered Care',
    description: 'We listen to your concerns and tailor treatments to your needs.',
  },
  {
    icon: Microscope,
    title: 'Modern Technology',
    description: 'Digital X-rays, 3D imaging, and laser dentistry for precise treatment.',
  },
];

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About DentalClinic Ethiopia</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Delivering exceptional dental care with compassion, innovation, and expertise since 2010.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Founded in 2010, DentalClinic Ethiopia has grown from a small practice to one of Addis Ababa's 
              premier dental care providers. Our commitment to excellence and patient satisfaction drives 
              everything we do.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We combine state-of-the-art technology with compassionate care to provide the best possible 
              dental experience. From routine checkups to complex surgical procedures, our team is equipped 
              to handle all your dental needs.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our mission is to make quality dental care accessible to everyone in Ethiopia, setting new 
              standards in oral healthcare with every patient we treat.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'General Dentistry', items: ['Checkups & Cleanings', 'Fillings', 'Root Canals', 'Extractions'] },
              { title: 'Cosmetic Dentistry', items: ['Teeth Whitening', 'Veneers', 'Dental Bonding', 'Smile Makeovers'] },
              { title: 'Orthodontics', items: ['Braces', 'Invisalign', 'Retainers', 'Space Maintainers'] },
              { title: 'Oral Surgery', items: ['Wisdom Teeth Removal', 'Implants', 'Jaw Surgery', 'Bone Grafting'] },
              { title: 'Pediatric Dentistry', items: ['Child Checkups', 'Fluoride Treatment', 'Sealants', 'Education'] },
              { title: 'Emergency Care', items: ['Toothaches', 'Broken Teeth', 'Abscess Treatment', 'Same-Day Care'] },
            ].map((service) => (
              <div key={service.title} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
