import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  FileText, 
  QrCode, 
  Save, 
  CheckCircle2, 
  Percent 
} from 'lucide-react';
import { translate as tx } from '../translations';

export default function SettingsView({ initialSettings, onSaveSettings, strings }) {
  const [profile, setProfile] = useState(initialSettings || {
    name: "swami tent house",
    phone: "+91 9876543210",
    address: "Main Market, Sultanpur, Uttar Pradesh",
    gstin: "09AABCU9603R1ZM",
    defaultGstRate: 18,
    upiId: "swamitent@upi",
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIfsc: "",
    bankBranch: "",
    terms: "1. Advance payment is non-refundable.\n2. Any damages to inventory at venue will be charged."
  });

  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveSettings) {
      onSaveSettings(profile);
    }
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 transition-colors">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-2">
            <Building2 size={14} /> {tx(strings, 'System Configuration')}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Business Profile & Branding Settings')}</h3>
          <p className="text-sm text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
            {tx(strings, 'Update your business name, address, GSTIN, and payment terms. Changing the business name automatically updates application branding and logo avatar.')}
          </p>
        </div>

        {isSavedSuccess && (
          <div className="px-4 py-2 rounded-2xl bg-[#642FCD]/10 dark:bg-[#642FCD]/30 border border-[#642FCD] text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold flex items-center gap-2 shadow-lg animate-fadeIn">
            <CheckCircle2 size={16} /> {tx(strings, 'Changes Saved Successfully!')}
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Identity & Contact */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-xl space-y-4">
          <h4 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF] border-b border-slate-100 dark:border-[#642FCD]/20 pb-3 flex items-center gap-2">
            <Building2 size={18} className="text-[#642FCD]" /> {tx(strings, 'Business Identity & Contact Information')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
                {tx(strings, 'Business Name (Updates App Logo & Title) *')}
              </label>
              <input 
                type="text" 
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                placeholder={tx(strings, 'e.g. swami tent house')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
                {tx(strings, 'Official Phone / Mobile Number *')}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#DCCCF7]/60" />
                <input 
                  type="text" 
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  placeholder={tx(strings, '+91 9876543210')}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
              {tx(strings, 'Godown / Office Street Address *')}
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400 dark:text-[#DCCCF7]/60" />
              <textarea 
                rows="2"
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  placeholder={tx(strings, 'Full address for tax invoices')}
              ></textarea>
            </div>
          </div>
        </div>

        {/* GST & Taxation */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-xl space-y-4">
          <h4 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF] border-b border-slate-100 dark:border-[#642FCD]/20 pb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#642FCD]" /> {tx(strings, 'GST Taxation Details')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
                {tx(strings, 'Business GSTIN Number *')}
              </label>
              <input 
                type="text" 
                required
                value={profile.gstin}
                onChange={(e) => setProfile({ ...profile, gstin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD] uppercase font-mono"
                placeholder={tx(strings, '09AABCU9603R1ZM')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
                {tx(strings, 'Default GST Tax Rate (%) *')}
              </label>
              <div className="relative">
                <Percent size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#DCCCF7]/60" />
                <input 
                  type="number" 
                  min="0"
                  max="28"
                  required
                  value={profile.defaultGstRate}
                  onChange={(e) => setProfile({ ...profile, defaultGstRate: Number(e.target.value) })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  placeholder={tx(strings, '18')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment UPI & Invoice Terms */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-xl space-y-4">
          <h4 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF] border-b border-slate-100 dark:border-[#642FCD]/20 pb-3 flex items-center gap-2">
            <QrCode size={18} className="text-[#642FCD]" /> {tx(strings, 'Payments & Invoice Terms')}
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
              {tx(strings, 'Official UPI VPA ID (For Printing QR Code on Bills)')}
            </label>
            <input 
              type="text" 
              value={profile.upiId}
              onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
              placeholder={tx(strings, 'e.g. swamitent@upi')}
            />
          </div>

          <div className="space-y-3 border-t border-slate-100 dark:border-[#642FCD]/20 pt-4">
            <h5 className="text-sm font-semibold text-slate-800 dark:text-[#FFFFFF]">{tx(strings, 'Bank Transfer Details (Printed on Invoices)')}</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7]">{tx(strings, 'Account holder name')}
                <input type="text" value={profile.bankAccountName || ''} onChange={e => setProfile({ ...profile, bankAccountName: e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#642FCD]" placeholder={tx(strings, 'Name on bank account')} />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7]">{tx(strings, 'Bank name')}
                <input type="text" value={profile.bankName || ''} onChange={e => setProfile({ ...profile, bankName: e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#642FCD]" placeholder={tx(strings, 'Bank name')} />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7]">{tx(strings, 'Account number')}
                <input type="text" inputMode="numeric" value={profile.bankAccountNumber || ''} onChange={e => setProfile({ ...profile, bankAccountNumber: e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#642FCD]" placeholder={tx(strings, 'Bank account number')} />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7]">{tx(strings, 'IFSC code')}
                <input type="text" value={profile.bankIfsc || ''} onChange={e => setProfile({ ...profile, bankIfsc: e.target.value.toUpperCase() })} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#642FCD] uppercase" placeholder={tx(strings, 'e.g. SBIN0001234')} />
              </label>
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] sm:col-span-2">{tx(strings, 'Branch (optional)')}
                <input type="text" value={profile.bankBranch || ''} onChange={e => setProfile({ ...profile, bankBranch: e.target.value })} className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#642FCD]" placeholder={tx(strings, 'Branch name')} />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DCCCF7] mb-1.5">
              {tx(strings, 'Default Terms & Conditions (Appears on Tax Invoices)')}
            </label>
            <textarea 
              rows="3"
              value={profile.terms}
              onChange={(e) => setProfile({ ...profile, terms: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
            ></textarea>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="flex items-center justify-end">
          <button 
            type="submit"
            className="px-8 py-3 rounded-2xl bg-[#642FCD] text-[#FFFFFF] font-bold text-sm hover:bg-[#642FCD]/80 transition shadow-xl shadow-[#642FCD]/20 flex items-center gap-2 border border-[#642FCD]"
          >
            <Save size={18} /> {tx(strings, 'Save Settings & Apply Branding')}
          </button>
        </div>

      </form>

    </div>
  );
}
