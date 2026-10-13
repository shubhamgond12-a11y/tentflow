import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  User, 
  Building2, 
  Boxes, 
  IndianRupee, 
  Save 
} from 'lucide-react';
import { translate as tx } from '../translations';

export default function BookingModal({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSaveBooking, 
  inventoryItems = [], 
  strings 
}) {
  if (!isOpen) return null;

  // Customer Details State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');

  // Event Details State
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [venue, setVenue] = useState('');

  // GST & Billing Configuration
  const [isGstBill, setIsGstBill] = useState(true);
  const [gstRate, setGstRate] = useState(18);
  const [discount, setDiscount] = useState(0);

  // Requirements List (Line Items)
  const [requirements, setRequirements] = useState([
    { id: `req_${Date.now()}`, itemId: '', name: '', qty: 100, days: 1, rate: 15 }
  ]);

  // Payment Tracking
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Sync date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  }, [selectedDate]);

  // Line Item Handlers
  const handleAddRequirement = () => {
    setRequirements(prev => [
      ...prev, 
      { id: `req_${Date.now()}`, itemId: '', name: '', qty: 1, days: 1, rate: 0 }
    ]);
  };

  const handleRemoveRequirement = (id) => {
    if (requirements.length === 1) return;
    setRequirements(prev => prev.filter(r => r.id !== id));
  };

  const handleItemSelect = (index, itemId) => {
    const selectedGear = inventoryItems.find(i => i.id === itemId);
    const updated = [...requirements];
    if (selectedGear) {
      updated[index] = {
        ...updated[index],
        itemId: selectedGear.id,
        name: selectedGear.name,
        rate: selectedGear.rate
      };
    } else {
      updated[index] = { ...updated[index], itemId: '', name: '', rate: 0 };
    }
    setRequirements(updated);
  };

  const handleRequirementChange = (index, field, value) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  // Calculations
  const subtotal = requirements.reduce((acc, req) => {
    const q = Number(req.qty) || 0;
    const d = Number(req.days) || 0;
    const r = Number(req.rate) || 0;
    return acc + (q * d * r);
  }, 0);

  const taxableAmount = Math.max(0, subtotal - Number(discount));
  const gstTaxAmount = isGstBill ? taxableAmount * (Number(gstRate) / 100) : 0;
  const grandTotal = taxableAmount + gstTaxAmount;
  const balanceDue = Math.max(0, grandTotal - Number(advanceAmount));

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress,
        gstin: customerGstin
      },
      name: eventName,
      date: eventDate,
      venue,
      status: 'Confirmed',
      isGstBill,
      gstRate: Number(gstRate),
      subtotal,
      discount: Number(discount),
      requirements,
      payments: Number(advanceAmount) > 0 ? [
        { id: `p_${Date.now()}`, date: new Date().toISOString().split('T')[0], amount: Number(advanceAmount), mode: paymentMode }
      ] : [],
      balanceDue
    };

    if (onSaveBooking) {
      onSaveBooking(newBooking);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-[#000000]/85 backdrop-blur-md overflow-hidden transition-colors">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-[#FFFFFF] transition-colors">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#642FCD]/30 bg-white/95 dark:bg-[#000000]/95 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] border border-[#642FCD]/30">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Create New Event Booking')}</h3>
              <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/80">{tx(strings, 'Reserve gear, generate invoice estimate, and record advance')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 text-slate-600 dark:text-[#DCCCF7] hover:text-slate-900 dark:hover:text-[#FFFFFF] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition"
            aria-label={tx(strings, 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Customer Details */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 space-y-4">
            <h4 className="text-xs font-bold text-[#642FCD] dark:text-[#DCCCF7] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-[#642FCD]/20 pb-2">
              <User size={15} className="text-[#642FCD]" /> {tx(strings, 'Customer Profile & Billing Address')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Customer Name *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. Ramesh Gupta')}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Phone Number *')}</label>
                <input 
                  type="tel" 
                  required
                  placeholder={tx(strings, '9876500001')}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Customer GSTIN (Optional)')}</label>
                <input 
                  type="text" 
                  placeholder={tx(strings, '09AAACG1234F1Z1')}
                  value={customerGstin}
                  onChange={(e) => setCustomerGstin(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD] uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Billing Address')}</label>
              <input 
                type="text" 
                placeholder={tx(strings, 'e.g. Civil Lines, Sultanpur')}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
              />
            </div>
          </div>

          {/* Section 2: Event Information */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 space-y-4">
            <h4 className="text-xs font-bold text-[#642FCD] dark:text-[#DCCCF7] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-[#642FCD]/20 pb-2">
              <Building2 size={15} className="text-[#642FCD]" /> {tx(strings, 'Function & Venue Location')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Event / Function Name *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. Gupta Wedding Ceremony')}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Event Date *')}</label>
                <input 
                  type="date" 
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Venue Location *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. Palace Ground, Sultanpur')}
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Equipment Requirements */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#642FCD]/20 pb-2">
              <h4 className="text-xs font-bold text-[#642FCD] dark:text-[#DCCCF7] uppercase tracking-wider flex items-center gap-2">
                <Boxes size={15} className="text-[#642FCD]" /> {tx(strings, 'Gear & Tent House Requirements')}
              </h4>
              <button 
                type="button"
                onClick={handleAddRequirement}
                className="px-3 py-1 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] border border-[#642FCD]/30 text-xs font-semibold hover:bg-[#642FCD]/20 transition flex items-center gap-1"
              >
                <Plus size={14} /> {tx(strings, 'Add Item')}
              </button>
            </div>

            {/* Column Labels Fixed On Top */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-500 dark:text-[#DCCCF7]/80 uppercase tracking-wider px-3 py-1 bg-slate-200/50 dark:bg-[#642FCD]/10 rounded-lg">
              <div className="col-span-4">{tx(strings, 'Select Gear')}</div>
              <div className="col-span-3">{tx(strings, 'Description / Name')}</div>
              <div className="col-span-1 text-center">{tx(strings, 'Qty')}</div>
              <div className="col-span-1 text-center">{tx(strings, 'Days')}</div>
              <div className="col-span-2 text-right">{tx(strings, 'Rate (₹)')}</div>
              <div className="col-span-1 text-right">{tx(strings, 'Action')}</div>
            </div>

            {/* Line Item Entry Rows */}
            <div className="space-y-3">
              {requirements.map((req, idx) => {
                const itemTotal = (Number(req.qty) || 0) * (Number(req.days) || 0) * (Number(req.rate) || 0);

                return (
                  <div key={req.id} className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-[#000000] p-3 rounded-xl border border-slate-200 dark:border-[#642FCD]/20 shadow-sm">
                    
                    {/* Select Preset from Stock */}
                    <div className="col-span-12 sm:col-span-4">
                      <label className="block sm:hidden text-[10px] text-slate-500 dark:text-[#DCCCF7]/70 mb-0.5">{tx(strings, 'Select Gear')}</label>
                      <select 
                        value={req.itemId}
                        onChange={(e) => handleItemSelect(idx, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                      >
                        <option value="" className="bg-white dark:bg-[#000000]">{tx(strings, '-- Custom / Stock Item --')}</option>
                        {inventoryItems.map(item => (
                          <option key={item.id} value={item.id} className="bg-white dark:bg-[#000000]">{item.name} (Stock: {item.totalQty})</option>
                        ))}
                      </select>
                    </div>

                    {/* Item Description / Name */}
                    <div className="col-span-12 sm:col-span-3">
                      <label className="block sm:hidden text-[10px] text-slate-500 dark:text-[#DCCCF7]/70 mb-0.5">{tx(strings, 'Description')}</label>
                      <input 
                        type="text"
                        required
                        placeholder={tx(strings, 'Item name')}
                        value={req.name}
                        onChange={(e) => handleRequirementChange(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 sm:col-span-1">
                      <label className="block sm:hidden text-[10px] text-slate-500 dark:text-[#DCCCF7]/70 mb-0.5 text-center">{tx(strings, 'Qty')}</label>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={req.qty}
                        onChange={(e) => handleRequirementChange(idx, 'qty', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD] text-center"
                      />
                    </div>

                    {/* Duration in Days */}
                    <div className="col-span-4 sm:col-span-1">
                      <label className="block sm:hidden text-[10px] text-slate-500 dark:text-[#DCCCF7]/70 mb-0.5 text-center">{tx(strings, 'Days')}</label>
                      <input 
                        type="number"
                        min="1"
                        required
                        value={req.days}
                        onChange={(e) => handleRequirementChange(idx, 'days', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD] text-center"
                      />
                    </div>

                    {/* Daily Rate */}
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block sm:hidden text-[10px] text-slate-500 dark:text-[#DCCCF7]/70 mb-0.5 text-right">{tx(strings, 'Rate (₹)')}</label>
                      <input 
                        type="number"
                        min="0"
                        required
                        value={req.rate}
                        onChange={(e) => handleRequirementChange(idx, 'rate', Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD] text-right"
                      />
                    </div>

                    {/* Delete Action */}
                    <div className="col-span-1 flex justify-end items-center pt-3 sm:pt-0">
                      <button 
                        type="button"
                        onClick={() => handleRemoveRequirement(req.id)}
                        disabled={requirements.length === 1}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-[#8D2E6E]/20 dark:text-[#DCCCF7] hover:bg-rose-500/20 dark:hover:bg-[#8D2E6E]/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Billing Summary & Advance Collection */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Advance Payment Entry */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#642FCD] dark:text-[#DCCCF7] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-[#642FCD]/20 pb-2">
                <IndianRupee size={15} className="text-[#642FCD]" /> {tx(strings, 'Advance Payment Record')}
              </h4>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Advance Received (₹)')}</label>
                <input 
                  type="number" 
                  min="0"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm font-bold focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Payment Mode')}</label>
                <select 
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
                >
                  <option value="UPI" className="bg-white dark:bg-[#000000]">{tx(strings, 'UPI (GPay/PhonePe/Paytm)')}</option>
                  <option value="Cash" className="bg-white dark:bg-[#000000]">{tx(strings, 'Cash Payment')}</option>
                  <option value="Bank Transfer" className="bg-white dark:bg-[#000000]">{tx(strings, 'Bank NEFT/RTGS')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-[#DCCCF7]">
                <input 
                  type="checkbox" 
                  id="gstToggle" 
                  checked={isGstBill} 
                  onChange={(e) => setIsGstBill(e.target.checked)}
                  className="rounded bg-white dark:bg-[#000000] border-slate-300 dark:border-[#642FCD] text-[#642FCD] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="gstToggle" className="cursor-pointer">{tx(strings, 'Generate Official GST Tax Bill')} ({gstRate}%)</label>
              </div>
            </div>

            {/* Total Calculation Card */}
            <div className="bg-white dark:bg-[#000000] p-4 rounded-xl border border-slate-200 dark:border-[#642FCD]/30 space-y-2 text-xs shadow-sm">
              <div className="flex justify-between text-slate-600 dark:text-[#DCCCF7]/80">
                <span>{tx(strings, 'Items Subtotal:')}</span>
                <span>₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-[#DCCCF7]/80">
                <span>{tx(strings, 'Discount Offered:')}</span>
                <input 
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 px-2 py-0.5 rounded bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-right text-xs"
                />
              </div>

              {isGstBill && (
                <div className="flex justify-between text-slate-600 dark:text-[#DCCCF7]/80">
                  <span>GST ({gstRate}%):</span>
                  <span>+ ₹ {gstTaxAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-[#FFFFFF] pt-2 border-t border-slate-100 dark:border-[#642FCD]/30">
                <span>{tx(strings, 'Grand Total:')}</span>
                <span>₹ {grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-600 dark:text-[#DCCCF7] font-semibold pt-1">
                <span>{tx(strings, 'Advance Paid:')}</span>
                <span className="text-[#642FCD] dark:text-[#DCCCF7]">- ₹ {Number(advanceAmount).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-[#FFFFFF] pt-2 border-t border-slate-200 dark:border-[#642FCD]/40">
                <span>{tx(strings, 'Remaining Balance Due:')}</span>
                <span className="text-[#642FCD] dark:text-[#DCCCF7]">₹ {balanceDue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#642FCD]/30">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-slate-700 dark:text-[#DCCCF7] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#642FCD]/20 transition"
            >
              {tx(strings, 'Cancel')}
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-[#642FCD] text-[#FFFFFF] font-bold text-xs hover:bg-[#642FCD]/80 transition shadow-lg shadow-[#642FCD]/30 flex items-center gap-2 border border-[#642FCD]"
            >
              <Save size={16} /> {tx(strings, 'Save & Confirm Booking')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
