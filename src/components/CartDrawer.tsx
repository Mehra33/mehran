import React from 'react';
import { 
  X, ShoppingCart, Trash2, ArrowLeft, ShieldCheck, 
  FileText, Package, CheckCircle2, ChevronRight, Plus, Minus
} from 'lucide-react';
import { CartItem, BuyerRole } from '../types';
import { BUYER_ROLES } from '../data/componentsData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentRole: BuyerRole;
  onProceedToInvoice: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentRole,
  onProceedToInvoice,
}) => {
  if (!isOpen) return null;

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalBeforeSavings = cartItems.reduce(
    (acc, item) => acc + item.product.pricingTiers[0].priceToman * item.quantity,
    0
  );
  const finalSubtotal = cartItems.reduce((acc, item) => acc + item.totalPriceToman, 0);
  const totalSavings = Math.max(0, subtotalBeforeSavings - finalSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl border-r border-gray-200 flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-gray-900">سبد خرید عمده دایا</h2>
                <p className="text-[11px] text-gray-500 font-mono">
                  {cartItems.length} ردیف کالا ({totalQuantity.toLocaleString('fa-IR')} قطعه)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <ShoppingCart className="w-16 h-16 stroke-1 mb-3 text-gray-300" />
                <p className="text-sm font-bold text-gray-700">سبد خرید شما خالی است</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                  قطعات مورد نظر خود را از کاتالوگ یا از طریق بارگذاری فایل لیست قطعات (BOM) اضافه فرمایید.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.partNumber}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-gray-900 text-xs block">
                          {item.product.partNumber}
                        </span>
                        <span className="text-[11px] text-gray-500 line-clamp-1">
                          {item.product.titleFa}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          بسته‌بندی: {item.packagingType} | فوت‌پرینت: {item.product.packageFootprint}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Row Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center border border-gray-300 rounded-md bg-white p-0.5">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            Math.max(item.product.moq || 1, item.quantity - 10)
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min={item.product.moq || 1}
                        value={item.quantity}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.productId,
                            Math.max(item.product.moq || 1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-14 text-center text-xs font-mono font-bold outline-none text-gray-900"
                      />
                      <button
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 10)}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-left font-mono">
                      <div className="font-bold text-gray-900 text-xs">
                        {item.totalPriceToman.toLocaleString('fa-IR')} ت
                      </div>
                      <div className="text-[10px] text-gray-400">
                        ({item.unitPriceToman.toLocaleString('fa-IR')} ت / عدد)
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Actions */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>جمع اقلام سبد:</span>
                  <span className="font-mono">{subtotalBeforeSavings.toLocaleString('fa-IR')} ت</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>سود شما از نرخ تیراژ و B2B:</span>
                    <span className="font-mono">- {totalSavings.toLocaleString('fa-IR')} ت</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-900 font-bold text-sm pt-1.5 border-t border-gray-200">
                  <span>مبلغ کل سبد خرید:</span>
                  <span className="font-mono text-base text-red-600">
                    {finalSubtotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToInvoice();
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>صدور پیش‌فاکتور رسمی و تسویه</span>
                </button>

                <div className="flex justify-between items-center text-[11px] text-gray-400 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                    ضمانت اصالت فیزیکی قطعات
                  </span>
                  <button
                    onClick={onClearCart}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    خالی کردن سبد
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
