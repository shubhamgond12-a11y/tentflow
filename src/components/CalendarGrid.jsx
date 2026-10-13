import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  IndianRupee 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translate as tx } from '../translations';

export default function CalendarGrid({ events = [], onOpenBookingModal, strings }) {
  const { lang } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper for Month Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month & Day calculations
  const englishMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const hindiMonths = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const monthNames = lang === 'hi' ? hindiMonths : englishMonths;

  const daysOfWeek = lang === 'hi' ? ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Generate date grid cells
  const calendarCells = [];
  
  // Empty padding cells for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ type: 'empty', id: `empty-${i}` });
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    calendarCells.push({
      type: 'day',
      dayNumber: day,
      dateStr,
      dayEvents,
      isToday,
      id: `day-${day}`
    });
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner / Navigation Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-2">
            <CalendarIcon size={14} /> {tx(strings, 'Event Schedule Grid')}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">
            {monthNames[month]} {year}
          </h3>
          <p className="text-sm text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
            {tx(strings, 'Click on any date to schedule a new function or inspect active tent house bookings.')}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#000000] p-1.5 rounded-2xl border border-slate-200 dark:border-[#642FCD]/30">
            <button 
              onClick={handlePrevMonth}
              className="p-2 rounded-xl text-slate-600 dark:text-[#DCCCF7] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition"
              title={tx(strings, 'Previous Month')}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={handleToday}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#642FCD] dark:text-[#DCCCF7] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition"
            >
              {tx(strings, 'Today')}
            </button>
            <button 
              onClick={handleNextMonth}
              className="p-2 rounded-xl text-slate-600 dark:text-[#DCCCF7] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition"
              title={tx(strings, 'Next Month')}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button 
            onClick={() => onOpenBookingModal(new Date().toISOString().split('T')[0])}
            className="px-4 py-2.5 rounded-2xl bg-[#642FCD] text-[#FFFFFF] text-xs font-bold hover:bg-[#642FCD]/80 transition shadow-lg shadow-[#642FCD]/20 flex items-center gap-1.5 border border-[#642FCD]"
          >
            <Plus size={16} /> {tx(strings, 'New Booking')}
          </button>
        </div>
      </div>

      {/* Calendar Grid Table Container */}
      <div className="rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl overflow-hidden shadow-xl">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-[#642FCD]/30 bg-slate-100/60 dark:bg-[#000000] text-center text-xs font-bold text-slate-500 dark:text-[#DCCCF7] uppercase tracking-wider py-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-1">{day}</div>
          ))}
        </div>

        {/* Days Grid Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-[#642FCD]/20 border-b border-slate-100 dark:border-[#642FCD]/20">
          {calendarCells.map((cell) => {
            if (cell.type === 'empty') {
              return <div key={cell.id} className="min-h-[110px] sm:min-h-[130px] bg-slate-50/40 dark:bg-[#000000]/40"></div>;
            }

            const hasEvents = cell.dayEvents.length > 0;

            return (
              <div 
                key={cell.id}
                onClick={() => onOpenBookingModal(cell.dateStr)}
                className={`min-h-[110px] sm:min-h-[130px] p-2.5 sm:p-3 transition-colors cursor-pointer group flex flex-col justify-between hover:bg-slate-50 dark:hover:bg-[#642FCD]/10 ${
                  cell.isToday ? 'bg-[#642FCD]/5 dark:bg-[#642FCD]/15' : ''
                }`}
              >
                {/* Cell Header: Day Number */}
                <div className="flex items-center justify-between">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                    cell.isToday 
                      ? 'bg-[#642FCD] text-white shadow-md' 
                      : 'text-slate-700 dark:text-[#FFFFFF] group-hover:text-[#642FCD] dark:group-hover:text-[#DCCCF7]'
                  }`}>
                    {cell.dayNumber}
                  </span>

                  <span className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-[#642FCD] dark:text-[#DCCCF7] transition flex items-center gap-0.5">
                    <Plus size={12} /> {tx(strings, 'Add')}
                  </span>
                </div>

                {/* Day Bookings List */}
                <div className="space-y-1.5 my-2 flex-1 overflow-y-auto max-h-[80px] scrollbar-none">
                  {cell.dayEvents.map((event) => (
                    <div 
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Allows inspecting or editing booking
                        onOpenBookingModal(event.date);
                      }}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 border border-slate-200 dark:border-[#642FCD]/40 text-left transition hover:border-[#642FCD]"
                    >
                      <div className="font-bold text-[11px] text-slate-900 dark:text-white truncate">
                        {event.name}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-[#DCCCF7]/80 truncate flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-[#642FCD]" /> {event.venue}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Dot Footer */}
                {hasEvents && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-[#642FCD] dark:text-[#DCCCF7]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#642FCD] animate-pulse"></span>
                    <span>{cell.dayEvents.length} {tx(strings, cell.dayEvents.length > 1 ? 'Events' : 'Event')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
