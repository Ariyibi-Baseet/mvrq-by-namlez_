import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 animate-fade-in text-slate-100 light:text-navy-950">
      <div className="text-center space-y-3">
        <div className="text-xs font-mono tracking-mega text-electric-400 uppercase">
          REACH US
        </div>
        <h1 className="text-4xl font-bold tracking-tight uppercase">
          CONTACT MVRQ HQ
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Our studio team in Lagos is available Monday to Saturday.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="p-6 bg-navy-900/60 light:bg-slate-50 rounded-2xl border border-navy-800 light:border-slate-300 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-electric-500/10 text-electric-400 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">STUDIO HEADQUARTERS</div>
                <div className="text-sm font-semibold text-slate-100 light:text-navy-950">Victoria Island, Lagos, Nigeria</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-electric-500/10 text-electric-400 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">EMAIL ENQUIRIES</div>
                <div className="text-sm font-semibold text-slate-100 light:text-navy-950">concierge@mvrq.com</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-electric-500/10 text-electric-400 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">WHATSAPP ORDER LINE</div>
                <div className="text-sm font-semibold text-slate-100 light:text-navy-950">+234 (0) 812 345 6789</div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-navy-900/60 light:bg-slate-50 p-6 rounded-2xl border border-navy-800 light:border-slate-300">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold">MESSAGE TRANSMITTED</h3>
              <p className="text-xs font-mono text-slate-400">
                Thank you for reaching out. A studio representative will reply shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-navy-950 light:bg-white border border-navy-800 light:border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-100 light:text-navy-950 focus:border-electric-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold text-xs tracking-superwide uppercase py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
