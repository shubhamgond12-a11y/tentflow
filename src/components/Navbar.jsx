import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Globe, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ 
  businessProfile, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) {
  const { lang, toggleLanguage, strings } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name) => {
    if (!name) return "TF";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const businessName = businessProfile?.name || strings?.appName || "TentFlow";
  const logoInitials = getInitials(businessName);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#000000]/90 border-b border-slate-200 dark:border-[#642FCD]/30 px-4 lg:px-8 py-3 flex items-center justify-between flex-shrink-0 transition-colors">
      
      {/* Brand Logo & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 truncate">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 border border-slate-200 dark:border-[#642FCD]/30 text-[#642FCD] dark:text-[#DCCCF7] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition flex-shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-3 truncate">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#642FCD] to-[#8D2E6E] flex items-center justify-center font-bold text-[#FFFFFF] shadow-md shadow-[#642FCD]/20 flex-shrink-0">
            {logoInitials}
          </div>
          <div className="truncate">
            <h1 className="font-bold text-base sm:text-lg tracking-wide text-slate-900 dark:text-[#FFFFFF] capitalize truncate">
              {businessName}
            </h1>
            <p className="text-xs text-[#8D2E6E] dark:text-[#DCCCF7] hidden sm:block truncate opacity-90 font-medium">
              {strings?.tagline || "Tent House & Event SaaS"}
            </p>
          </div>
        </div>
      </div>

      {/* Controls: Theme Toggle & Bilingual Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#642FCD]/20 border border-slate-200 dark:border-[#642FCD]/30 text-[#642FCD] dark:text-[#DCCCF7] hover:bg-slate-200 dark:hover:bg-[#642FCD]/30 transition text-xs sm:text-sm font-semibold shadow-sm"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-[#DCCCF7]" />
          ) : (
            <Moon size={16} className="text-[#642FCD]" />
          )}
          <span className="hidden sm:inline">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>

        {/* Bilingual Language Switcher */}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#642FCD]/10 dark:bg-[#642FCD]/20 border border-[#642FCD]/30 text-[#642FCD] dark:text-[#DCCCF7] hover:bg-[#642FCD]/20 dark:hover:bg-[#642FCD]/30 transition text-xs sm:text-sm font-semibold shadow-sm"
          title="Switch Language / भाषा बदलें"
          aria-label="Switch Language"
        >
          <Globe size={16} />
          <span>{lang === 'en' ? 'अ (Hindi)' : 'A (English)'}</span>
        </button>

      </div>
    </header>
  );
}