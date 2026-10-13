import React, { useState } from 'react';
import { 
  Boxes, 
  Plus, 
  Search, 
  Edit3, 
  MapPin, 
  CheckCircle2, 
  Wrench, 
  X, 
  Save 
} from 'lucide-react';
import { translate as tx } from '../translations';

export default function InventoryView({ inventory = [], onAddInventoryItem, onUpdateInventoryItem, events = [], strings = {} }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Furniture',
    totalQty: 100,
    rate: 10,
    status: 'godown',
    location: ''
  });

  const inventoryList = inventory.length > 0 ? inventory : [
    { id: 'i1', category: 'Furniture', name: 'VIP Banquet Chair (Red)', totalQty: 500, rate: 15, status: 'godown', location: 'Main Godown, Racks A-4' },
    { id: 'i2', category: 'Structures', name: 'Waterproof German Hangar', totalQty: 10, rate: 2500, status: 'outside', location: 'Palace Ground, Sultanpur (Gupta Wedding)' },
    { id: 'i3', category: 'Catering', name: 'Round Dining Table with Linen', totalQty: 80, rate: 120, status: 'outside', location: 'Community Hall, Sultanpur (Verma Ring Ceremony)' },
    { id: 'i4', category: 'Lighting', name: 'Halogen Floodlights Setup', totalQty: 25, rate: 300, status: 'repairing', location: 'Repair Shop' }
  ];

  const categories = ['All', 'Furniture', 'Structures', 'Catering', 'Lighting', 'Decoration', 'Sound & Audio'];

  const getItemLocationInfo = (item) => {
    if (item.location && item.location.trim() !== '') {
      return item.location;
    }
    const activeEvent = events.find(e => 
      e.requirements?.some(req => req.itemId === item.id || req.name?.toLowerCase() === item.name?.toLowerCase())
    );
    if (activeEvent) {
      return `${activeEvent.venue} (${activeEvent.name})`;
    }
    return item.status === 'outside' ? 'Deployed at Active Venue Site' : 'In Central Warehouse / Godown';
  };

  const filteredItems = inventoryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const itemToAdd = {
      id: `i_${Date.now()}`,
      ...newItem,
      totalQty: Number(newItem.totalQty),
      rate: Number(newItem.rate)
    };
    if (onAddInventoryItem) onAddInventoryItem(itemToAdd);
    setIsAddModalOpen(false);
    setNewItem({ name: '', category: 'Furniture', totalQty: 100, rate: 10, status: 'godown', location: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    if (onUpdateInventoryItem) onUpdateInventoryItem(editingItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 transition-colors">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold border border-[#642FCD]/30 mb-2">
            <Boxes size={14} /> {tx(strings, 'Warehouse Stock Management')}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Inventory & Equipment Stock')}</h3>
          <p className="text-sm text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
            {tx(strings, 'Track gear quantities, rental rates, godown storage, and live venue deployment locations.')}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#642FCD] text-[#FFFFFF] font-semibold hover:bg-[#642FCD]/80 transition shadow-lg shadow-[#642FCD]/20 flex items-center gap-2 text-sm border border-[#642FCD]"
        >
          <Plus size={16} /> {tx(strings, 'Add Inventory Item')}
        </button>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-[#000000] p-4 rounded-2xl border border-slate-200 dark:border-[#642FCD]/30 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                categoryFilter === cat
                  ? 'bg-[#642FCD]/10 dark:bg-[#642FCD]/30 text-[#642FCD] dark:text-[#DCCCF7] border-[#642FCD]'
                  : 'bg-slate-50 dark:bg-[#000000] text-slate-600 dark:text-[#DCCCF7]/70 border-slate-200 dark:border-[#642FCD]/20 hover:text-slate-900 dark:hover:text-[#FFFFFF]'
              }`}
            >
              {tx(strings, cat)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-xs text-slate-700 dark:text-[#DCCCF7] focus:outline-none focus:border-[#642FCD]"
          >
            <option value="All" className="bg-white dark:bg-[#000000]">{tx(strings, 'All Locations')}</option>
            <option value="godown" className="bg-white dark:bg-[#000000]">{tx(strings, 'In Godown')}</option>
            <option value="outside" className="bg-white dark:bg-[#000000]">{tx(strings, 'Outside (At Venue)')}</option>
            <option value="repairing" className="bg-white dark:bg-[#000000]">{tx(strings, 'Under Repair')}</option>
          </select>

          <div className="relative w-full sm:w-60">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#DCCCF7]/60" />
            <input 
              type="text"
              placeholder={tx(strings, 'Search gear or items...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-slate-900 dark:text-[#FFFFFF] text-xs focus:outline-none focus:border-[#642FCD]"
            />
          </div>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const locationText = getItemLocationInfo(item);

          return (
            <div 
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 backdrop-blur-xl hover:border-[#642FCD] transition flex flex-col justify-between space-y-4 shadow-lg relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-[#642FCD] dark:text-[#DCCCF7] uppercase tracking-wider bg-[#642FCD]/10 dark:bg-[#642FCD]/20 px-2.5 py-0.5 rounded-full border border-[#642FCD]/30">
                    {item.category}
                  </span>
                  
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${
                    item.status === 'godown' 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-[#642FCD]/20 dark:text-[#DCCCF7] border-emerald-500/20 dark:border-[#642FCD]/40'
                      : item.status === 'outside'
                        ? 'bg-blue-500/10 text-blue-600 dark:bg-[#8D2E6E]/30 dark:text-[#DCCCF7] border-blue-500/20 dark:border-[#8D2E6E]/50 animate-pulse'
                        : 'bg-rose-500/10 text-rose-600 dark:bg-[#8D2E6E]/20 dark:text-[#FFFFFF] border-rose-500/20 dark:border-[#8D2E6E]/40'
                  }`}>
                    {item.status === 'godown' && <CheckCircle2 size={12} />}
                    {item.status === 'outside' && <MapPin size={12} />}
                    {item.status === 'repairing' && <Wrench size={12} />}
                    {tx(strings, item.status === 'godown' ? 'In Godown' : item.status === 'outside' ? 'At Venue' : 'Under Repair')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-[#FFFFFF] text-base mt-2">{item.name}</h4>
                <p className="text-xs text-slate-500 dark:text-[#DCCCF7]/80 mt-1">
                  Daily Rental Rate: <span className="font-semibold text-slate-900 dark:text-[#FFFFFF]">₹ {item.rate} / unit</span>
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-[#DCCCF7]/70">{tx(strings, 'Total Stock Quantity:')}</span>
                  <span className="font-bold text-slate-900 dark:text-[#FFFFFF] text-sm">{item.totalQty} {tx(strings, 'Units')}</span>
                </div>

                <div className="mt-3 p-3 rounded-2xl border text-xs flex items-start gap-2.5 bg-slate-50 dark:bg-[#000000] border-slate-200 dark:border-[#642FCD]/30">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5 text-[#642FCD]" />
                  <div>
                    <span className="font-semibold block text-[11px] uppercase tracking-wide text-slate-500 dark:text-[#DCCCF7]">
                      {tx(strings, item.status === 'outside' ? 'Current Venue Location:' : 'Storage Location:')}
                    </span>
                    <span className="font-medium text-xs mt-0.5 block text-slate-900 dark:text-[#FFFFFF]">{locationText}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#642FCD]/20">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="w-full py-2 px-4 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 text-[#642FCD] dark:text-[#DCCCF7] text-xs font-semibold hover:bg-[#642FCD]/20 dark:hover:bg-[#642FCD]/30 transition flex items-center justify-center gap-2 border border-[#642FCD]/30"
                >
                  <Edit3 size={14} /> {tx(strings, 'Edit Item Details & Location')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#000000]/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD] rounded-3xl shadow-2xl p-6 space-y-6 text-slate-900 dark:text-[#FFFFFF]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#642FCD]/30 pb-4">
              <h4 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF] flex items-center gap-2">
                <Edit3 size={18} className="text-[#642FCD]" /> {tx(strings, 'Edit Inventory Item')}
              </h4>
              <button onClick={() => setEditingItem(null)} className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 text-slate-500 dark:text-[#DCCCF7] hover:text-slate-900 dark:hover:text-[#FFFFFF]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Item / Equipment Name *')}</label>
                <input 
                  type="text" 
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Category *')}</label>
                  <select 
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c} className="bg-white dark:bg-[#000000]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Total Stock Quantity *')}</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={editingItem.totalQty}
                    onChange={(e) => setEditingItem({ ...editingItem, totalQty: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Daily Rental Rate (₹) *')}</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={editingItem.rate}
                    onChange={(e) => setEditingItem({ ...editingItem, rate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Stock Status *')}</label>
                  <select 
                    value={editingItem.status}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  >
                    <option value="godown" className="bg-white dark:bg-[#000000]">{tx(strings, 'In Godown')}</option>
                    <option value="outside" className="bg-white dark:bg-[#000000]">{tx(strings, 'Outside (At Venue)')}</option>
                    <option value="repairing" className="bg-white dark:bg-[#000000]">{tx(strings, 'Under Repair')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Location / Venue Details')}</label>
                <input 
                  type="text" 
                  value={editingItem.location || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#642FCD]/30">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/30 text-slate-700 dark:text-[#DCCCF7] text-sm font-semibold hover:bg-slate-200 dark:hover:bg-[#642FCD]/20 transition"
                >
                  {tx(strings, 'Cancel')}
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#642FCD] text-[#FFFFFF] text-sm font-semibold hover:bg-[#642FCD]/80 transition flex items-center gap-2 shadow-lg shadow-[#642FCD]/20 border border-[#642FCD]"
                >
                  <Save size={16} /> {tx(strings, 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-[#000000]/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD] rounded-3xl shadow-2xl p-6 space-y-6 text-slate-900 dark:text-[#FFFFFF]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#642FCD]/30 pb-4">
              <h4 className="font-bold text-lg text-slate-900 dark:text-[#FFFFFF]">{tx(strings, 'Add New Gear / Inventory')}</h4>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 text-slate-500 dark:text-[#DCCCF7]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Item Name *')}</label>
                <input 
                  type="text" 
                  required
                  placeholder={tx(strings, 'e.g. VIP Banquet Chair')}
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Category *')}</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c} className="bg-white dark:bg-[#000000]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Quantity *')}</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={newItem.totalQty}
                    onChange={(e) => setNewItem({ ...newItem, totalQty: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Rate (₹) *')}</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={newItem.rate}
                    onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-[#DCCCF7] mb-1">{tx(strings, 'Status *')}</label>
                  <select 
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#642FCD]/40 text-slate-900 dark:text-[#FFFFFF] text-sm focus:outline-none focus:border-[#642FCD]"
                  >
                    <option value="godown" className="bg-white dark:bg-[#000000]">{tx(strings, 'In Godown')}</option>
                    <option value="outside" className="bg-white dark:bg-[#000000]">{tx(strings, 'Outside')}</option>
                    <option value="repairing" className="bg-white dark:bg-[#000000]">{tx(strings, 'Repair')}</option>
                  </select>
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
                  {tx(strings, 'Save Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
