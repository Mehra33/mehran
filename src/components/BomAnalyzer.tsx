import React, { useState } from 'react';
import { 
  FileSpreadsheet, Upload, CheckCircle2, AlertTriangle, 
  HelpCircle, ArrowRight, ShoppingCart, FileText, 
  Sparkles, RefreshCw, Layers, ShieldCheck, Download, Trash2
} from 'lucide-react';
import { ElectronicComponent, BuyerRole, BomItem } from '../types';
import { BUYER_ROLES } from '../data/componentsData';

interface BomAnalyzerProps {
  components: ElectronicComponent[];
  currentRole: BuyerRole;
  onAddMultipleToCart: (items: { product: ElectronicComponent; qty: number; packaging: string }[]) => void;
  onGenerateInvoiceFromBom: (bomItems: BomItem[]) => void;
  onOpenAdvisorWithQuery: (q: string) => void;
}

const SAMPLE_BOM_PRESETS = [
  {
    name: 'برد کنترلر صنعتی با اینترنت اشیاء (Industrial IoT Controller PCB)',
    text: `STM32F103C8T6, 50, U1, LQFP-48
ESP32-WROOM-32E-N4, 50, U2, SMD-38
AMS1117-3.3, 100, U3, SOT-223
LM2596S-5.0, 50, U4, TO-263
RC0603FR-0710KL, 2500, R1-R20, 0603
CC0805KRX7R9BB104, 2000, C1-C15, 0805
G5Q-14-EU-12VDC, 50, K1, DIP-5`,
  },
  {
    name: 'منبع تغذیه سوئیچینگ ۵ ولت ۳ آمپر (5V 3A SMPS Converter)',
    text: `LM2596S-5.0, 200, U1, TO-263
AMS1117-3.3, 200, U2, SOT-223
CC0805KRX7R9BB104, 1000, C1-C5, 0805
RC0603FR-0710KL, 1000, R1-R4, 0603`,
  },
  {
    name: 'ردیاب خودرو و دیتالاگر 4G با GPS (4G Telemetry & GPS Tracker)',
    text: `EC200U-EU, 100, M1, LCC-144
STM32F103C8T6, 100, U1, LQFP-48
CH340C, 100, U2, SOP-16
AMS1117-3.3, 300, U3, SOT-223
RC0603FR-0710KL, 5000, R1-R30, 0603
CC0805KRX7R9BB104, 4000, C1-C25, 0805`,
  },
];

