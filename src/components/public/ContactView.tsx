import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Building, Globe } from 'lucide-react';
import { submitContactForm } from '../../lib/api.js';

interface ContactViewProps {
  initialService?: string;
  initialIndustry?: string;
  onOpenChat: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  initialService = 'AI & Automation',
  initialIndustry = 'Manufacturing',
  onOpenChat,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    industry: initialIndustry,
    serviceInterest: initialService,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceOptions = [
    'AI & Automation',
    'ERP / SAP',
    'Enterprise Software',
    'Warehouse Management',
    'Data & Analytics',
    'Digital Transformation',
    'Other',
  ];

  const industryOptions = [
    'Manufacturing',
    'Logistics & Supply Chain',
    'Warehousing & Distribution',
    'Retail',
    'Healthcare',
    'Education',
    'Financial Services',
    'Construction',
    'Agriculture',
    'Professional Services',
    'SMEs',
    'Enterprise Organizations',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in your name, email, and message details.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        country: 'Nigeria',
        industry: 'Manufacturing',
        serviceInterest: 'AI & Automation',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page-container" className="py-16 bg-[#07101F] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D96FF] uppercase tracking-widest bg-[#0F1D32] px-3 py-1 rounded-full border border-slate-800">
            Contact Axion Technologies
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Let's Engineer Your Solution.
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Submit your project requirements, ERP inquiry, or technical challenge. Every message is routed directly to our engineering leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Col: Contact Information & Regional Hubs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-wide">Enterprise Advisory Offices</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our local and international solutions teams across operational timezones.
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <MapPin className="w-4 h-4 text-[#2D96FF]" />
                    <span>Lagos Office (Nigeria & West Africa)</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">Plot 14B, Victoria Island Tech Hub, Lagos</p>
                  <p className="text-xs text-slate-400 pl-6 font-mono">+234 1 800 AXION</p>
                </div>

                <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <MapPin className="w-4 h-4 text-[#46DCDC]" />
                    <span>Riyadh Office (Saudi Arabia & GCC)</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">King Fahd Road, Al-Olaya Business Tower, Riyadh</p>
                  <p className="text-xs text-slate-400 pl-6 font-mono">+966 11 800 AXION</p>
                </div>

                <div className="p-4 rounded-xl bg-[#07101F] border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>London Office (UK & International Node)</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6">124 City Road, Tech City Hub, London EC1V</p>
                  <p className="text-xs text-slate-400 pl-6 font-mono">+44 20 7946 0991</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-[#2D96FF]" />
                  <span>contact@axiontech.com • support@axiontech.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-4 h-4 text-[#46DCDC]" />
                  <span>Response SLA: Within 4 business hours</span>
                </div>
              </div>
            </div>

            {/* AI Assistant Callout */}
            <div className="rounded-xl bg-[#0F1D32]/50 border border-slate-800/80 p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#46DCDC]" />
                  <span>Need an Instant Answer?</span>
                </h4>
                <p className="text-xs text-slate-400">Axion AI can answer capability and pricing questions right now.</p>
              </div>
              <button
                onClick={onOpenChat}
                className="px-3.5 py-2 rounded-lg bg-[#2D96FF] hover:bg-[#1D86EF] text-white text-xs font-bold shrink-0 transition-all"
              >
                Open AI Chat
              </button>
            </div>
          </div>

          {/* Right Col: Direct Connected Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#0F1D32]/80 border border-slate-800 p-6 sm:p-8 shadow-xl">
              {success ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-700 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Received Successfully</h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you. Your message and technical requirements have been stored in the Axion platform database. An enterprise specialist has been notified.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-lg bg-[#2D96FF] text-white text-xs font-bold hover:bg-[#1D86EF] transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-white tracking-wide mb-2">
                    Send Direct Enterprise Inquiry
                  </h3>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Engr. Farouk Al-Hassan"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Kano Logistics & Distribution Ltd"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Work Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. farouk@kanologistix.ng"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +234 803 555 0192 / +966 50 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Country */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Country / Region</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#2D96FF]"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Other International">Other International</option>
                      </select>
                    </div>

                    {/* Industry */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#2D96FF]"
                      >
                        {industryOptions.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Service Interest Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      What do you need help with? <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white focus:outline-none focus:border-[#2D96FF]"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Project or Operational Details <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your workflows, ERP environment, number of sites/users, and what challenges you want to solve..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#07101F] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2D96FF]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#2D96FF] to-[#0284C7] hover:from-[#3B82F6] hover:to-[#0EA5E9] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(45,150,255,0.35)] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting to Database...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
