import React, { useState, useMemo } from 'react';
import { 
  Filter, Check, ArrowUpDown, Cpu, ShieldCheck, 
  Layers, Package, ExternalLink, Sparkles, AlertCircle, 
  ChevronLeft, FileText, CheckCircle2, Globe, Clock
} from 'lucide-react';
import { ElectronicComponent, BuyerRole, PackagingType } from '../types';
import { BUYER_ROLES, CATEGORIES } from '../data/componentsData';

interface ProductCatalogProps {
  components: ElectronicComponent[];
  selectedCategory: string;
  onCategorySelect: (catId: string) => void;
  searchQuery: string;
  currentRole: BuyerRole;
  onSelectComponent: (component: ElectronicComponent) => void;
  onAddToCart: (component: ElectronicComponent, qty: number, pkg: PackagingType) => void;
  onOpenAdvisorWithPart: (partNumber: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  components,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  currentRole,
  onSelectComponent,
  onAddToCart,
  onOpenAdvisorWithPart,
}) => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');
  const [stockOnlyTehran, setStockOnlyTehran] = useState<boolean>(false);
  const [originalsOnly, setOriginalsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'stock' | 'discount'>('popular');

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  // Extract unique packages & manufacturers
  const allManufacturers = useMemo(() => {
    const set = new Set<string>();
    components.forEach((c) => set.add(c.manufacturer));
    return Array.from(set);
  }, [components]);

  const allPackages = useMemo(() => {
    const set = new Set<string>();
    components.forEach((c) => set.add(c.packageFootprint));
    return Array.from(set);
  }, [components]);

  // Filter components
  const filteredComponents = useMemo(() => {
    return components.filter((item) => {
      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Subcategory
      if (selectedSubCategory !== 'all' && item.subCategory !== selectedSubCategory) {
        return false;
      }
      // Manufacturer
      if (selectedManufacturer !== 'all' && item.manufacturer !== selectedManufacturer) {
        return false;
      }
      // Package
      if (selectedPackage !== 'all' && item.packageFootprint !== selectedPackage) {
        return false;
      }
      // Tehran stock
      if (stockOnlyTehran && item.stockTehran <= 0) {
        return false;
      }
      // Original
      if (originalsOnly && !item.isOriginal) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPart = item.partNumber.toLowerCase().includes(q);
        const matchTitle = item.titleFa.toLowerCase().includes(q);
        const matchMfr = item.manufacturer.toLowerCase().includes(q);
        const matchPkg = item.packageFootprint.toLowerCase().includes(q);
        const matchSpecs = Object.values(item.specs).some((v) => String(v).toLowerCase().includes(q));
        if (!matchPart && !matchTitle && !matchMfr && !matchPkg && !matchSpecs) {
          return false;
        }
      }
      return true;
    });
  }, [
    components,
    selectedCategory,
    selectedSubCategory,
    selectedManufacturer,
    selectedPackage,
    stockOnlyTehran,
    originalsOnly,
    searchQuery,
  ]);

  // Sort components
  const sortedComponents = useMemo(() => {
    const list = [...filteredComponents];
    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => a.pricingTiers[0].priceToman - b.pricingTiers[0].priceToman);
      case 'price_desc':
        return list.sort((a, b) => b.pricingTiers[0].priceToman - a.pricingTiers[0].priceToman);
      case 'stock':
        return list.sort((a, b) => b.stockTehran - a.stockTehran);
      case 'discount':
        return list.sort((a, b) => {
          const discountA = (a.pricingTiers[0].priceToman - a.pricingTiers[a.pricingTiers.length - 1].priceToman) / a.pricingTiers[0].priceToman;
          const discountB = (b.pricingTiers[0].priceToman - b.pricingTiers[b.pricingTiers.length - 1].priceToman) / b.pricingTiers[0].priceToman;
          return discountB - discountA;
        });
      default:
        return list;
    }
  }, [filteredComponents, sortBy]);

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Parametric Filter Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm sticky top-24 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900 text-xs uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-[#3e6b4e]" />
              <span>فیلترهای پارامتریک و مشخصات فنی</span>
            </div>
            {(selectedCategory !== 'all' ||
              selectedManufacturer !== 'all' ||
              selectedPackage !== 'all' ||
              stockOnlyTehran ||
              originalsOnly) && (
              <button
                onClick={() => {
                  onCategorySelect('all');
                  setSelectedSubCategory('all');
                  setSelectedManufacturer('all');
                  setSelectedPackage('all');
                  setStockOnlyTehran(false);
                  setOriginalsOnly(false);
                }}
                className="text-xs text-[#3e6b4e] hover:text-[#335840] font-medium"
              >
                پاکسازی
              </button>
            )}
          </div>

          {/* Quick Toggles */}
          <div className="space-y-3 pb-4 border-b border-gray-100">
            <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-gray-900">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                موجودی انبار تهران (تحویل فوری)
              </span>
              <input
                type="checkbox"
                checked={stockOnlyTehran}
                onChange={(e) => setStockOnlyTehran(e.target.checked)}
                className="rounded text-[#3e6b4e] focus:ring-[#3e6b4e] h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer hover:text-gray-900">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                قطعات اورجینال (Grade A Original)
              </span>
              <input
                type="checkbox"
                checked={originalsOnly}
                onChange={(e) => setOriginalsOnly(e.target.checked)}
                className="rounded text-[#3e6b4e] focus:ring-[#3e6b4e] h-4 w-4"
              />
            </label>
          </div>

          {/* Categories Filter */}
          <div className="pb-4 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
              دسته‌بندی اصلی (Category)
            </h4>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              <button
                onClick={() => {
                  onCategorySelect('all');
                  setSelectedSubCategory('all');
                }}
                className={`w-full text-right px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#edf5f0] text-[#2d523b] font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>همه قطعات و گروه‌ها</span>
                <span className="text-[10px] text-gray-400 font-mono">({components.length})</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = components.filter((c) => c.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategorySelect(cat.id);
                      setSelectedSubCategory('all');
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-[#edf5f0] text-[#2d523b] font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.nameFa}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategory Filter (if active category selected) */}
          {activeCategoryObj && (
            <div className="pb-4 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                زیردسته فنی
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`w-full text-right px-2.5 py-1 rounded-md text-xs transition-colors ${
                    selectedSubCategory === 'all'
                      ? 'bg-gray-100 text-gray-900 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  همه زیردسته‌ها
                </button>
                {activeCategoryObj.subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`w-full text-right px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedSubCategory === sub
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manufacturer Filter */}
          <div className="pb-4 border-b border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              سازنده (Manufacturer)
            </h4>
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3e6b4e] font-mono"
            >
              <option value="all">همه برندها (All Brands)</option>
              {allManufacturers.map((mfr) => (
                <option key={mfr} value={mfr}>
                  {mfr}
                </option>
              ))}
            </select>
          </div>

          {/* Package Footprint Filter */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              پکیج و فوت‌پرینت (Package / Case)
            </h4>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3e6b4e] font-mono"
            >
              <option value="all">همه پکیج‌ها (All Footprints)</option>
              {allPackages.map((pkg) => (
                <option key={pkg} value={pkg}>
                  {pkg}
                </option>
              ))}
            </select>
          </div>

          {/* Wholesale Manager Callout */}
          <div className="bg-[#edf5f0] rounded-lg p-4 border border-[#cbe0d2] text-right">
            <span className="text-xs font-bold text-[#3e6b4e] block mb-1 font-en uppercase tracking-wider">
              WHOLESALE MANAGER
            </span>
            <p className="text-[11px] text-[#2d523b] leading-relaxed">
              جهت سفارش‌های تیراژ کانتینری و استعلام واردات مستقیم از شنزن چین با واحد مهندسی دایا در تماس باشید.
            </p>
          </div>
        </div>
      </div>

      {/* Right Product Grid & Sorting Toolbar */}
      <div className="lg:col-span-3 space-y-4">
        {/* Sort & Results Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-semibold text-gray-900 font-mono">
              {sortedComponents.length.toLocaleString('fa-IR')}
            </span>
            <span>قلم قطعه الکترونیک منطبق</span>
            {searchQuery && (
              <span className="bg-[#edf5f0] text-[#2d523b] px-2 py-0.5 rounded font-mono">
                برای «{searchQuery}»
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              مرتب‌سازی:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'popular', label: 'پربازدیدترین' },
                { id: 'price_asc', label: 'ارزان‌ترین' },
                { id: 'price_desc', label: 'گران‌ترین' },
                { id: 'discount', label: 'بیشترین تخفیف ریل' },
                { id: 'stock', label: 'موجودی تهران' },
              ].map((sortItem) => (
                <button
                  key={sortItem.id}
                  onClick={() => setSortBy(sortItem.id as any)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                    sortBy === sortItem.id
                      ? 'bg-[#3e6b4e] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sortItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedComponents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <Cpu className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">هیچ قطعه‌ای با این فیلترها یافت نشد</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
              می‌توانید عبارت جستجو را تغییر دهید یا از مشاور هوش مصنوعی دایا برای یافتن پارت‌نامبرهای معادل و پین‌به‌پین کمک بگیرید.
            </p>
            <button
              onClick={() => onOpenAdvisorWithPart(searchQuery || 'قطعه ناموجود')}
              className="bg-[#3e6b4e] hover:bg-[#335840] text-white text-xs font-semibold px-4 py-2 rounded-md transition-all shadow-sm inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              استعلام معادل و واردات مستقیم شنژن با هوش مصنوعی
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedComponents.map((component) => (
              <ProductCard
                key={component.id}
                component={component}
                currentRole={currentRole}
                roleInfo={roleInfo}
                onSelect={() => onSelectComponent(component)}
                onAddToCart={(qty, pkg) => onAddToCart(component, qty, pkg)}
                onOpenAdvisor={() => onOpenAdvisorWithPart(component.partNumber)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  component: ElectronicComponent;
  currentRole: BuyerRole;
  roleInfo: any;
  onSelect: () => void;
  onAddToCart: (qty: number, pkg: PackagingType) => void;
  onOpenAdvisor: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  component,
  roleInfo,
  onSelect,
  onAddToCart,
  onOpenAdvisor,
}) => {
  const [selectedQty, setSelectedQty] = useState<number>(component.moq || 1);
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingType>(component.packagingTypes[0]);

  // Compute unit price based on qty & role discount
  const matchedTier = useMemo(() => {
    for (let i = component.pricingTiers.length - 1; i >= 0; i--) {
      const tier = component.pricingTiers[i];
      if (selectedQty >= tier.minQty) {
        return tier;
      }
    }
    return component.pricingTiers[0];
  }, [component, selectedQty]);

  const baseTierPrice = matchedTier.priceToman;
  const finalUnitPrice = Math.round(baseTierPrice * (1 - roleInfo.discountPercentage / 100));
  const totalItemPrice = finalUnitPrice * selectedQty;

  const baseSinglePrice = component.pricingTiers[0].priceToman;
  const savingsAmount = (baseSinglePrice - finalUnitPrice) * selectedQty;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-[#b6d3c0] hover:ring-1 hover:ring-[#b6d3c0] shadow-sm transition-all p-4 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded">
              {component.manufacturer}
            </span>
            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">
              {component.packageFootprint}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {component.isOriginal && (
              <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                اورجینال
              </span>
            )}
            {component.isFlashDeal && (
              <span className="text-[10px] font-bold text-[#2d523b] bg-[#edf5f0] border border-[#cbe0d2] px-1.5 py-0.5 rounded">
                شگفت‌انگیز
              </span>
            )}
          </div>
        </div>

        {/* Image & Title */}
        <div className="flex items-start gap-3 mb-3 cursor-pointer" onClick={onSelect}>
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
            <img
              src={component.image}
              alt={component.partNumber}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-black text-sm text-gray-900 group-hover:text-[#3e6b4e] transition-colors">
              {component.partNumber}
            </h3>
            <p className="text-xs text-gray-600 font-normal line-clamp-2 mt-1 leading-relaxed">
              {component.titleFa}
            </p>
          </div>
        </div>

        {/* Key Specs Pills */}
        <div className="grid grid-cols-2 gap-1.5 bg-gray-50 rounded-lg p-2 mb-3 text-[11px] text-gray-600 border border-gray-100">
          {Object.entries(component.specs).slice(0, 4).map(([key, val]) => (
            <div key={key} className="flex justify-between items-center truncate">
              <span className="text-gray-400 font-en">{key}:</span>
              <span className="font-mono font-medium text-gray-800 truncate mr-1">{val}</span>
            </div>
          ))}
        </div>

        {/* Stock & Delivery Location */}
        <div className="flex items-center justify-between text-xs mb-3 px-1">
          <div className="flex items-center gap-1 text-gray-600">
            <span className="text-green-600 font-bold font-mono">
              {component.stockTehran.toLocaleString('fa-IR')}
            </span>
            <span>عدد انبار تهران (فوری)</span>
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-[11px]">
            <Globe className="w-3 h-3 text-blue-500" />
            <span>شنژن: {component.stockShenzhen.toLocaleString('fa-IR')} عدد</span>
          </div>
        </div>

        {/* Tiered Price Table Preview */}
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 bg-gray-50/50">
          <div className="grid grid-cols-3 bg-gray-100 text-[10px] font-bold text-gray-600 p-1.5 text-center">
            <span>بازه تیراژ</span>
            <span>نوع بسته‌بندی</span>
            <span>قیمت هر عدد</span>
          </div>
          <div className="divide-y divide-gray-200 text-xs">
            {component.pricingTiers.slice(0, 3).map((tier, idx) => {
              const tierPriceWithRole = Math.round(tier.priceToman * (1 - roleInfo.discountPercentage / 100));
              const isSelected = selectedQty >= tier.minQty && (tier.maxQty === null || selectedQty <= tier.maxQty);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedQty(tier.minQty)}
                  className={`grid grid-cols-3 p-1.5 text-center cursor-pointer transition-colors text-[11px] ${
                    isSelected ? 'bg-[#edf5f0] text-[#223e2d] font-bold' : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="font-mono">{tier.labelFa}</span>
                  <span className="text-gray-500">
                    {idx === 0 ? 'Cut Tape' : idx === component.pricingTiers.length - 1 ? 'Full Reel' : 'سینی/تیوب'}
                  </span>
                  <span className="font-mono font-bold">
                    {tierPriceWithRole.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action and Quantity Area */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs">
            <span className="text-gray-500 text-[11px] block">مجموع بر اساس تعداد:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-gray-900 font-mono">
                {totalItemPrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-[10px] text-gray-500">تومان</span>
            </div>
          </div>

          {savingsAmount > 0 && (
            <div className="text-left">
              <span className="text-[10px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">
                {savingsAmount.toLocaleString('fa-IR')} ت تخفیف تیراژ
              </span>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-0.5">
            <button
              onClick={() => setSelectedQty((prev) => Math.max(component.moq || 1, prev - 10))}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-xs font-bold"
              title="-10 عدد"
            >
              -
            </button>
            <input
              type="number"
              min={component.moq || 1}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Math.max(component.moq || 1, parseInt(e.target.value) || 1))}
              className="w-14 text-center text-xs font-mono font-bold bg-transparent outline-none text-gray-900"
            />
            <button
              onClick={() => setSelectedQty((prev) => prev + 10)}
              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded text-xs font-bold"
              title="+10 عدد"
            >
              +
            </button>
          </div>

          {component.reelQuantity && (
            <button
              onClick={() => {
                setSelectedQty(component.reelQuantity!);
                setSelectedPackaging('reel');
              }}
              className="px-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold whitespace-nowrap"
              title="تنظیم تعداد روی قرقره کامل"
            >
              ۱ ریل ({component.reelQuantity})
            </button>
          )}

          <button
            onClick={() => onAddToCart(selectedQty, selectedPackaging)}
            className="flex-1 bg-[#3e6b4e] hover:bg-[#335840] active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
          >
            <Package className="w-3.5 h-3.5" />
            <span>افزودن به سبد</span>
          </button>
        </div>

        {/* Alternative recommendation helper */}
        {component.alternatives && component.alternatives.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">معادل‌های پین‌به‌پین:</span>
            <div className="flex items-center gap-1 font-mono text-gray-700">
              {component.alternatives.map((alt) => (
                <button
                  key={alt}
                  onClick={onOpenAdvisor}
                  className="bg-gray-100 hover:bg-[#edf5f0] hover:text-[#2d523b] px-1.5 py-0.5 rounded text-[10px] transition-colors"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
