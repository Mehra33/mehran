import React, { useState, useMemo } from 'react';
import { 
  X, Check, ShieldCheck, Download, ExternalLink, 
  Layers, Package, Sparkles, MapPin, Globe, ArrowRight,
  TrendingDown, CheckCircle2, Cpu
} from 'lucide-react';
import { ElectronicComponent, BuyerRole, PackagingType } from '../types';
import { BUYER_ROLES } from '../data/componentsData';

interface ProductModalProps {
  component: ElectronicComponent | null;
  onClose: () => void;
  currentRole: BuyerRole;
  onAddToCart: (component: ElectronicComponent, qty: number, pkg: PackagingType) => void;
  onOpenAdvisorWithPart: (partNumber: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  component,
  onClose,
  currentRole,
  onAddToCart,
  onOpenAdvisorWithPart,
}) => {
  if (!component) return null;

  const [selectedQty, setSelectedQty] = useState<number>(component.moq || 1);
  const [selectedPkg, setSelectedPkg] = useState<PackagingType>(component.packagingTypes[0]);

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  const matchedTier = useMemo(() => {
    for (let i = component.pricingTiers.length - 1; i >= 0; i--) {
      const tier = component.pricingTiers[i];
      if (selectedQty >= tier.minQty) {
        return tier;
      }
    }
    return component.pricingTiers[0];
  }, [component, selectedQty]);

  const finalUnitPrice = Math.round(matchedTier.priceToman * (1 - roleInfo.discountPercentage / 100));
  const totalPrice = finalUnitPrice * selectedQty;
  const singlePrice = component.pricingTiers[0].priceToman;
  const totalSavings = (singlePrice - finalUnitPrice) * selectedQty;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl max-w-4xl w-full shadow-2xl border border-gray-200 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs bg-gray-900 text-white px-2.5 py-1 rounded">
              {component.manufacturer}
            </span>
            <span className="text-xs font-mono text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded">
              {component.packageFootprint}
            </span>
            {component.isOriginal && (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                تاییدیه اصالت اورجینال
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800">
          {/* Main Hero & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-full aspect-square max-w-[280px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-2">
                <img
                  src={component.image}
                  alt={component.partNumber}
                  className="w-full h-full object-cover rounded"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Datasheet & AI advisor buttons */}
              <div className="w-full mt-3 space-y-2">
                {component.datasheetUrl && (
                  <a
                    href={component.datasheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-600" />
                    <span>دانلود مستقیم دیتاشیت (PDF Datasheet)</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenAdvisorWithPart(component.partNumber);
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>مشاوره پین‌به‌پین و معادل‌های این قطعه</span>
                </button>
              </div>
            </div>

            {/* Product Details & Title */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h1 className="font-mono text-xl sm:text-2xl font-black text-gray-900">
                  {component.partNumber}
                </h1>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {component.titleFa}
                </p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  {component.descriptionFa}
                </p>
              </div>

              {/* Stock breakdown */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 text-[11px] block">موجودی انبار تهران:</span>
                  <span className="font-mono font-bold text-green-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {component.stockTehran.toLocaleString('fa-IR')} عدد (ارسال ۲ ساعته)
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[11px] block">انبار شنژن چین:</span>
                  <span className="font-mono font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                    <Globe className="w-3.5 h-3.5" />
                    {component.stockShenzhen.toLocaleString('fa-IR')} عدد (هوایی ۱۲ روزه)
                  </span>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <div className="bg-gray-100 px-3 py-2 font-bold text-gray-700 text-[11px]">
                  مشخصات فنی و پارامتریک (Technical Specs)
                </div>
                <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {Object.entries(component.specs).map(([specKey, specVal]) => (
                    <div key={specKey} className="grid grid-cols-2 px-3 py-1.5 text-[11px]">
                      <span className="text-gray-500 font-en">{specKey}</span>
                      <span className="font-mono font-semibold text-gray-900 text-left" dir="ltr">
                        {specVal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tiered Volume Pricing Matrix */}
          <div className="border border-gray-200 rounded-xl p-4 sm:p-5 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-red-600" />
                <span>جدول تخفیف‌های پلکانی تیراژ و قرقره کامل</span>
              </div>
              <span className="text-[11px] text-gray-500">
                سطح شما: <strong className="text-red-600">{roleInfo.titleFa}</strong> ({roleInfo.discountPercentage}٪ کسر B2B)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              {component.pricingTiers.map((tier, idx) => {
                const discountedUnitPrice = Math.round(tier.priceToman * (1 - roleInfo.discountPercentage / 100));
                const isSelected = selectedQty >= tier.minQty && (tier.maxQty === null || selectedQty <= tier.maxQty);
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedQty(tier.minQty)}
                    className={`rounded-lg p-2.5 cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 shadow-xs ring-1 ring-red-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-gray-700 mb-1">{tier.labelFa}</div>
                    <div className="font-mono font-black text-xs text-gray-900">
                      {discountedUnitPrice.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[10px] text-gray-400">تومان / عدد</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pin Compatible Alternatives */}
          {component.alternatives && component.alternatives.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs">
              <div className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>پارت‌نامبرهای معادل و جایگزین پین‌به‌پین (Drop-in Replacements):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {component.alternatives.map((alt) => (
                  <button
                    key={alt}
                    onClick={() => {
                      onClose();
                      onOpenAdvisorWithPart(alt);
                    }}
                    className="bg-white border border-amber-300 text-amber-900 font-mono text-xs px-3 py-1 rounded-md font-bold hover:bg-amber-100 transition-colors"
                  >
                    {alt} (استعلام موجودی)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Strip */}
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-gray-500 block">مبلغ سفارش شما:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-black text-gray-900">
                {totalPrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs text-gray-500">تومان</span>
              {totalSavings > 0 && (
                <span className="text-[11px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded mr-2">
                  {totalSavings.toLocaleString('fa-IR')} ت تخفیف
                </span>
              )}
            </div>
          </div>

          {/* Stepper and Add to Cart */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-md bg-white p-1">
              <button
                onClick={() => setSelectedQty((prev) => Math.max(component.moq || 1, prev - 10))}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded text-sm font-bold"
              >
                -
              </button>
              <input
                type="number"
                min={component.moq || 1}
                value={selectedQty}
                onChange={(e) => setSelectedQty(Math.max(component.moq || 1, parseInt(e.target.value) || 1))}
                className="w-16 text-center text-xs font-mono font-bold outline-none text-gray-900"
              />
              <button
                onClick={() => setSelectedQty((prev) => prev + 10)}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded text-sm font-bold"
              >
                +
              </button>
            </div>

            {component.reelQuantity && (
              <button
                onClick={() => {
                  setSelectedQty(component.reelQuantity!);
                  setSelectedPkg('reel');
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2.5 rounded-md text-xs font-bold"
              >
                ۱ ریل ({component.reelQuantity})
              </button>
            )}

            <button
              onClick={() => {
                onAddToCart(component, selectedQty, selectedPkg);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-md text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>افزودن به سبد خرید دایا</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
