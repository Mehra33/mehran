import React from 'react';
import { Flame, Clock, Sparkles, Percent, ArrowLeft, Package, CheckCircle2 } from 'lucide-react';
import { ElectronicComponent, BuyerRole } from '../types';
import { BUYER_ROLES } from '../data/componentsData';

interface IncredibleOffersProps {
  components: ElectronicComponent[];
  onSelectComponent: (component: ElectronicComponent) => void;
  currentRole: BuyerRole;
  onAddToCart: (component: ElectronicComponent, qty: number, pkg: string) => void;
}

export const IncredibleOffers: React.FC<IncredibleOffersProps> = ({
  components,
  onSelectComponent,
  currentRole,
  onAddToCart,
}) => {
  const flashDeals = components.filter((c) => c.isFlashDeal);
  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  if (flashDeals.length === 0) return null;

  return (
    <section className="bg-red-600 rounded-2xl p-4 sm:p-6 text-white shadow-md mb-8">
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left Sleek Badge Banner */}
        <div className="lg:w-64 shrink-0 flex flex-col justify-between text-center lg:text-right border-b lg:border-b-0 lg:border-l border-red-500/50 pb-4 lg:pb-0 lg:pl-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 tracking-wide">
              <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>فروش ویژه عمده و قرقره</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white mb-2 font-sans">
              پیشنهاد شگفت‌انگیز تیراژ و ریل
            </h2>
            <p className="text-xs text-red-100 leading-relaxed">
              تخفیف‌های استثنایی قطعات پرمصرف صنعتی با ضمانت اصالت فیزیکی و فاکتور رسمی
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-red-500/50">
            <div className="flex items-center justify-between text-xs text-red-100 mb-1">
              <span className="font-medium">زمان باقی‌مانده کمپین:</span>
              <div className="flex items-center gap-1 font-mono font-bold bg-black/40 px-2.5 py-1 rounded text-amber-300">
                <Clock className="w-3.5 h-3.5" />
                <span>18:42:15</span>
              </div>
            </div>
            <div className="text-[11px] text-red-200 mt-1">
              سطح شما: <strong className="text-white">{roleInfo.titleFa}</strong> ({roleInfo.discountPercentage}٪ کسر B2B)
            </div>
          </div>
        </div>

        {/* Grid of Flash Deal Components */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {flashDeals.map((comp) => {
            const baseUnitPrice = comp.pricingTiers[0].priceToman;
            const fullReelTier = comp.pricingTiers[comp.pricingTiers.length - 1];
            const discountedPrice = Math.round(
              fullReelTier.priceToman * (1 - roleInfo.discountPercentage / 100)
            );
            const totalPercentOff = Math.round(
              ((baseUnitPrice - discountedPrice) / baseUnitPrice) * 100
            );

            return (
              <div
                key={comp.id}
                className="bg-white rounded-xl p-4 text-gray-800 flex flex-col justify-between hover:shadow-md transition-all border border-gray-200 group"
              >
                <div>
                  {/* Top tags & Manufacturer */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {comp.manufacturer}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-0.5 shadow-2xs">
                      <Percent className="w-3 h-3" />
                      {totalPercentOff}٪ تخفیف ریل
                    </span>
                  </div>

                  {/* Product Image & Part Number */}
                  <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => onSelectComponent(comp)}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center">
                      <img
                        src={comp.image}
                        alt={comp.partNumber}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors truncate">
                        {comp.partNumber}
                      </div>
                      <div className="text-xs text-gray-500 font-normal line-clamp-1 mt-0.5">
                        {comp.titleFa}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        پکیج: {comp.packageFootprint}
                      </div>
                    </div>
                  </div>

                  {/* Stock & Reel Size info */}
                  <div className="bg-gray-50 rounded-lg p-2.5 mb-3 text-xs border border-gray-100 space-y-1">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>بسته‌بندی عمده:</span>
                      <strong className="text-gray-900 font-mono">
                        {comp.reelQuantity ? `${comp.reelQuantity.toLocaleString('fa-IR')} عدد / ریل` : 'بسته کارخانه‌ای'}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>موجودی تهران:</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {comp.stockTehran.toLocaleString('fa-IR')} عدد آماده ارسال
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-[11px] text-gray-400">قیمت تک‌فروشی:</span>
                    <span className="text-xs text-gray-400 line-through font-mono">
                      {baseUnitPrice.toLocaleString('fa-IR')} ت
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs font-semibold text-red-600">نرخ ریل کامل:</span>
                    <div className="text-right">
                      <span className="text-base font-black text-gray-900 font-mono">
                        {discountedPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[11px] text-gray-500 mr-1">تومان</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectComponent(comp)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>مشخصات فنی</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(comp, comp.reelQuantity || 100, 'reel')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>خرید ریل</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
