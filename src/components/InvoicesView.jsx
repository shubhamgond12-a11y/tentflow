import React, { useState } from 'react';
import { FileText, Printer, Search, ShieldCheck, DollarSign, ArrowUpRight, X, Building2, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function InvoicesView({ events = [], businessProfile = {
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
}, strings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'b2b', 'b2c'
  const [activeInvoice, setActiveInvoice] = useState(null); // For printable modal view

  // Fallback sample events if none passed from props
  const invoiceList = events.length > 0 ? events : [
    {
      id: 'e1',
      customer: { name: 'Ramesh Gupta', phone: '9876500001', address: 'Civil Lines, Sultanpur', gstin: '09AAACG1234F1Z1' },
      name: 'Gupta Wedding Ceremony',
      date: '2026-08-15',
      venue: 'Palace Ground, Sultanpur',
      isGstBill: true,
      gstRate: 18,
      subtotal: 105000,
      discount: 5000,
      requirements: [
        { id: 'r1', name: 'Waterproof German Hangar', qty: 300, days: 2, rate: 150 },
        { id: 'r2', name: 'VIP Banquet Chair (Red)', qty: 500, days: 1, rate: 20 }
      ],
      payments: [{ id: 'p1', date: '2026-08-01', amount: 30000, mode: 'UPI' }],
      balanceDue: 74900
    },
    {
      id: 'e2',
      customer: { name: 'Anil Verma', phone: '9876599992', address: 'Ashok Nagar, Sultanpur', gstin: '' },
      name: 'Verma Ring Ceremony',
      date: '2026-08-20',
      venue: 'Community Hall, Sultanpur',
      isGstBill: true,
      gstRate: 18,
      subtotal: 45000,
      discount: 2000,
      requirements: [
        { id: 'r3', name: 'Round Table with Linen', qty: 30, days: 1, rate: 500 },
        { id: 'r4', name: 'Halogen Lights Setup', qty: 10, days: 1, rate: 1500 }
      ],
      payments: [{ id: 'p2', date: '2026-08-10', amount: 15000, mode: 'Cash' }],
      balanceDue: 35040
    }
  ];

  // Calculations for GST Tax Liability Summary
  const totalB2B = invoiceList.filter(inv => inv.customer?.gstin && inv.customer.gstin.trim() !== '').length;
  const totalB2C = invoiceList.length - totalB2B;
  
  const totalTaxableValue = invoiceList.reduce((acc, inv) => {
    const sub = inv.subtotal || 0;
    const disc = inv.discount || 0;
    return acc + Math.max(0, sub - disc);
  }, 0);

  const totalTaxCollected = invoiceList.reduce((acc, inv) => {
    if (!inv.isGstBill) return acc;
    const taxable = Math.max(0, (inv.subtotal || 0) - (inv.discount || 0));
    return acc + (taxable * ((inv.gstRate || 18) / 100));
  }, 0);

  // Filtered invoices
  const filteredInvoices = invoiceList.filter(inv => {
    const hasGstin = inv.customer?.gstin && inv.customer.gstin.trim() !== '';
    if (filterType === 'b2b' && !hasGstin) return false;
    if (filterType === 'b2c' && hasGstin) return false;

    const query = searchTerm.toLowerCase();
    return (
      inv.name?.toLowerCase().includes(query) ||
      inv.customer?.name?.toLowerCase().includes(query) ||
      inv.venue?.toLowerCase().includes(query)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  const getBalanceDue = (invoice) => {
    if (invoice.balanceDue != null) return Math.max(0, Number(invoice.balanceDue) || 0);
    const taxable = Math.max(0, (invoice.subtotal || 0) - (invoice.discount || 0));
    const total = taxable * (1 + (invoice.isGstBill ? (invoice.gstRate || 0) : 0) / 100);
    const paid = (invoice.payments || []).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
    return Math.max(0, total - paid);
  };

  const getUpiPaymentLink = (invoice) => {
    const upiId = businessProfile.upiId?.trim();
    if (!upiId) return '';
    const params = new URLSearchParams({ pa: upiId, pn: businessProfile.name || 'Business', cu: 'INR' });
    const balanceDue = getBalanceDue(invoice);
    if (balanceDue > 0) params.set('am', balanceDue.toFixed(2));
    if (invoice.name) params.set('tn', `Invoice payment - ${invoice.name}`);
    return `upi://pay?${params.toString()}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn transition-colors">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-2">
            <FileText size={14} /> GST Tax Compliance & Billing
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">GST Invoices & Reports</h3>
          <p className="text-sm text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
            Manage B2B and B2C tax invoices, compute CGST/SGST liability, and print GST tax invoices.
          </p>
        </div>
        <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-xs text-slate-700 dark:text-[#DCCCF7]">
          <span className="text-[#642FCD] dark:text-[#DCCCF7] font-bold">Business GSTIN:</span> {businessProfile.gstin} 
        </div>
      </div>

      {/* GST Summary & Tax Liability Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-lg">
          <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mb-1">Total Taxable Value</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF]">₹ {totalTaxableValue.toLocaleString('en-IN')}</div>
          <div className="text-xs text-[#642FCD] dark:text-[#DCCCF7] mt-2 font-medium">For current billing period</div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-lg">
          <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mb-1">Total GST Tax Collected</div>
          <div className="text-2xl font-extrabold text-[#642FCD] dark:text-[#DCCCF7]">₹ {totalTaxCollected.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mt-2">CGST + SGST split</div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-lg">
          <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mb-1">B2B Invoices (With GSTIN)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF]">{totalB2B} Invoices</div>
          <div className="text-xs text-blue-500 dark:text-blue-400 mt-2">Eligible for input tax credit</div>
        </div>
        <div className="p-5 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-lg">
          <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mb-1">B2C Invoices (Consumer)</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-[#FFFFFF]">{totalB2C} Invoices</div>
          <div className="text-xs text-purple-500 dark:text-purple-400 mt-2">Standard consumer billing</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'b2b', label: 'B2B (GSTIN)' },
            { id: 'b2c', label: 'B2C (Consumer)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                filterType === tab.id
                  ? 'bg-[#642FCD]/10 dark:bg-[#642FCD]/30 text-[#642FCD] dark:text-[#DCCCF7] border-[#642FCD]'
                  : 'bg-white dark:bg-[#000000] text-slate-600 dark:text-[#DCCCF7]/70 border-slate-200 dark:border-[#642FCD]/20 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#DCCCF7]/60" />
          <input 
            type="text"
            placeholder="Search customer or event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#642FCD]/30 bg-slate-100/60 dark:bg-[#000000] text-xs font-semibold text-slate-500 dark:text-[#DCCCF7] uppercase tracking-wider">
                <th className="p-4 pl-6">Invoice / Event</th>
                <th className="p-4">Customer</th>
                <th className="p-4">GSTIN Status</th>
                <th className="p-4 text-right">Taxable Value</th>
                <th className="p-4 text-right">GST ({businessProfile.defaultGstRate}%)</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#642FCD]/20 text-sm">
              {filteredInvoices.map((inv, idx) => {
                const taxable = Math.max(0, (inv.subtotal || 0) - (inv.discount || 0));
                const gst = inv.isGstBill ? taxable * ((inv.gstRate || 18) / 100) : 0;
                const hasGstin = inv.customer?.gstin && inv.customer.gstin.trim() !== '';

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#642FCD]/10 transition">
                    <td className="p-4 pl-6">
                      <div className="font-semibold text-slate-900 dark:text-[#FFFFFF]">{inv.name}</div>
                      <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80">{inv.date} • {inv.venue}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{inv.customer?.name}</div>
                      <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80">{inv.customer?.phone}</div>
                    </td>
                    <td className="p-4">
                      {hasGstin ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:bg-[#642FCD]/20 dark:text-[#DCCCF7] border border-blue-500/20 dark:border-[#642FCD]/40">
                          B2B: {inv.customer.gstin}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:bg-[#8D2E6E]/20 dark:text-[#DCCCF7] border border-purple-500/20 dark:border-[#8D2E6E]/40">
                          B2C Consumer
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-900 dark:text-[#FFFFFF]">₹ {taxable.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right font-medium text-[#642FCD] dark:text-[#DCCCF7]">+ ₹ {gst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => setActiveInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] border border-[#642FCD]/30 text-xs font-semibold hover:bg-[#642FCD]/20 dark:hover:bg-[#642FCD]/30 transition flex items-center gap-1 ml-auto"
                      >
                        <FileText size={14} /> View GST Bill
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable GST Tax Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-[#000000]/85 backdrop-blur-md overflow-hidden">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD] rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-slate-900 dark:text-[#FFFFFF]">
            
            {/* Modal Top Bar (Sticky, hidden when printing) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#642FCD]/30 bg-white/95 dark:bg-[#000000]/95 flex-shrink-0 print:hidden">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7]">
                  <Printer size={18} />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-[#FFFFFF]">GST Tax Invoice Preview</h4>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-[#642FCD] text-white font-semibold text-xs hover:bg-[#642FCD]/80 transition flex items-center gap-1.5 shadow-lg shadow-[#642FCD]/30 border border-[#642FCD]"
                >
                  <Printer size={14} /> Print / Export PDF 
                </button>
                <button 
                  onClick={() => setActiveInvoice(null)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 text-slate-600 dark:text-[#DCCCF7] hover:text-slate-900 dark:hover:text-white transition"
                  aria-label="Close Modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Invoice Printable Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 space-y-6 font-sans print:p-6 print:overflow-visible">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{businessProfile.name}</h1>
                  <p className="text-xs text-slate-600 mt-1">{businessProfile.address}</p>
                  <p className="text-xs text-slate-600">Phone: {businessProfile.phone}</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">GSTIN: {businessProfile.gstin}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">TAX INVOICE</span>
                  <div className="text-xs text-slate-600 mt-2">Date: {activeInvoice.date}</div>
                  <div className="text-xs font-semibold text-slate-800">Event: {activeInvoice.name}</div>
                </div>
              </div>

              {/* Customer Bill To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Billed To:</span>
                  <div className="font-bold text-slate-900 text-sm">{activeInvoice.customer?.name}</div>
                  <div>{activeInvoice.customer?.address}</div>
                  <div>Phone: {activeInvoice.customer?.phone}</div>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Event Venue & Details:</span>
                  <div>Venue: {activeInvoice.venue}</div>
                  <div className="mt-1"><span className="font-semibold">Customer GSTIN:</span> {activeInvoice.customer?.gstin || 'N/A (B2C Consumer)'}</div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-700 bg-slate-100">
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Days</th>
                      <th className="p-3 text-right">Rate (₹)</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeInvoice.requirements?.map((req, i) => (
                      <tr key={i}>
                        <td className="p-3 font-medium text-slate-900">{req.name}</td>
                        <td className="p-3 text-right">{req.qty}</td>
                        <td className="p-3 text-right">{req.days}</td>
                        <td className="p-3 text-right">₹ {req.rate}</td>
                        <td className="p-3 text-right font-semibold">₹ {(req.qty * req.days * req.rate).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Tax Split */}
              <div className="flex justify-end pt-4 border-t border-slate-200">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹ {(activeInvoice.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount</span>
                    <span className="text-rose-600">₹ {(activeInvoice.discount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Value</span>
                    <span className="font-semibold">₹ {Math.max(0, (activeInvoice.subtotal || 0) - (activeInvoice.discount || 0)).toLocaleString('en-IN')}</span>
                  </div>
                  {activeInvoice.isGstBill && (
                    <>
                      <div className="flex justify-between text-slate-600">
                        <span>CGST ({activeInvoice.gstRate / 2}%)</span>
                        <span>+ ₹ {((Math.max(0, (activeInvoice.subtotal || 0) - (activeInvoice.discount || 0)) * (activeInvoice.gstRate / 100)) / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>SGST ({activeInvoice.gstRate / 2}%)</span>
                        <span>+ ₹ {((Math.max(0, (activeInvoice.subtotal || 0) - (activeInvoice.discount || 0)) * (activeInvoice.gstRate / 100)) / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
                    <span>Grand Total</span>
                    <span>₹ {(Math.max(0, (activeInvoice.subtotal || 0) - (activeInvoice.discount || 0)) * (1 + (activeInvoice.isGstBill ? activeInvoice.gstRate : 0) / 100)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-amber-600 font-semibold pt-1">
                    <span>Balance Due</span>
                    <span>₹ {(activeInvoice.balanceDue || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* UPI QR & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Terms & Conditions:</span>
                  <p className="text-slate-600 whitespace-pre-line text-[11px]">{businessProfile.terms}</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
                  {businessProfile.upiId?.trim() && (
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-slate-700 mb-1">Scan & Pay via UPI</span>
                      <div className="p-2 bg-white border border-slate-300 rounded-xl print:border-slate-400">
                        <QRCodeSVG value={getUpiPaymentLink(activeInvoice)} size={128} level="M" includeMargin />
                      </div>
                      <span className="text-[11px] text-slate-600 mt-1">UPI ID: {businessProfile.upiId}</span>
                      <span className="text-[11px] text-slate-600">Amount: ₹ {getBalanceDue(activeInvoice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {(businessProfile.bankAccountName || businessProfile.bankName || businessProfile.bankAccountNumber || businessProfile.bankIfsc || businessProfile.bankBranch) && (
                    <div className="min-w-40 text-left sm:text-right">
                      <span className="font-bold text-slate-700 block mb-1">Bank Transfer</span>
                      <div className="space-y-0.5 text-[11px] text-slate-600">
                        {businessProfile.bankAccountName && <div><span className="font-semibold">Account name:</span> {businessProfile.bankAccountName}</div>}
                        {businessProfile.bankName && <div><span className="font-semibold">Bank:</span> {businessProfile.bankName}</div>}
                        {businessProfile.bankAccountNumber && <div><span className="font-semibold">Account no.:</span> {businessProfile.bankAccountNumber}</div>}
                        {businessProfile.bankIfsc && <div><span className="font-semibold">IFSC:</span> {businessProfile.bankIfsc}</div>}
                        {businessProfile.bankBranch && <div><span className="font-semibold">Branch:</span> {businessProfile.bankBranch}</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
