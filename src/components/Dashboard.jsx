import React from 'react';
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  Boxes, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { translate as tx } from '../translations';

export default function Dashboard({ events = [], inventory = [], staff = [], strings = {} }) {
  // Metric Calculations
  const totalBookings = events.length;
  const confirmedBookings = events.filter(e => e.status === 'Confirmed').length;
  
  const totalRevenue = events.reduce((acc, ev) => acc + (ev.subtotal || 0), 0);
  const totalBalanceDue = events.reduce((acc, ev) => acc + (ev.balanceDue || 0), 0);

  const totalInventoryItems = inventory.length;
  const itemsOutside = inventory.filter(i => i.status === 'outside').length;
  const itemsRepairing = inventory.filter(i => i.status === 'repairing').length;

  const totalStaff = staff.length;
  const presentStaffToday = staff.filter(s => {
    const todayStr = new Date().toISOString().split('T')[0];
    return s.attendance?.some(a => a.date === todayStr && a.status === 'present');
  }).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner / Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 backdrop-blur-xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#642FCD]/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-3">
            <TrendingUp size={14} /> {tx(strings, 'Real-Time Business Overview')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#FFFFFF] tracking-tight">
            {tx(strings, 'Event & Warehouse Dashboard')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#DCCCF7]/80 mt-1 max-w-2xl">
            {tx(strings, 'Live metrics for active tent bookings, inventory deployment, revenue collections, and daily staff attendance.')}
          </p>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue & Pending Collections */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#DCCCF7]/80 text-xs font-medium">
            <span>{tx(strings, 'Total Booking Revenue')}</span>
            <div className="p-2 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7]">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-[#FFFFFF] mt-3">₹ {totalRevenue.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-[#DCCCF7] flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#642FCD]/20">
            <span>{tx(strings, 'Balance Due:')}</span>
            <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">₹ {totalBalanceDue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Active Bookings Status */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#DCCCF7]/80 text-xs font-medium">
            <span>{tx(strings, 'Event Bookings')}</span>
            <div className="p-2 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7]">
              <CalendarIcon size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-[#FFFFFF] mt-3">{totalBookings} {tx(strings, 'Total')}</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-[#DCCCF7] flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#642FCD]/20">
            <span>{tx(strings, 'Confirmed Events:')}</span>
            <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">{confirmedBookings} {tx(strings, 'Bookings')}</span>
          </div>
        </div>

        {/* Equipment Deployed Outside */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#DCCCF7]/80 text-xs font-medium">
            <span>{tx(strings, 'Gear & Inventory')}</span>
            <div className="p-2 rounded-xl bg-[#8D2E6E]/10 dark:bg-[#8D2E6E]/30 text-[#8D2E6E] dark:text-[#DCCCF7]">
              <Boxes size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-[#FFFFFF] mt-3">{totalInventoryItems} {tx(strings, 'Categories')}</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-[#DCCCF7] flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#642FCD]/20">
            <span>{tx(strings, 'Deployed at Venues:')}</span>
            <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">{itemsOutside} {tx(strings, 'Items')}</span>
          </div>
        </div>

        {/* Workforce Attendance Ratio */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition shadow-lg">
          <div className="flex items-center justify-between text-slate-500 dark:text-[#DCCCF7]/80 text-xs font-medium">
            <span>{tx(strings, 'Workforce Attendance')}</span>
            <div className="p-2 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7]">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-[#FFFFFF] mt-3">{presentStaffToday} / {totalStaff}</div>
          <div className="mt-2 text-xs text-slate-600 dark:text-[#DCCCF7] flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#642FCD]/20">
            <span>{tx(strings, 'Present Today:')}</span>
            <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">{totalStaff > 0 ? Math.round((presentStaffToday / totalStaff) * 100) : 0}% {tx(strings, 'Attendance')}</span>
          </div>
        </div>

      </div>

      {/* Upcoming Events & Inventory Warning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent / Upcoming Event Schedule */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#642FCD]/20 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Upcoming Event Deliveries')}</h3>
              <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/70">{tx(strings, 'Scheduled tent setups and function dates')}</p>
            </div>
            <span className="text-xs text-[#642FCD] dark:text-[#DCCCF7] bg-[#642FCD]/10 dark:bg-[#642FCD]/20 px-3 py-1 rounded-full border border-[#642FCD]/30">
              {events.length} {tx(strings, 'Active')}
            </span>
          </div>

          <div className="space-y-3">
            {events.length > 0 ? (
              events.map((ev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 hover:border-[#642FCD] transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ev.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#DCCCF7]/80 mt-0.5">{ev.customer?.name} • {ev.venue}</p>
                    <span className="text-[11px] text-[#642FCD] dark:text-[#DCCCF7] font-semibold mt-1 inline-block bg-[#642FCD]/10 dark:bg-[#642FCD]/20 px-2 py-0.5 rounded">
                      {tx(strings, 'Date:')} {ev.date}
                    </span>
                  </div>
                  <div className="text-right sm:self-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-[#FFFFFF]">₹ {(ev.subtotal || 0).toLocaleString('en-IN')}</div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                      ev.balanceDue === 0 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:bg-[#642FCD]/30 dark:text-[#DCCCF7] border border-emerald-500/20 dark:border-[#642FCD]/50' 
                        : 'bg-rose-500/10 text-rose-600 dark:bg-[#8D2E6E]/30 dark:text-[#FFFFFF] border border-rose-500/20 dark:border-[#8D2E6E]/50'
                    }`}>
                      {ev.balanceDue === 0 ? 'Fully Paid' : `₹ ${ev.balanceDue} Due`}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/60 italic py-4">{tx(strings, 'No upcoming events scheduled.')}</p>
            )}
          </div>
        </div>

        {/* Maintenance & Stock Alerts */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 dark:border-[#642FCD]/20 pb-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Warehouse Status')}</h3>
              <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/70">{tx(strings, 'Inventory condition highlights')}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-[#642FCD]/10 border border-rose-500/20 dark:border-[#642FCD]/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-[#DCCCF7]">
                <span>{tx(strings, 'Items Under Maintenance')}</span>
                <span className="text-white bg-rose-600 dark:bg-[#8D2E6E] px-2 py-0.5 rounded-full">{itemsRepairing}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#DCCCF7]/80">
                {tx(strings, 'Gear in repair shop need inspection before next major booking dispatch.')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-[#DCCCF7]">
                <span>{tx(strings, 'Deployed Offsite')}</span>
                <span className="text-white bg-[#642FCD] px-2 py-0.5 rounded-full">{itemsOutside}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#DCCCF7]/80">
                {tx(strings, 'Equipment currently set up at customer event venues across Sultanpur.')}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#642FCD]/20 text-center">
            <p className="text-[11px] text-slate-400 dark:text-[#DCCCF7]/70">{tx(strings, 'TentFlow Operational Intelligence')}</p>
          </div>
        </div>

      </div>

    </div>
  );
}