export const BomAnalyzer: React.FC<BomAnalyzerProps> = ({
  components,
  currentRole,
  onAddMultipleToCart,
  onGenerateInvoiceFromBom,
  onOpenAdvisorWithQuery,
}) => {
  const [rawBomText, setRawBomText] = useState<string>(SAMPLE_BOM_PRESETS[0].text);
  const [parsedBom, setParsedBom] = useState<BomItem[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  // Automated parsing and catalog matcher
  const handleAnalyzeBom = (customText?: string) => {
    const textToAnalyze = customText || rawBomText;
    const lines = textToAnalyze.trim().split('\n');
    const items: BomItem[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

      // support comma, tab, or semicolon separation
      const parts = trimmed.split(/[,;\t]+/).map((s) => s.trim());
      const partNumberRaw = parts[0] || '';
      const quantityRaw = parseInt(parts[1]) || 1;
      const designatorsRaw = parts[2] || '';
      const footprintRaw = parts[3] || '';

      // Match against local database
      let matchedComp: ElectronicComponent | undefined = components.find(
        (c) => c.partNumber.toLowerCase() === partNumberRaw.toLowerCase()
      );

      // fuzzy match if exact match fails
      if (!matchedComp) {
        matchedComp = components.find(
          (c) =>
            c.partNumber.toLowerCase().includes(partNumberRaw.toLowerCase()) ||
            partNumberRaw.toLowerCase().includes(c.partNumber.toLowerCase())
        );
      }

      // Find alternative if not found or if alternative exists
      let altComp: ElectronicComponent | undefined;
      if (matchedComp && matchedComp.alternatives && matchedComp.alternatives.length > 0) {
        altComp = components.find((c) =>
          matchedComp!.alternatives?.includes(c.partNumber)
        );
      }

      let matchStatus: BomItem['matchStatus'] = 'not_found';
      let unitPrice = 0;

      if (matchedComp) {
        matchStatus = 'exact';
        // compute price tier
        let bestTier = matchedComp.pricingTiers[0];
        for (let i = matchedComp.pricingTiers.length - 1; i >= 0; i--) {
          if (quantityRaw >= matchedComp.pricingTiers[i].minQty) {
            bestTier = matchedComp.pricingTiers[i];
            break;
          }
        }
        unitPrice = Math.round(bestTier.priceToman * (1 - roleInfo.discountPercentage / 100));
      } else {
        matchStatus = 'shenzhen_import';
        unitPrice = 75000; // estimated import unit price placeholder
      }

      items.push({
        id: `bom-${index}-${partNumberRaw}`,
        rawInput: line,
        partNumber: partNumberRaw,
        quantity: quantityRaw,
        designators: designatorsRaw,
        packageFootprint: footprintRaw || matchedComp?.packageFootprint,
        matchedProduct: matchedComp,
        alternativeProduct: altComp,
        matchStatus,
        unitPriceToman: unitPrice,
        totalPriceToman: unitPrice * quantityRaw,
        selected: true,
      });
    });

    setParsedBom(items);
    setHasAnalyzed(true);
  };

  const handleSelectPreset = (preset: typeof SAMPLE_BOM_PRESETS[0]) => {
    setRawBomText(preset.text);
    handleAnalyzeBom(preset.text);
  };

  const toggleItemSelection = (id: string) => {
    setParsedBom((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const selectedItems = parsedBom.filter((item) => item.selected);
  const totalBomCost = selectedItems.reduce((acc, item) => acc + item.totalPriceToman, 0);
  const totalBomQuantity = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  const matchedCount = parsedBom.filter((i) => i.matchStatus === 'exact').length;

  const handleAddAllMatchedToCart = () => {
    const toAdd = selectedItems
      .filter((i) => i.matchedProduct)
      .map((i) => ({
        product: i.matchedProduct!,
        qty: i.quantity,
        packaging: i.quantity >= (i.matchedProduct!.reelQuantity || 99999) ? 'reel' : 'cut_tape',
      }));

    if (toAdd.length > 0) {
      onAddMultipleToCart(toAdd);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top B2B Header for BOM Tool */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>موتور هوشمند استعلام لیست قطعات (BOM Instant Quoter)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              استعلام و قیمت‌گذاری آنی لیست قطعات بردهای الکترونیکی
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              فایل خروجی آلتیوم دیزاینر (Altium Designer)، ایگل (Eagle) یا اکسل لیست قطعات خود را وارد کنید تا وضعیت موجودی انبار تهران، نرخ‌های پلکانی قرقره و پیش‌فاکتور رسمی صادر گردد.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-left bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
              <span className="text-[10px] text-slate-500 block">سطح تخفیف اعمال شده:</span>
              <span className="text-xs font-bold text-slate-800">
                {roleInfo.titleFa} ({roleInfo.discountPercentage}٪ کسر B2B)
              </span>
            </div>
          </div>
        </div>

        {/* Presets Quick Selector */}
        <div className="pt-4">
          <div className="text-xs font-bold text-slate-700 mb-2">
            نمونه بردهای آماده جهت تست سریع موتور استعلام:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_BOM_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent text-slate-700 text-xs px-3 py-1.5 rounded-xl font-medium transition-all text-right"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input / Editor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: BOM Text Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>متن لیست قطعات (PartNumber, Quantity, Designator, Package)</span>
                </label>
                <button
                  onClick={() => setRawBomText('')}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  پاکسازی
                </button>
              </div>

              <textarea
                rows={12}
                value={rawBomText}
                onChange={(e) => setRawBomText(e.target.value)}
                placeholder="مثال:
STM32F103C8T6, 100, U1, LQFP-48
ESP32-WROOM-32E-N4, 50, U2, SMD-38
AMS1117-3.3, 200, U3, SOT-223
RC0603FR-0710KL, 5000, R1-R20, 0603"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
              />

              <div className="mt-2 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                💡 <strong>فرمت استاندارد:</strong> هر سطر شامل نام قطعه، تعداد، نام موقعیت روی برد (Designator) و پکیج است که با ویرگول (,) از هم جدا شده‌اند.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center gap-3">
              <button
                onClick={() => handleAnalyzeBom()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>تحلیل آنی موجودی و محاسبه قیمت</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parsed Results & Price Matrix */}
        <div className="lg:col-span-7 space-y-4">
          {!hasAnalyzed ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
              <FileSpreadsheet className="w-14 h-14 text-indigo-200 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                لیست قطعات خود را وارد نموده و دکمه تحلیل را بزنید
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                سیستم به صورت هوشمند پارت‌نامبرها را با انبار مرکزی دایا و انبارهای شنژن چین تطبیق داده و بهترین نرخ قرقره و تخفیف تیراژ را محاسبه می‌کند.
              </p>
              <button
                onClick={() => handleAnalyzeBom()}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                اجرای نمونه پیش‌فرض
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
              {/* Summary Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 text-xs">
                <div>
                  <span className="text-[11px] text-indigo-700 block">تعداد ردیف قطعات:</span>
                  <span className="text-base font-black text-indigo-950 font-mono">
                    {parsedBom.length.toLocaleString('fa-IR')} ردیف
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-emerald-700 block">انطباق ۱۰۰٪ با انبار دایا:</span>
                  <span className="text-base font-black text-emerald-800 font-mono">
                    {matchedCount} از {parsedBom.length}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-600 block">مجموع کل قطعات:</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {totalBomQuantity.toLocaleString('fa-IR')} عدد
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-rose-700 block">جمع کل برآورد BOM:</span>
                  <span className="text-base font-black text-rose-700 font-mono">
                    {totalBomCost.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-96 overflow-y-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 sticky top-0 z-10 text-[11px] font-bold">
                    <tr>
                      <th className="p-3">انتخاب</th>
                      <th className="p-3">نام قطعه (Part Number)</th>
                      <th className="p-3">تعداد</th>
                      <th className="p-3">وضعیت تامین</th>
                      <th className="p-3">قیمت واحد</th>
                      <th className="p-3">جمع ردیف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedBom.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          !item.selected ? 'opacity-40' : ''
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                        </td>
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900">{item.partNumber}</div>
                          {item.designators && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              موقعیت: {item.designators}
                            </div>
                          )}
                          {item.packageFootprint && (
                            <div className="text-[10px] text-indigo-600 font-mono">
                              فوت‌پرینت: {item.packageFootprint}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-800">
                          {item.quantity.toLocaleString('fa-IR')}
                        </td>
                        <td className="p-3">
                          {item.matchStatus === 'exact' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              موجود انبار تهران
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                <AlertTriangle className="w-3 h-3" />
                                تامین شنژن چین
                              </span>
                              <button
                                onClick={() =>
                                  onOpenAdvisorWithQuery(
                                    `لطفا قطعه جایگزین و سازگار با پارت نامبر ${item.partNumber} را برای تیراژ ${item.quantity} عدد پیشنهاد دهید.`
                                  )
                                }
                                className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                مشاوره معادل پین‌به‌پین
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-700">
                          {item.unitPriceToman.toLocaleString('fa-IR')} ت
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {item.totalPriceToman.toLocaleString('fa-IR')} ت
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons for BOM */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddAllMatchedToCart}
                    className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن کلیه قطعات موجود به سبد خرید ({matchedCount} قلم)</span>
                  </button>

                  <button
                    onClick={() => onGenerateInvoiceFromBom(selectedItems)}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>صدور پیش‌فاکتور رسمی این BOM</span>
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">جمع قابل پرداخت BOM:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {totalBomCost.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
