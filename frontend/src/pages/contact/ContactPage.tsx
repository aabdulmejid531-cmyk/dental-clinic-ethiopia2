import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Get in touch with us. We're here to help with any questions or concerns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            { icon: MapPin, title: 'Address', detail: 'Bole Road, Addis Ababa, Ethiopia\nNear Bole International Airport' },
            { icon: Phone, title: 'Phone', detail: '+251 11 123 4567\n+251 91 234 5678' },
            { icon: Mail, title: 'Email', detail: 'info@dentalclinic.et\nappointments@dentalclinic.et' },
            { icon: Clock, title: 'Working Hours', detail: 'Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 4:00 PM\nSun: Closed' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{item.detail}</p>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We'll get back to you soon.</p>
                <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </form>
            )}
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Find Us</h2>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80 flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Map Integration</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">Bole Road, Addis Ababa</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We're located on Bole Road, conveniently near Bole International Airport. 
              Free parking is available for all patients.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
