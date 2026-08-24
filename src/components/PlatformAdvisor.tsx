import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, TrendingUp, 
  Layers, Database, ShieldCheck, DollarSign, Clock, 
  Server, Smartphone, Zap, ArrowRight, ExternalLink, Award
} from 'lucide-react';
import { PLATFORM_EVALUATIONS } from '../data/componentsData';
import { PlatformEvaluation } from '../types';

export const PlatformAdvisor: React.FC = () => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('woocommerce_b2b');

  const selectedPlatform = PLATFORM_EVALUATIONS.find((p) => p.id === selectedPlatformId) || PLATFORM_EVALUATIONS[0];

  return (
    <div className="space-y-8">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>سند راهبردی و تحلیل فنی پلتفرم فروشگاه «دایا الکترونیک»</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            مقایسه جامع پلتفرم‌ها و قالب‌های دیجی‌کالایی برای عمده‌فروشی قطعات الکترونیک
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            تحلیل تخصصی چهار معماری اصلی برای دایا: از وردپرس و ووکامرس بومی (قالب‌های دیجی‌مارچ و وودمارت در ژاکت و راست‌چین) تا معماری‌های اختصاصی مدرن هدلس (Next.js / Python) و پلتفرم‌های انترپرایز B2B.
          </p>
        </div>
      </div>

      {/* Interactive Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLATFORM_EVALUATIONS.map((platform) => {
          const isSelected = platform.id === selectedPlatformId;
          return (
            <div
              key={platform.id}
              onClick={() => setSelectedPlatformId(platform.id)}
              className={`rounded-2xl p-5 cursor-pointer transition-all border text-right flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-rose-500 shadow-lg ring-2 ring-rose-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    TTM: {platform.ttmWeeks}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      انتخاب شده
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 mb-1 leading-snug">
                  {platform.nameFa}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                  {platform.bestFor}
                </p>

                {/* Ratings preview */}
                <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl text-xs mb-3 border border-slate-100">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">مقرون‌به‌صرفه بودن:</span>
                    <span className="font-bold font-mono text-slate-800">{platform.costRating} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">مقیاس‌پذیری و سرعت:</span>
                    <span className="font-bold font-mono text-slate-800">{platform.scalabilityRating} / 5</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">فیلتر پارامتریک قطعات:</span>
                    <span className="font-bold font-mono text-slate-800">{platform.parametricSearchRating} / 5</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-rose-600 flex items-center justify-end gap-1">
                <span>مشاهده جزئیات فنی و افزونه‌ها</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Platform Detailed Analysis */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
              بررسی عمیق معماری
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {selectedPlatform.nameFa}
            </h2>
            <div className="text-xs font-mono text-slate-500 mt-1">
              تکنولوژی‌ها: {selectedPlatform.techStack}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
            <div className="font-bold text-slate-800 mb-1">سازگاری با اکوسیستم وب ایران:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div className="flex items-center gap-1">
                {selectedPlatform.iranEcosystemSupport.zarinpalSaman ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>درگاه‌های بانکی شاپرک/زرین‌پال</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedPlatform.iranEcosystemSupport.kavenegarSms ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>پیامک پترن (کاوه‌نگار/فراز)</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedPlatform.iranEcosystemSupport.sepidarHamkaranErp ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>حسابداری سپیدار / همکاران</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedPlatform.iranEcosystemSupport.torobEmalls ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>فید لحظه‌ای ترب و ایمالز</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros & Cons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Pros */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>مزایای کلیدی برای فروشگاه عمده دایا:</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {selectedPlatform.prosFa.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-3">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>محدودیت‌ها و چالش‌های احتمالی:</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
              {selectedPlatform.consFa.map((con, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Themes / Plugins from Iranian Market (Zhaket & Rastchin) */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
          <div className="font-bold text-xs text-slate-900 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-600" />
            <span>قالب‌ها، پلاگین‌ها و ابزارهای پیشنهادی در بازار ایران (ژاکت / راست‌چین):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPlatform.recommendedThemesOrLibs.map((item, idx) => (
              <span
                key={idx}
                className="bg-white border border-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded-xl font-medium shadow-2xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Final Architectural Verdict */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
          <Zap className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block mb-1">جمع‌بندی و توصیه تخصصی برای «دایا»:</strong>
            <p className="leading-relaxed">{selectedPlatform.verdictFa}</p>
          </div>
        </div>
      </div>

      {/* Suggested 3-Phase Implementation Roadmap for Daya */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
          نقشه راه پیشنهادی راه‌اندازی کسب‌وکار «دایا الکترونیک» (۳ فاز اجرایی)
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          استراتژی پیشنهادی برای شروع کم‌هزینه و سریع و سپس مهاجرت به پلتفرم مقیاس‌پذیر همگام با رشد سفارشات:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phase 1 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white relative">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              ۱
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              فاز ۱: راه‌اندازی سریع با وردپرس و ووکامرس (MVP)
            </h3>
            <div className="text-[11px] text-rose-600 font-semibold mb-3">مدت زمان: ۳ تا ۴ هفته</div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>• نصب قالب وودمارت یا دیجی‌مارچ (خریداری از ژاکت/راست‌چین) با ظاهر کاملاً مشابه دیجی‌کالا.</li>
              <li>• راه‌اندازی افزونه B2BKing یا Wholesale Suite جهت تعریف قیمت‌های پلکانی قرقره و نقش همکاران.</li>
              <li>• اتصال مستقیم به درگاه زرین‌پال/سداد و پیامک کاوه‌نگار برای اعتبارسنجی شماره موبایل.</li>
              <li>• شروع فروش ۱۰۰۰ قلم قطعه پرمصرف اولیه انبار تهران.</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white relative">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-3">
              ۲
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              فاز ۲: ارتقای فیلتر پارامتریک و اتصال حسابداری سپیدار
            </h3>
            <div className="text-[11px] text-indigo-600 font-semibold mb-3">مدت زمان: ماه دوم تا چهارم</div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>• یکپارچه‌سازی وب‌سرویس ووکامرس با نرم‌افزار حسابداری و انبارداری سپیدار سیستم یا همکاران سیستم.</li>
              <li>• پیاده‌سازی افزونه FacetWP و موتور کشینگ Redis برای سرچ آنی ۲۰,۰۰۰ پارت‌نامبر.</li>
              <li>• راه‌اندازی ماژول استعلام فایل BOM اکسل برای کارخانجات مونتاژ SMD.</li>
              <li>• فعال‌سازی اتصال خودکار محصولات به موتورهای ترب و ایمالز جهت جذب ترافیک B2B.</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white relative">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mb-3">
              ۳
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              فاز ۳: مهاجرت به پلتفرم هدلس اختصاصی (Next.js + Python)
            </h3>
            <div className="text-[11px] text-slate-600 font-semibold mb-3">مدت زمان: سال دوم به بعد</div>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li>• بازنویسی فرانت‌اند به Next.js 15 با سرعت بارگذاری زیر ۱ ثانیه و پشتیبانی از بیش از ۵۰۰,۰۰۰ قطعه.</li>
              <li>• توسعه موتور هوشمند استعلام قیمت لحظه‌ای یوان/درهم و اتصال مستقیم به پلتفرم‌های شنژن چین (LCSC/SZLC).</li>
              <li>• پورتال پیشرفته اعتبارسنجی حقوقی با امضای دیجیتال و فاکتور رسمی خودکار سامانه مودیان.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
