import React, { useState } from 'react';
import { 
  Search, ShoppingCart, FileText, Cpu, ShieldCheck, 
  MapPin, PhoneCall, ChevronDown, Check, Building2, User, 
  Sparkles, Layers, SlidersHorizontal, BookOpen, Truck
} from 'lucide-react';
import { BuyerRole, BuyerRoleInfo, CartItem } from '../types';
import { BUYER_ROLES, CATEGORIES } from '../data/componentsData';

interface HeaderProps {
  currentRole: BuyerRole;
  onRoleChange: (role: BuyerRole) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategorySelect: (catId: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenBom: () => void;
  onOpenAdvisor: () => void;
  onOpenPlatformGuide: () => void;
  onOpenInvoice: () => void;
  activeTab: 'catalog' | 'bom' | 'platforms' | 'invoice';
  setActiveTab: (tab: 'catalog' | 'bom' | 'platforms' | 'invoice') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  cartItems,
  onOpenCart,
  onOpenBom,
  onOpenAdvisor,
  onOpenPlatformGuide,
  onOpenInvoice,
  activeTab,
  setActiveTab,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const activeRoleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top B2B Announcement Strip */}
      <div className="bg-gray-900 text-gray-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-red-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              تخفیف ویژه ریل کامل قطعات پسیو و میکروکنترلرها در دایا الکترونیک
            </span>
            <span className="hidden md:inline text-gray-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-300">
              <Truck className="w-3.5 h-3.5 text-green-500" />
              ارسال مستقیم انبار تهران (تحویل ۲ ساعته) + سفارش مستقیم شنژن چین
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-300 text-xs">
            <button 
              onClick={onOpenPlatformGuide}
              className="flex items-center gap-1 hover:text-white transition-colors text-amber-400 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              تحلیل پلتفرم‌ها (وردپرس vs هدلس)
            </button>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-1.5 text-gray-400">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              <span className="font-mono">۰۲۱-۶۶۷۵xxxx</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sleek Interface Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 lg:gap-8">
          {/* Logo & Brand (Matching Sleek Interface Red Square Emblem) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('catalog'); onCategorySelect('all'); }} 
              className="flex items-center gap-2.5 text-right group"
            >
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-red-700 transition-colors">
                D
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-red-600 tracking-tighter font-en">DAYA</span>
                  <span className="text-sm font-bold text-gray-900">دایا الکترونیک</span>
                </div>
                <span className="text-[10px] text-gray-400 font-en tracking-wider font-semibold block uppercase">WHOLESALE ELECTRONICS</span>
              </div>
            </button>
          </div>

          {/* Search Input Bar (Sleek Interface style) */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجوی پارت‌نامبر، میکروکنترلر، پکیج (مثلاً STM32F103, ESP32, SMD 0805, AMS1117)..."
                className="w-full bg-gray-100 hover:bg-gray-100/90 focus:bg-white border-none rounded-md py-2.5 pr-10 pl-24 text-sm focus:ring-2 focus:ring-red-500 outline-none text-gray-900 placeholder:text-gray-400 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />

              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-24 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 px-1.5"
                >
                  پاک کردن
                </button>
              )}
              <button 
                onClick={onOpenAdvisor}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-red-50 hover:bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors border border-red-200"
                title="مشاوره هوشمند جایگزین پین‌به‌پین و استعلام قطعه"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">مشاور AI</span>
              </button>
            </div>
          </div>

          {/* Buyer Role Switcher & Sleek Account Widget */}
          <div className="flex items-center gap-3">
            {/* Buyer Tier Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-3 text-right hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-col items-end">
                  <span className="font-bold text-gray-800 text-xs uppercase tracking-wide">B2B PORTAL</span>
                  <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {activeRoleInfo.titleFa} ({activeRoleInfo.discountPercentage}٪)
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 border border-gray-300 shadow-2xs">
                  <User className="w-5 h-5" />
                </div>
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsRoleDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">رتبه اعتباری خریدار B2B</div>
                      <div className="text-[11px] text-gray-500">قیمت‌های کاتالوگ بر اساس رتبه اعمال می‌شوند</div>
                    </div>
                    {BUYER_ROLES.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          onRoleChange(role.id);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-right p-2.5 rounded-lg text-xs flex items-start justify-between transition-colors mb-1 ${
                          currentRole === role.id ? 'bg-red-50 border border-red-200 text-red-900 font-bold' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{role.titleFa}</span>
                            {role.discountPercentage > 0 && (
                              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                {role.discountPercentage}٪ تخفیف
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500 font-normal mt-0.5 leading-relaxed">
                            {role.descriptionFa}
                          </p>
                        </div>
                        {currentRole === role.id && <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              {totalCartCount > 0 && (
                <span className="bg-white text-red-600 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount > 99 ? '+99' : totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Sleek Interface Tab Bar with Underline Active State) */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm font-medium text-gray-600 overflow-x-auto">
          <div className="flex items-center space-x-6 space-x-reverse">
            <button
              onClick={() => { setActiveTab('catalog'); onCategorySelect('all'); }}
              className={`py-3 transition-colors flex items-center gap-1.5 ${
                activeTab === 'catalog' && selectedCategory === 'all'
                  ? 'text-red-600 border-b-2 border-red-600 font-bold -mb-[1px]'
                  : 'hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>همه قطعات و کاتالوگ</span>
            </button>

            {CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveTab('catalog'); onCategorySelect(cat.id); }}
                className={`py-3 transition-colors hidden md:inline-flex items-center gap-1 ${
                  selectedCategory === cat.id && activeTab === 'catalog'
                    ? 'text-red-600 border-b-2 border-red-600 font-bold -mb-[1px]'
                    : 'hover:text-gray-900'
                }`}
              >
                {cat.nameFa}
              </button>
            ))}

            <button
              onClick={() => setActiveTab('bom')}
              className={`py-3 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bom'
                  ? 'text-red-600 border-b-2 border-red-600 font-bold -mb-[1px]'
                  : 'hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>استعلام و تحلیل BOM</span>
            </button>

            <button
              onClick={() => setActiveTab('invoice')}
              className={`py-3 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'invoice'
                  ? 'text-red-600 border-b-2 border-red-600 font-bold -mb-[1px]'
                  : 'hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>صدور پیش‌فاکتور رسمی</span>
            </button>
          </div>

          <div className="flex items-center py-2">
            <button
              onClick={() => setActiveTab('platforms')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'platforms'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              <span>تحلیل فنی معماری دایا</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
