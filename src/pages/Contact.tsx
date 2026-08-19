import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import GoogleMapSection from '../components/GoogleMapSection.tsx';
import { submitContactApi } from '../services/contactService.ts';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Wedding Cake Tasting Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !subject || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await submitContactApi({ name, email, phone, subject, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit inquiry. Please call +1 (212) 555-0187.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-16 py-12"
    >
      {/* Contact Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-3"
      >
        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C1810]">
          Contact Our Patisserie Concierge
        </h1>
        <p className="text-sm sm:text-base text-[#6E5A4E] font-light">
          Have questions about cake tastings, event catering, custom designs, or same-day Manhattan courier deliveries? We are here to assist you.
        </p>
      </motion.div>

      {/* Main Form & Information Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Information Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#FAF7F2] p-8 rounded-3xl border border-[#E8DFC8] space-y-6 shadow-sm"
          >
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#721C24]">
                Flagship Boutique
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                The Velvet Cake Co.
              </h3>
              <p className="text-xs text-[#6E5A4E] font-light">
                Located in the heart of Murray Hill, Manhattan.
              </p>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-[#4A3B32] pt-2">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-[#721C24] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810]">Bakery & Kitchen Address</p>
                  <p className="text-[#6E5A4E] font-light">
                    245 Lexington Avenue<br />
                    Manhattan, New York, NY 10016
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-[#721C24] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810]">Opening Hours</p>
                  <p className="text-[#6E5A4E] font-light">Monday – Sunday: 8:00 AM – 9:00 PM</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Open 7 days a week</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-[#721C24] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810]">Telephone Order Line</p>
                  <p className="text-[#6E5A4E] font-light">+1 (212) 555-0187</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-[#721C24] border border-[#E8DFC8] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#2C1810]">Direct Inquiries</p>
                  <p className="text-[#6E5A4E] font-light">orders@thevelvetcakeco.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8DFC8] bg-white p-4 rounded-xl text-xs text-[#6E5A4E] space-y-1">
              <p className="font-bold text-[#2C1810]">Same-Day Urgent Orders:</p>
              <p className="font-light">For cakes needed within the next 4 hours, please call our counter directly at +1 (212) 555-0187.</p>
            </div>
          </motion.div>

          {/* Contact Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E8DFC8] shadow-lg space-y-6"
          >
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#2C1810]">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5A4E] mt-1 font-light">
                Fill out the inquiry form below and our concierge team will respond within 24 hours.
              </p>
            </div>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <h4 className="font-serif text-lg font-bold">Message Sent Successfully!</h4>
                <p className="text-xs sm:text-sm font-light">
                  Thank you for reaching out to The Velvet Cake Co. Our events concierge will get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 bg-emerald-700 text-white rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#4A3B32] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3B32] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[#4A3B32] mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (212) 555-0199"
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-[#4A3B32] mb-1">Inquiry Subject *</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
                    >
                      <option value="Wedding Cake Tasting Inquiry">Wedding Cake Tasting Consultation</option>
                      <option value="Custom Birthday Cake Question">Custom Birthday Cake Question</option>
                      <option value="Corporate & Large Gala Order">Corporate & Large Gala Order</option>
                      <option value="Same-Day Delivery Inquiry">Same-Day Delivery Inquiry</option>
                      <option value="General Question">General Bakery Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[#4A3B32] mb-1">Your Message or Event Specifications *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details such as guest count, flavor preferences, event date, or any questions..."
                    className="w-full bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl p-3 focus:outline-none focus:border-[#721C24]"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs uppercase tracking-widest font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Submitting Message...' : 'Send Message to Bakery Concierge'}
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            )}

          </motion.div>

        </div>
      </div>

      {/* Google Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <GoogleMapSection />
      </motion.div>

    </motion.div>
  );
}
