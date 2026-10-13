import React, { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import CalendarGrid from './components/CalendarGrid';
import BookingModal from './components/BookingModal';
import InventoryView from './components/InventoryView';
import StaffView from './components/StaffView';
import InvoicesView from './components/InvoicesView';
import SettingsView from './components/SettingsView';
import { translate as tx } from './translations';

import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Boxes, 
  Users, 
  FileText, 
  Settings as SettingsIcon 
} from 'lucide-react';

function TentFlowApp() {
  const { strings } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal & Booking States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState(null);

  // Business Profile Settings State
  const [businessProfile, setBusinessProfile] = useState({
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

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('tentflow-business-profile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        if (parsedProfile && typeof parsedProfile === 'object') {
          setBusinessProfile(current => ({ ...current, ...parsedProfile }));
        }
      }
    } catch {
      try {
        localStorage.removeItem('tentflow-business-profile');
      } catch {
        // Continue with the default profile when storage is unavailable.
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tentflow-business-profile', JSON.stringify(businessProfile));
    } catch {
      // App state remains usable for this session when storage is unavailable.
    }
  }, [businessProfile]);

  // Equipment & Inventory State
  const [inventory, setInventory] = useState([
    { id: 'i1', category: 'Furniture', name: 'VIP Banquet Chair (Red)', totalQty: 500, rate: 15, status: 'godown', location: 'Main Godown, Rack A-4' },
    { id: 'i2', category: 'Structures', name: 'Waterproof German Hangar', totalQty: 10, rate: 2500, status: 'outside', location: 'Palace Ground, Sultanpur (Gupta Wedding)' },
    { id: 'i3', category: 'Catering', name: 'Round Dining Table with Linen', totalQty: 80, rate: 120, status: 'outside', location: 'Community Hall, Sultanpur (Verma Ring Ceremony)' },
    { id: 'i4', category: 'Lighting', name: 'Halogen Floodlights Setup', totalQty: 25, rate: 300, status: 'repairing', location: 'Repair Shop' }
  ]);

  // Event Bookings State
  const [events, setEvents] = useState([
    {
      id: 'e1',
      customer: { name: 'Ramesh Gupta', phone: '9876500001', address: 'Civil Lines, Sultanpur', gstin: '09AAACG1234F1Z1' },
      name: 'Gupta Wedding Ceremony',
      date: '2026-08-15',
      venue: 'Palace Ground, Sultanpur',
      status: 'Confirmed',
      isGstBill: true,
      gstRate: 18,
      subtotal: 105000,
      discount: 5000,
      requirements: [
        { id: 'r1', itemId: 'i2', name: 'Waterproof German Hangar', qty: 300, days: 2, rate: 150 },
        { id: 'r2', itemId: 'i1', name: 'VIP Banquet Chair (Red)', qty: 500, days: 1, rate: 20 }
      ],
      payments: [{ id: 'p1', date: '2026-08-01', amount: 30000, mode: 'UPI' }],
      balanceDue: 74900
    }
  ]);

  // Staff Workforce & Attendance State
  const [staff, setStaff] = useState([
    {
      id: 's1',
      name: 'Ram Kumar',
      role: 'Main Supervisor',
      wage: 800,
      phone: '9123456780',
      attendance: [{ date: '2026-10-13', status: 'present', notes: 'Palace Ground setup' }],
      payments: [{ id: 'sp1', date: '2026-10-05', amount: 2400, mode: 'Cash' }]
    },
    {
      id: 's2',
      name: 'Shyam Lal',
      role: 'Decorator & Rigger',
      wage: 600,
      phone: '9876543211',
      attendance: [{ date: '2026-10-13', status: 'absent', notes: '' }],
      payments: []
    }
  ]);

  useEffect(() => {
    try {
      const savedStaff = localStorage.getItem('tentflow-staff');
      if (savedStaff) {
        const parsedStaff = JSON.parse(savedStaff);
        if (Array.isArray(parsedStaff)) setStaff(parsedStaff);
      }
    } catch {
      try {
        localStorage.removeItem('tentflow-staff');
      } catch {
        // Continue with the default staff list when storage is unavailable.
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tentflow-staff', JSON.stringify(staff));
    } catch {
      // App state remains usable for this session when storage is unavailable.
    }
  }, [staff]);

  // Handlers for Data Mutation
  const handleSaveBooking = (newBooking) => {
    setEvents(prev => [...prev, { id: `e_${Date.now()}`, ...newBooking }]);
  };

  const handleAddInventoryItem = (newItem) => {
    setInventory(prev => [...prev, newItem]);
  };

  const handleUpdateInventoryItem = (updatedItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleUpdateStaff = (updatedStaff) => {
    setStaff(updatedStaff);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-[#FFFFFF] flex flex-col font-sans transition-colors duration-200 selection:bg-[#642FCD] selection:text-[#FFFFFF]">
      
      {/* Top Header Navbar */}
      <Navbar 
        businessProfile={businessProfile}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Body */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/95 lg:bg-white/50 dark:bg-[#000000]/95 dark:lg:bg-[#000000]/50 backdrop-blur-xl border-r border-slate-200 dark:border-[#642FCD]/30 
          transform transition-transform duration-200 ease-in-out flex flex-col justify-between p-4 flex-shrink-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          top-[65px] lg:top-auto h-[calc(100vh-65px)] lg:h-auto
        `}>
          <nav className="space-y-1.5 overflow-y-auto">
            {[
              { id: 'dashboard', label: strings.dashboard || 'Dashboard', icon: LayoutDashboard },
              { id: 'calendar', label: strings.calendar || 'Calendar & Bookings', icon: CalendarIcon },
              { id: 'inventory', label: strings.inventory || 'Inventory', icon: Boxes },
              { id: 'staff', label: strings.staff || 'Staff & Attendance', icon: Users },
              { id: 'invoices', label: strings.invoices || 'GST Invoices', icon: FileText },
              { id: 'settings', label: strings.settings || 'Settings', icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                    ${activeTab === item.id 
                      ? 'bg-[#642FCD]/10 text-[#642FCD] dark:bg-[#642FCD]/20 dark:text-[#DCCCF7] border border-[#642FCD]/30 shadow-md font-semibold' 
                      : 'text-slate-600 dark:text-[#DCCCF7]/70 hover:bg-[#642FCD]/10 hover:text-slate-900 dark:hover:text-[#FFFFFF]'}
                  `}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Business Status Tag */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#8D2E6E]/30 mt-4 flex-shrink-0 shadow-sm">
            <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/80">{tx(strings, 'System Status')}</div>
            <div className="font-semibold text-[#642FCD] dark:text-[#DCCCF7] mt-0.5 flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#642FCD] animate-pulse"></span>
              {tx(strings, 'Live Operations Sync')}
            </div>
          </div>
        </aside>

        {/* Content Workspace View */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50 dark:bg-[#000000] transition-colors">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            
            {activeTab === 'dashboard' && (
              <Dashboard strings={strings} events={events} inventory={inventory} staff={staff} />
            )}

            {activeTab === 'calendar' && (
              <CalendarGrid 
                events={events} 
                onOpenBookingModal={(dateStr) => {
                  setSelectedBookingDate(dateStr);
                  setIsBookingModalOpen(true);
                }} 
                strings={strings} 
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView 
                inventory={inventory} 
                onAddInventoryItem={handleAddInventoryItem} 
                onUpdateInventoryItem={handleUpdateInventoryItem}
                events={events}
                strings={strings} 
              />
            )}

            {activeTab === 'staff' && (
              <StaffView 
                staff={staff} 
                onUpdateStaff={handleUpdateStaff}
                strings={strings} 
              />
            )}

            {activeTab === 'invoices' && (
              <InvoicesView 
                events={events} 
                businessProfile={businessProfile} 
                strings={strings} 
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                initialSettings={businessProfile} 
                onSaveSettings={(updated) => setBusinessProfile(updated)} 
                strings={strings} 
              />
            )}

          </div>
        </main>

      </div>

      {/* Global Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={selectedBookingDate}
        onSaveBooking={handleSaveBooking}
        inventoryItems={inventory}
        strings={strings}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TentFlowApp />
      </LanguageProvider>
    </ThemeProvider>
  );
}
