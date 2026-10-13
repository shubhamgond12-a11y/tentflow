import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Shield, 
  UserCheck, 
  ListFilter,
  Clock 
} from 'lucide-react';
import { translate as tx } from '../translations';

export default function StaffView({ staff = [], onUpdateStaff, strings = {} }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leaveStaff, setLeaveStaff] = useState(null);
  const [leaveStart, setLeaveStart] = useState(new Date().toISOString().split('T')[0]);
  const [leaveEnd, setLeaveEnd] = useState('');
  const [leaveReason, setLeaveReason] = useState('Going home');

  const [name, setName] = useState('');
  const [role, setRole] = useState('Main Supervisor');
  const [wage, setWage] = useState(800);
  const [phone, setPhone] = useState('');

  const [staffList, setStaffList] = useState(
    staff.length > 0 ? staff : [
      {
        id: 's1',
        name: 'Ram Kumar',
        role: 'Main Supervisor',
        wage: 800,
        phone: '9123456780',
        attendance: [{ date: new Date().toISOString().split('T')[0], status: 'present', notes: 'Event setup' }],
        payments: [{ id: 'sp1', date: '2026-10-05', amount: 2400, mode: 'Cash' }]
      },
      {
        id: 's2',
        name: 'Shyam Lal',
        role: 'Decorator & Rigger',
        wage: 600,
        phone: '9876543211',
        attendance: [{ date: new Date().toISOString().split('T')[0], status: 'absent', notes: '' }],
        payments: []
      }
    ]
  );

  const updateStaffList = (updater) => setStaffList(updater);

  useEffect(() => {
    onUpdateStaff?.(staffList);
  }, [staffList, onUpdateStaff]);

  const getAttendanceStatus = (member, dateStr) => {
    const record = member.attendance?.find(a => a.date === dateStr);
    if (record) return record.status;
    const isAway = member.leavePeriods?.some(period => period.startDate <= dateStr && period.endDate >= dateStr);
    return isAway ? 'leave' : 'unmarked';
  };

  const handleSaveLeave = (e) => {
    e.preventDefault();
    if (!leaveStaff || leaveEnd < leaveStart) return;
    updateStaffList(prev => prev.map(member => member.id === leaveStaff.id
      ? { ...member, leavePeriods: [...(member.leavePeriods || []), { id: `l_${Date.now()}`, startDate: leaveStart, endDate: leaveEnd, reason: leaveReason }] }
      : member));
    setLeaveStaff(null);
    setLeaveEnd('');
    setLeaveReason('Going home');
  };

  const handleMarkInactive = (member) => {
    updateStaffList(prev => prev.map(item => item.id === member.id
      ? { ...item, employmentStatus: 'inactive', endDate: new Date().toISOString().split('T')[0] }
      : item));
    setSelectedStaff(null);
  };

  const handleMarkAttendance = (staffId, status, notes = '') => {
    updateStaffList(prev => prev.map(member => {
      if (member.id !== staffId) return member;
      const existingIndex = member.attendance?.findIndex(a => a.date === selectedDate);
      let updatedAttendance = [...(member.attendance || [])];
      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = { date: selectedDate, status, notes };
      } else {
        updatedAttendance.push({ date: selectedDate, status, notes });
      }
      return { ...member, attendance: updatedAttendance };
    }));
  };

  const handleBulkMark = (status) => {
    updateStaffList(prev => prev.map(member => {
      const onLeave = member.leavePeriods?.some(period => period.startDate <= selectedDate && period.endDate >= selectedDate);
      const inactive = member.employmentStatus === 'inactive' && member.endDate && member.endDate < selectedDate;
      if (onLeave || inactive) return member;
      const existingIndex = member.attendance?.findIndex(a => a.date === selectedDate);
      let updatedAttendance = [...(member.attendance || [])];
      if (existingIndex >= 0) {
        updatedAttendance[existingIndex] = { ...updatedAttendance[existingIndex], status };
      } else {
        updatedAttendance.push({ date: selectedDate, status, notes: '' });
      }
      return { ...member, attendance: updatedAttendance };
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newStaffMember = {
      id: `s_${Date.now()}`,
      name,
      role,
      wage: Number(wage),
      phone,
      attendance: [],
      payments: []
    };
    updateStaffList(prev => [...prev, newStaffMember]);
    setName('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const activeStaff = staffList.filter(member => member.employmentStatus !== 'inactive' || !member.endDate || member.endDate >= selectedDate);
  const totalStaffCount = activeStaff.length;
  const presentCount = activeStaff.filter(s => getAttendanceStatus(s, selectedDate) === 'present').length;
  const halfDayCount = activeStaff.filter(s => getAttendanceStatus(s, selectedDate) === 'halfday').length;
  const absentCount = activeStaff.filter(s => getAttendanceStatus(s, selectedDate) === 'absent').length;
  const leaveCount = activeStaff.filter(s => getAttendanceStatus(s, selectedDate) === 'leave').length;

  const calculateStaffMetrics = (member) => {
    const totalDaysWorked = member.attendance ? member.attendance.filter(a => a.status === 'present').length + (member.attendance.filter(a => a.status === 'halfday').length * 0.5) : 0;
    const totalEarned = totalDaysWorked * member.wage;
    const totalPaid = member.payments ? member.payments.reduce((acc, p) => acc + p.amount, 0) : 0;
    const balanceDue = Math.max(0, totalEarned - totalPaid);
    return { totalDaysWorked, totalEarned, totalPaid, balanceDue };
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12 transition-colors">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-2">
            <Users size={14} /> Workforce & Payroll Management
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Staff & Attendance Register')}</h3>
          <p className="text-sm text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
            {tx(strings, 'Mark daily worker attendance, track wages earned, and view workforce logs.')}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#642FCD] text-[#FFFFFF] font-semibold hover:bg-[#642FCD]/80 transition shadow-lg shadow-[#642FCD]/20 flex items-center gap-2 text-sm border border-[#642FCD]"
        >
          <UserPlus size={16} /> {tx(strings, 'Add Staff Member')}
        </button>
      </div>

      {/* Tabs & Date Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#642FCD]/30 pb-4">
        <div className="flex items-center gap-2 bg-white dark:bg-[#000000] p-1.5 rounded-2xl border border-slate-200 dark:border-[#642FCD]/30 shadow-sm">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-[#642FCD] text-[#FFFFFF] shadow-md border border-[#642FCD]'
                : 'text-slate-600 dark:text-[#DCCCF7]/70 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            <UserCheck size={15} /> {tx(strings, 'Daily Attendance Register')}
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-[#642FCD] text-[#FFFFFF] shadow-md border border-[#642FCD]'
                : 'text-slate-600 dark:text-[#DCCCF7]/70 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
            }`}
          >
            <ListFilter size={15} /> {tx(strings, 'Staff Directory & Payroll')}
          </button>
        </div>

        {activeTab === 'attendance' && (
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-600 dark:text-[#DCCCF7] flex items-center gap-1.5 font-medium">
              <CalendarIcon size={14} className="text-[#642FCD]" /> {tx(strings, 'Date:')}
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD] cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 shadow-sm">
              <div className="text-xs text-slate-500 dark:text-[#DCCCF7]/70">{tx(strings, 'Total Workers')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF] mt-1">{totalStaffCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 border border-[#642FCD]/30 shadow-sm">
              <div className="text-xs text-[#642FCD] dark:text-[#DCCCF7] font-semibold">{tx(strings, 'Present Today')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF] mt-1">{presentCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#8D2E6E]/10 dark:bg-[#8D2E6E]/20 border border-[#8D2E6E]/30 shadow-sm">
              <div className="text-xs text-[#8D2E6E] dark:text-[#DCCCF7] font-semibold">{tx(strings, 'Half Day')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF] mt-1">{halfDayCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 dark:bg-[#8D2E6E]/30 border border-rose-500/20 dark:border-[#8D2E6E]/50 shadow-sm">
              <div className="text-xs text-rose-600 dark:text-[#DCCCF7] font-semibold">{tx(strings, 'Absent')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF] mt-1">{absentCount}</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm">
              <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold">{tx(strings, 'On Leave / Away')}</div>
              <div className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF] mt-1">{leaveCount}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#000000] p-4 rounded-2xl border border-slate-200 dark:border-[#642FCD]/30 shadow-sm">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#DCCCF7]/60" />
              <input 
                type="text"
                placeholder={tx(strings, 'Search worker by name...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
              <button 
                onClick={() => handleBulkMark('present')}
                className="px-3 py-1.5 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] border border-[#642FCD]/30 hover:bg-[#642FCD]/20 dark:hover:bg-[#642FCD]/30 font-medium transition"
              >
                {tx(strings, 'Mark All Present')}
              </button>
              <button 
                onClick={() => handleBulkMark('absent')}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-[#8D2E6E]/20 text-rose-600 dark:text-[#DCCCF7] border border-rose-500/20 dark:border-[#8D2E6E]/40 hover:bg-rose-500/20 dark:hover:bg-[#8D2E6E]/30 font-medium transition"
              >
                {tx(strings, 'Mark All Absent')}
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#642FCD]/30 bg-slate-100/60 dark:bg-[#000000] text-xs font-semibold text-slate-500 dark:text-[#DCCCF7] uppercase tracking-wider">
                    <th className="p-4 pl-6">{tx(strings, 'Worker Name')}</th>
                    <th className="p-4">{tx(strings, 'Role')}</th>
                    <th className="p-4">{tx(strings, 'Daily Wage')}</th>
                    <th className="p-4 text-center">{tx(strings, 'Status')}</th>
                    <th className="p-4 pr-6">{tx(strings, 'Work Notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#642FCD]/20">
                  {filteredStaff.filter(member => member.employmentStatus !== 'inactive' || !member.endDate || member.endDate >= selectedDate).map((member) => {
                    const status = getAttendanceStatus(member, selectedDate);
                    const currentRecord = member.attendance?.find(a => a.date === selectedDate);

                    return (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-[#642FCD]/10 transition">
                        <td className="p-4 pl-6 font-semibold text-slate-900 dark:text-[#FFFFFF]">{member.name}</td>
                        <td className="p-4 text-xs text-slate-500 dark:text-[#DCCCF7]/80">{member.role}</td>
                        <td className="p-4 text-xs font-semibold text-slate-700 dark:text-[#DCCCF7]">₹ {member.wage} / day</td>
                        
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {status === 'leave' && <span className="px-2 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">{tx(strings, 'On leave')}</span>}
                            <button
                              onClick={() => handleMarkAttendance(member.id, 'present', currentRecord?.notes || '')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'present'
                                  ? 'bg-[#642FCD] text-[#FFFFFF] font-bold shadow-md border border-[#642FCD]'
                                  : 'bg-slate-50 dark:bg-[#000000] text-slate-600 dark:text-[#DCCCF7]/70 border border-slate-200 dark:border-[#642FCD]/30 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                              }`}
                            >
                              <Check size={14} /> {tx(strings, 'Present')}
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(member.id, 'halfday', currentRecord?.notes || '')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'halfday'
                                  ? 'bg-[#8D2E6E] text-[#FFFFFF] font-bold shadow-md border border-[#8D2E6E]'
                                  : 'bg-slate-50 dark:bg-[#000000] text-slate-600 dark:text-[#DCCCF7]/70 border border-slate-200 dark:border-[#642FCD]/30 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                              }`}
                            >
                              <Clock size={14} /> {tx(strings, 'Half Day')}
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(member.id, 'absent', currentRecord?.notes || '')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                                status === 'absent'
                                  ? 'bg-rose-600 dark:bg-[#8D2E6E]/60 text-[#FFFFFF] font-bold shadow-md border border-rose-600 dark:border-[#8D2E6E]'
                                  : 'bg-slate-50 dark:bg-[#000000] text-slate-600 dark:text-[#DCCCF7]/70 border border-slate-200 dark:border-[#642FCD]/30 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
                              }`}
                            >
                              <X size={14} /> {tx(strings, 'Absent')}
                            </button>
                          </div>
                        </td>

                        <td className="p-4 pr-6">
                          <input 
                            type="text" 
                            placeholder={tx(strings, 'Add note...')}
                            value={currentRecord?.notes || ''}
                            onChange={(e) => handleMarkAttendance(member.id, status === 'unmarked' ? 'present' : status, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-xs text-slate-900 dark:text-[#FFFFFF] focus:outline-none focus:border-[#642FCD]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => {
            const metrics = calculateStaffMetrics(member);
            return (
              <div 
                key={member.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 border border-[#642FCD]/30 flex items-center justify-center text-[#642FCD] dark:text-[#DCCCF7] font-bold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-[#FFFFFF] text-base">{member.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 flex items-center gap-1 mt-0.5">
                        <Shield size={12} className="text-[#642FCD]" /> {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#642FCD]/20 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-[#DCCCF7]/60 block">{tx(strings, 'Daily Wage')}</span>
                      <span className="font-bold text-slate-900 dark:text-[#FFFFFF] text-sm">₹ {member.wage} / day</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-[#DCCCF7]/60 block">{tx(strings, 'Phone')}</span>
                      <span className="font-semibold text-slate-700 dark:text-[#DCCCF7]">{member.phone}</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-[#000000] p-3 rounded-2xl border border-slate-200 dark:border-[#642FCD]/20">
                    <div>
                      <span className="text-slate-400 dark:text-[#DCCCF7]/60 block">{tx(strings, 'Days Worked')}</span>
                      <span className="font-bold text-slate-900 dark:text-[#FFFFFF]">{metrics.totalDaysWorked} Days</span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-[#DCCCF7]/60 block">{tx(strings, 'Balance Due')}</span>
                      <span className="font-bold text-[#642FCD] dark:text-[#DCCCF7]">₹ {metrics.balanceDue}</span>
                    </div>
                  </div>
                </div>

                {member.employmentStatus === 'inactive' && <p className="text-xs font-semibold text-slate-500">Former staff · left {member.endDate}</p>}
                <div className="space-y-2">
                  {member.employmentStatus !== 'inactive' && <button
                    onClick={() => { setLeaveStaff(member); setLeaveStart(new Date().toISOString().split('T')[0]); }}
                    className="w-full py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition border border-amber-500/30"
                  >{tx(strings, 'Record Leave / Time Away')}</button>}
                  <button
                    onClick={() => setSelectedStaff(member)}
                    className="w-full py-2 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold hover:bg-[#642FCD]/20 dark:hover:bg-[#642FCD]/30 transition border border-[#642FCD]/30"
                  >
                    {tx(strings, 'View Full Profile & History')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STAFF PROFILE & HISTORY */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md" onClick={() => setSelectedStaff(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="staff-profile-title" onClick={e => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#090909] border border-[#642FCD]/40 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white">
            <div className="flex justify-between items-start gap-4">
              <div><p className="text-xs uppercase tracking-wide text-[#642FCD]">{tx(strings, 'Staff profile')}</p><h3 id="staff-profile-title" className="text-xl font-bold mt-1">{selectedStaff.name}</h3><p className="text-sm text-slate-500 dark:text-[#DCCCF7]/70">{selectedStaff.role} · {selectedStaff.phone}</p></div>
              <button type="button" onClick={() => setSelectedStaff(null)} aria-label={tx(strings, 'Close')} className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 dark:bg-black p-3"><span className="block text-xs text-slate-500">{tx(strings, 'Daily wage')}</span><b>₹ {selectedStaff.wage}</b></div>
              <div className="rounded-xl bg-slate-50 dark:bg-black p-3"><span className="block text-xs text-slate-500">{tx(strings, 'Days worked')}</span><b>{calculateStaffMetrics(selectedStaff).totalDaysWorked}</b></div>
              <div className="rounded-xl bg-slate-50 dark:bg-black p-3"><span className="block text-xs text-slate-500">{tx(strings, 'Total paid')}</span><b>₹ {calculateStaffMetrics(selectedStaff).totalPaid}</b></div>
              <div className="rounded-xl bg-slate-50 dark:bg-black p-3"><span className="block text-xs text-slate-500">{tx(strings, 'Balance due')}</span><b>₹ {calculateStaffMetrics(selectedStaff).balanceDue}</b></div>
            </div>
            <div><h4 className="font-semibold mb-2">{tx(strings, 'Leave / time away')}</h4>
              {(selectedStaff.leavePeriods || []).length === 0 ? <p className="text-sm text-slate-500">{tx(strings, 'No leave recorded.')}</p> : <ul className="space-y-2">{[...(selectedStaff.leavePeriods || [])].sort((a,b) => b.startDate.localeCompare(a.startDate)).map(period => <li key={period.id} className="flex justify-between gap-3 rounded-xl bg-amber-500/10 p-3 text-sm"><span>{tx(strings, period.reason)}</span><span className="text-right">{period.startDate} – {period.endDate}</span></li>)}</ul>}
            </div>
            <div><h4 className="font-semibold mb-2">{tx(strings, 'Attendance history')}</h4>
              {(selectedStaff.attendance || []).length === 0 ? <p className="text-sm text-slate-500">{tx(strings, 'No attendance entries recorded.')}</p> : <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-[#642FCD]/20"><table className="w-full text-sm"><thead className="sticky top-0 bg-slate-100 dark:bg-black"><tr><th className="p-2 text-left">{tx(strings, 'Date')}</th><th className="p-2 text-left">{tx(strings, 'Status')}</th><th className="p-2 text-left">{tx(strings, 'Notes')}</th></tr></thead><tbody>{[...(selectedStaff.attendance || [])].sort((a,b) => b.date.localeCompare(a.date)).map(record => <tr key={record.date} className="border-t border-slate-100 dark:border-[#642FCD]/20"><td className="p-2">{record.date}</td><td className="p-2 capitalize">{tx(strings, record.status)}</td><td className="p-2">{record.notes || '—'}</td></tr>)}</tbody></table></div>}
            </div>
            <div><h4 className="font-semibold mb-2">{tx(strings, 'Wage payments')}</h4>
              {(selectedStaff.payments || []).length === 0 ? <p className="text-sm text-slate-500">{tx(strings, 'No payments recorded.')}</p> : <ul className="space-y-2">{[...selectedStaff.payments].sort((a,b) => b.date.localeCompare(a.date)).map(payment => <li key={payment.id} className="flex justify-between rounded-xl bg-slate-50 dark:bg-black p-3 text-sm"><span>{payment.date} · {payment.mode}</span><b>₹ {payment.amount}</b></li>)}</ul>}
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-[#642FCD]/20 pt-4">
              {selectedStaff.employmentStatus === 'inactive'
                ? <button type="button" onClick={() => { const reactivated = { ...selectedStaff, employmentStatus: 'active', endDate: '' }; updateStaffList(prev => prev.map(member => member.id === selectedStaff.id ? reactivated : member)); setSelectedStaff(reactivated); }} className="text-sm font-semibold text-[#642FCD]">{tx(strings, 'Reactivate staff')}</button>
                : <button type="button" onClick={() => handleMarkInactive(selectedStaff)} className="text-sm font-semibold text-rose-600">{tx(strings, 'Mark as no longer working')}</button>}
              <button type="button" onClick={() => setSelectedStaff(null)} className="px-4 py-2 rounded-xl bg-[#642FCD] text-white text-sm font-semibold">{tx(strings, 'Done')}</button>
            </div>
          </section>
        </div>
      )}

      {/* RECORD TIME AWAY */}
      {leaveStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/85 backdrop-blur-md" onClick={() => setLeaveStaff(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="leave-title" onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-3xl bg-white dark:bg-[#090909] border border-amber-500/40 shadow-2xl p-6 space-y-5 text-slate-900 dark:text-white">
            <div className="flex justify-between items-start"><div><h3 id="leave-title" className="text-lg font-bold">{tx(strings, 'Record time away')}</h3><p className="text-sm text-slate-500">{leaveStaff.name} {tx(strings, 'will show as on leave during these dates.')}</p></div><button onClick={() => setLeaveStaff(null)} aria-label={tx(strings, 'Close')} className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20"><X size={18} /></button></div>
            <form onSubmit={handleSaveLeave} className="space-y-4">
              <label className="block text-sm">{tx(strings, 'Reason')}<select value={leaveReason} onChange={e => setLeaveReason(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 dark:border-[#642FCD]/40 bg-white dark:bg-black p-2.5"><option>{tx(strings, 'Going home')}</option><option>{tx(strings, 'Personal leave')}</option><option>{tx(strings, 'Medical leave')}</option><option>{tx(strings, 'Other')}</option></select></label>
              <div className="grid grid-cols-2 gap-3"><label className="block text-sm">{tx(strings, 'From')}<input required type="date" value={leaveStart} onChange={e => setLeaveStart(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 dark:border-[#642FCD]/40 bg-white dark:bg-black p-2.5" /></label><label className="block text-sm">{tx(strings, 'Expected return')}<input required type="date" min={leaveStart} value={leaveEnd} onChange={e => setLeaveEnd(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 dark:border-[#642FCD]/40 bg-white dark:bg-black p-2.5" /></label></div>
              <p className="text-xs text-slate-500">{tx(strings, 'Days in this period count as leave, not absence or paid work. You can mark the worker present if they return early.')}</p>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setLeaveStaff(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-black text-sm">{tx(strings, 'Cancel')}</button><button type="submit" disabled={!leaveEnd || leaveEnd < leaveStart} className="px-4 py-2 rounded-xl bg-[#642FCD] text-white text-sm font-semibold disabled:opacity-50">{tx(strings, 'Save leave')}</button></div>
            </form>
          </section>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#000000]/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD] rounded-3xl shadow-2xl p-6 space-y-6 text-slate-900 dark:text-[#FFFFFF]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#642FCD]/30 pb-4">
              <h4 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Add Staff Member')}</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 text-slate-500 dark:text-[#DCCCF7]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Full Name *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. Ram Kumar')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Role / Designation *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. Main Supervisor')}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Daily Wage (₹) *')}</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={wage}
                    onChange={(e) => setWage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Phone Number *')}</label>
                  <input 
                    type="tel" 
                    required
                    placeholder={tx(strings, '9123456780')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#642FCD]/30">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-slate-700 dark:text-[#DCCCF7] text-sm font-semibold hover:bg-slate-200 dark:hover:bg-[#642FCD]/20"
                >
                  {tx(strings, 'Cancel')}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#642FCD] text-[#FFFFFF] text-sm font-semibold hover:bg-[#642FCD]/80 border border-[#642FCD]"
                >
                  {tx(strings, 'Save Staff Member')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
