import React, { useState } from 'react';
import { 
  Printer, Download, ShieldCheck, Building2, 
  FileText, CheckCircle2, Copy, Check, ArrowRight
} from 'lucide-react';
import { CartItem, CustomerCompanyInfo, BuyerRole } from '../types';
import { BUYER_ROLES } from '../data/componentsData';

interface OfficialInvoiceModalProps {
  cartItems: CartItem[];
  currentRole: BuyerRole;
  onBackToShopping: () => void;
}

export const OfficialInvoiceModal: React.FC<OfficialInvoiceModalProps> = ({
  cartItems,
  currentRole,
  onBackToShopping,
}) => {
  const [copiedIban, setCopiedIban] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerCompanyInfo>({
    companyName: 'شرکت مهندسی نوآوران الکترونیک دانش‌بنیان',
    economicCode: '411589324156',
    nationalId: '14008742198',
    registrationNo: '542190',
    postalCode: '1439954321',
    address: 'تهران، پارک علم و فناوری دانشگاه تهران، ساختمان نوآوری ۳، واحد ۲۰۴',
    phone: '۰۲۱-۸۸۹۹xxxx',
    contactPerson: 'مهندس حسینی (مدیر تامین قطعات)',
    email: 'procurement@innovate-elec.ir',
    officialInvoiceRequested: true,
  });

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  const subtotalBeforeDiscount = cartItems.reduce(
    (acc, item) => acc + item.product.pricingTiers[0].priceToman * item.quantity,
    0
  );

  const subtotalAfterTierAndRole = cartItems.reduce(
    (acc, item) => acc + item.totalPriceToman,
    0
  );

  const totalDiscount = Math.max(0, subtotalBeforeDiscount - subtotalAfterTierAndRole);
  const vatRate = 0.10; // 10% Iranian VAT
  const vatAmount = customerInfo.officialInvoiceRequested
    ? Math.round(subtotalAfterTierAndRole * vatRate)
    : 0;
  const grandTotal = subtotalAfterTierAndRole + vatAmount;

  const invoiceNumber = 'DAYA-1405-B2B-' + Math.floor(100000 + Math.random() * 900000);
  const currentDateFa = '۱۴۰۵/۰۶/۰۲';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Toolbar (Hidden on print) */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToShopping}
          className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به کاتالوگ قطعات</span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={customerInfo.officialInvoiceRequested}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, officialInvoiceRequested: e.target.checked })
              }
              className="rounded text-[#3e6b4e] focus:ring-[#3e6b4e] h-4 w-4"
            />
            <span>محاسبه مالیات بر ارزش افزوده ۱۰٪ (فاکتور دارایی)</span>
          </label>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-[#95caa6]" />
            <span>چاپ و ذخیره PDF رسمی</span>
          </button>
        </div>
      </div>

      {/* Customer Info Form (Hidden on print) */}
      <div className="no-print bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#3e6b4e]" />
          <span>اطلاعات شرکت و خریدار حقوقی جهت ثبت در سامانه مودیان:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 mb-1">نام کامل شرکت / سازمان:</label>
            <input
              type="text"
              value={customerInfo.companyName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, companyName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">شناسه ملی (۱۱ رقمی):</label>
            <input
              type="text"
              value={customerInfo.nationalId}
              onChange={(e) => setCustomerInfo({ ...customerInfo, nationalId: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">کد اقتصادی (۱۲ یا ۱۴ رقمی):</label>
            <input
              type="text"
              value={customerInfo.economicCode}
              onChange={(e) => setCustomerInfo({ ...customerInfo, economicCode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">شماره ثبت:</label>
            <input
              type="text"
              value={customerInfo.registrationNo}
              onChange={(e) => setCustomerInfo({ ...customerInfo, registrationNo: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">کد پستی (۱۰ رقمی):</label>
            <input
              type="text"
              value={customerInfo.postalCode}
              onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono text-xs"
            />
          </div>
          <div>
            <label className="block text-slate-500 mb-1">شماره تماس مسئول تدارکات:</label>
            <input
              type="text"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-slate-500 mb-1">آدرس کامل قانونی کارخانه / دفتر:</label>
            <input
              type="text"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Official Printable Invoice Sheet (Tax Format) */}
      <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-10 shadow-lg text-slate-900 text-xs leading-normal">
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-900 pb-6 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#3e6b4e] text-white flex items-center justify-center font-black text-xl">
              دایا
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                شرکت مهندسی بازرگانی دایا الکترونیک پیشرو (سهامی خاص)
              </h1>
              <p className="text-[11px] text-slate-600 mt-0.5">
                تامین و واردات مستقیم قطعات الکترونیک، میکروکنترلر و پسیو از شنژن و هنگ‌کنگ
              </p>
            </div>
          </div>

          <div className="text-center sm:text-left bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1 min-w-[220px]">
            <div className="text-xs font-black text-[#2d523b] mb-1">
              {customerInfo.officialInvoiceRequested ? 'صورتحساب فروش کالا (رسمی)' : 'پیش‌فاکتور استعلام قیمت'}
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">شماره سند:</span>
              <span className="font-mono font-bold text-slate-900">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">تاریخ صدور:</span>
              <span className="font-mono text-slate-900">{currentDateFa}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">اعتبار پیش‌فاکتور:</span>
              <span className="text-slate-900">۳ روز کاری</span>
            </div>
          </div>
        </div>

        {/* Two-Column Seller and Buyer Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Seller Info */}
          <div className="border border-slate-300 rounded-2xl p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>مشخصات فروشنده (دایا الکترونیک):</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">شناسه: ۱۴۰۰۹۸۷۶۵۴۳</span>
            </div>
            <div className="text-[11px] text-slate-700 space-y-1">
              <div><strong>نام:</strong> شرکت مهندسی بازرگانی دایا الکترونیک پیشرو</div>
              <div><strong>کد اقتصادی:</strong> ۴۱۱۶۵۴۳۲۱۹۸۷ | <strong>شماره ثبت:</strong> ۵۶۲۱۴۰</div>
              <div><strong>نشانی:</strong> تهران، تقاطع خیابان جمهوری و حافظ، مرکز الکترونیک، طبقه ۳، واحد ۳۱۴</div>
              <div><strong>تلفن:</strong> ۰۲۱-۶۶۷۵xxxx (۱۰ خط) | <strong>کد پستی:</strong> ۱۱۳۵۸۷۶۵۴۳</div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="border border-slate-300 rounded-2xl p-3.5 bg-slate-50/50 space-y-1.5">
            <div className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>مشخصات خریدار / شرکت متقاضی:</span>
              <span className="text-[10px] bg-[#edf5f0] text-[#2d523b] border border-[#cbe0d2] px-1.5 py-0.5 rounded">
                رتبه: {roleInfo.titleFa}
              </span>
            </div>
            <div className="text-[11px] text-slate-700 space-y-1">
              <div><strong>نام شرکت:</strong> {customerInfo.companyName}</div>
              <div>
                <strong>شناسه ملی:</strong> {customerInfo.nationalId} | <strong>کد اقتصادی:</strong> {customerInfo.economicCode}
              </div>
              <div><strong>نشانی:</strong> {customerInfo.address}</div>
              <div>
                <strong>تلفن/مسئول:</strong> {customerInfo.phone} - {customerInfo.contactPerson}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border-2 border-slate-300 rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300 text-[11px]">
              <tr>
                <th className="p-2.5 w-8 text-center">ردیف</th>
                <th className="p-2.5">شرح کالا / پارت‌نامبر</th>
                <th className="p-2.5">پکیج / بسته‌بندی</th>
                <th className="p-2.5 text-center">تعداد</th>
                <th className="p-2.5 text-left">مبلغ واحد (تومان)</th>
                <th className="p-2.5 text-left">مبلغ کل (تومان)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    سبد خرید در حال حاضر خالی است. قطعات مورد نظر خود را از کاتالوگ یا ابزار استعلام BOM اضافه فرمایید.
                  </td>
                </tr>
              ) : (
                cartItems.map((item, idx) => (
                  <tr key={item.productId} className="hover:bg-slate-50">
                    <td className="p-2.5 text-center font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-2.5">
                      <div className="font-mono font-bold text-slate-900">{item.product.partNumber}</div>
                      <div className="text-[10px] text-slate-600">{item.product.titleFa}</div>
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-700">
                      {item.product.packageFootprint} ({item.packagingType})
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-slate-900">
                      {item.quantity.toLocaleString('fa-IR')}
                    </td>
                    <td className="p-2.5 text-left font-mono text-slate-700">
                      {item.unitPriceToman.toLocaleString('fa-IR')}
                    </td>
                    <td className="p-2.5 text-left font-mono font-bold text-slate-900">
                      {item.totalPriceToman.toLocaleString('fa-IR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Totals & Tax Calculation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment Terms & Bank Info */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 text-xs space-y-2">
            <div className="font-bold text-slate-900 text-xs mb-1">
              اطلاعات حساب و واریز حواله بانکی (دایا الکترونیک):
            </div>
            <div className="text-[11px] text-slate-600 space-y-1.5">
              <div><strong>بانک:</strong> ملت - شعبه مرکزی بازار الکترونیک</div>
              <div><strong>صاحب حساب:</strong> شرکت مهندسی بازرگانی دایا الکترونیک پیشرو</div>
              <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl">
                <span className="font-mono text-slate-800 text-[11px]">
                  IR72 0120 0000 0000 4521 8974 12
                </span>
                <button
                  onClick={() => handleCopyIban('IR720120000000004521897412')}
                  className="text-slate-500 hover:text-[#3e6b4e] text-[10px] flex items-center gap-1 font-sans"
                >
                  {copiedIban ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIban ? 'کپی شد' : 'کپی شبا'}</span>
                </button>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                شرایط تسویه: مطابق سطح خریدار ({roleInfo.titleFa}) با مهلت اعتباری {roleInfo.creditTermDays} روز کاری پس از تحویل بار.
              </div>
            </div>
          </div>

          {/* Totals Breakdown Box */}
          <div className="border border-slate-300 rounded-2xl p-4 bg-white text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">جمع کل کالاها (بدون تخفیف):</span>
              <span className="font-mono text-slate-800">
                {subtotalBeforeDiscount.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 text-emerald-700">
              <span>تخفیف حجم سفارش و سطح B2B:</span>
              <span className="font-mono font-bold">
                - {totalDiscount.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">مبلغ خالص پس از کسر تخفیف:</span>
              <span className="font-mono text-slate-900 font-bold">
                {subtotalAfterTierAndRole.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            {customerInfo.officialInvoiceRequested && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                <span>مالیات و عوارض بر ارزش افزوده (۱۰٪):</span>
                <span className="font-mono font-bold">
                  {vatAmount.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-sm font-black text-[#2d523b]">
              <span>مبلغ نهایی قابل پرداخت:</span>
              <span className="font-mono text-base font-black text-[#3e6b4e]">
                {grandTotal.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>

        {/* Stamps & Signatures Footer */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-300 text-center text-xs">
          <div>
            <div className="font-bold text-slate-800 mb-12">مهر و امضای خریدار / شرکت متقاضی:</div>
            <div className="text-[10px] text-slate-400">امضا و تاییدیه مالی</div>
          </div>
          <div>
            <div className="font-bold text-slate-800 mb-2">مهر و امضای شرکت دایا الکترونیک پیشرو:</div>
            <div className="inline-block border-2 border-dashed border-[#cbe0d2] rounded-2xl p-3 bg-[#edf5f0] text-[#2d523b] text-[10px]">
              <div className="font-bold">شرکت دایا الکترونیک پیشرو</div>
              <div>واحد امور مالی و بازرگانی</div>
              <div className="font-mono text-[9px] text-[#3e6b4e] mt-0.5">تایید سیستمی شناسه ۱۴۰۰۹۸۷۶۵۴۳</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
