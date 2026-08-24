import React, { useState } from 'react';
import { Header } from './components/Header';
import { IncredibleOffers } from './components/IncredibleOffers';
import { ProductCatalog } from './components/ProductCatalog';
import { BomAnalyzer } from './components/BomAnalyzer';
import { PlatformAdvisor } from './components/PlatformAdvisor';
import { OfficialInvoiceModal } from './components/OfficialInvoiceModal';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AiAdvisorDrawer } from './components/AiAdvisorDrawer';
import { ELECTRONIC_COMPONENTS, BUYER_ROLES } from './data/componentsData';
import { ElectronicComponent, CartItem, BuyerRole, PackagingType, BomItem } from './types';
import { 
  ShieldCheck, Truck, Clock, RefreshCw, Cpu, 
  Layers, Headphones, MapPin, Award, CheckCircle2 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'bom' | 'platforms' | 'invoice'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<BuyerRole>('oem_factory');
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      productId: 'stm32f103c8t6',
      product: ELECTRONIC_COMPONENTS[0],
      packagingType: 'reel',
      quantity: 2500,
      unitPriceToman: 90300, // with OEM 14% role discount
      totalPriceToman: 90300 * 2500,
    },
    {
      productId: 'ams1117_3_3',
      product: ELECTRONIC_COMPONENTS[4],
      packagingType: 'reel',
      quantity: 2500,
      unitPriceToman: 1677, // with OEM 14% discount
      totalPriceToman: 1677 * 2500,
    }
  ]);

  // Modals and Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [advisorInitialQuery, setAdvisorInitialQuery] = useState<string>('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<ElectronicComponent | null>(null);

  const roleInfo = BUYER_ROLES.find((r) => r.id === currentRole) || BUYER_ROLES[0];

  // Cart operations
  const handleAddToCart = (product: ElectronicComponent, quantity: number, packagingType: PackagingType = 'cut_tape') => {
    // Find matching tier
    let bestTier = product.pricingTiers[0];
    for (let i = product.pricingTiers.length - 1; i >= 0; i--) {
      if (quantity >= product.pricingTiers[i].minQty) {
        bestTier = product.pricingTiers[i];
        break;
      }
    }
    const unitPriceToman = Math.round(bestTier.priceToman * (1 - roleInfo.discountPercentage / 100));

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex].quantity = newQty;
        updated[existingIndex].totalPriceToman = updated[existingIndex].unitPriceToman * newQty;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            packagingType,
            quantity,
            unitPriceToman,
            totalPriceToman: unitPriceToman * quantity,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const handleAddMultipleToCart = (
    itemsToAdd: { product: ElectronicComponent; qty: number; packaging: string }[]
  ) => {
    itemsToAdd.forEach((item) => {
      handleAddToCart(item.product, item.qty, item.packaging as PackagingType);
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          // Recompute tier
          let bestTier = item.product.pricingTiers[0];
          for (let i = item.product.pricingTiers.length - 1; i >= 0; i--) {
            if (newQty >= item.product.pricingTiers[i].minQty) {
              bestTier = item.product.pricingTiers[i];
              break;
            }
          }
          const unitPriceToman = Math.round(bestTier.priceToman * (1 - roleInfo.discountPercentage / 100));
          return {
            ...item,
            quantity: newQty,
            unitPriceToman,
            totalPriceToman: unitPriceToman * newQty,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleGenerateInvoiceFromBom = (bomItems: BomItem[]) => {
    // Add matched to cart first
    const matched = bomItems
      .filter((i) => i.matchedProduct)
      .map((i) => ({
        product: i.matchedProduct!,
        qty: i.quantity,
        packaging: i.quantity >= (i.matchedProduct!.reelQuantity || 99999) ? 'reel' : 'cut_tape',
      }));

    if (matched.length > 0) {
      handleAddMultipleToCart(matched);
    }
    setActiveTab('invoice');
  };

  const handleOpenAdvisorWithPart = (partOrQuery: string) => {
    setAdvisorInitialQuery(partOrQuery);
    setIsAdvisorOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between selection:bg-[#3e6b4e] selection:text-white font-sans">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBom={() => setActiveTab('bom')}
        onOpenAdvisor={() => {
          setAdvisorInitialQuery('');
          setIsAdvisorOpen(true);
        }}
        onOpenPlatformGuide={() => setActiveTab('platforms')}
        onOpenInvoice={() => setActiveTab('invoice')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'catalog' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Sleek Incredible Offers Banner */}
            <IncredibleOffers
              components={ELECTRONIC_COMPONENTS}
              onSelectComponent={setSelectedProductForModal}
              currentRole={currentRole}
              onAddToCart={(comp, qty, pkg) => handleAddToCart(comp, qty, pkg as PackagingType)}
            />

            {/* Parametric Catalog View */}
            <ProductCatalog
              components={ELECTRONIC_COMPONENTS}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              searchQuery={searchQuery}
              currentRole={currentRole}
              onSelectComponent={setSelectedProductForModal}
              onAddToCart={handleAddToCart}
              onOpenAdvisorWithPart={handleOpenAdvisorWithPart}
            />
          </div>
        )}

        {activeTab === 'bom' && (
          <div className="animate-in fade-in duration-150">
            <BomAnalyzer
              components={ELECTRONIC_COMPONENTS}
              currentRole={currentRole}
              onAddMultipleToCart={handleAddMultipleToCart}
              onGenerateInvoiceFromBom={handleGenerateInvoiceFromBom}
              onOpenAdvisorWithQuery={handleOpenAdvisorWithPart}
            />
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="animate-in fade-in duration-150">
            <PlatformAdvisor />
          </div>
        )}

        {activeTab === 'invoice' && (
          <div className="animate-in fade-in duration-150">
            <OfficialInvoiceModal
              cartItems={cartItems}
              currentRole={currentRole}
              onBackToShopping={() => setActiveTab('catalog')}
            />
          </div>
        )}
      </main>

      {/* B2B Trust and Guarantee Banner (Sleek Interface Style) */}
      <section className="no-print bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs">
            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-lg bg-[#edf5f0] text-[#3e6b4e] flex items-center justify-center border border-[#cbe0d2]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <strong className="font-bold text-gray-900">تضمین اصالت ۱۰۰٪ قطعات</strong>
              <p className="text-[11px] text-gray-500">ضمانت عدم وجود چیپ‌های فیک و مهلت تست آزمایشگاهی</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                <Truck className="w-6 h-6" />
              </div>
              <strong className="font-bold text-gray-900">ارسال فوری انبار تهران</strong>
              <p className="text-[11px] text-gray-500">تحویل ۲ ساعته در تهران و ۲۴ ساعته در سراسر کارخانجات کشور</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center border border-gray-200">
                <Layers className="w-6 h-6 text-gray-700" />
              </div>
              <strong className="font-bold text-gray-900">واردات مستقیم شنژن چین</strong>
              <p className="text-[11px] text-gray-500">تامین قطعات ناموجود و تیراژ کانتینری با ترخیص گمرکی</p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-2">
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Award className="w-6 h-6" />
              </div>
              <strong className="font-bold text-gray-900">فاکتور رسمی ارزش افزوده</strong>
              <p className="text-[11px] text-gray-500">امکان صدور فاکتور رسمی دارایی و ثبت در سامانه مودیان</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="no-print bg-gray-900 text-gray-400 text-xs py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-lg">
                <div className="w-7 h-7 bg-[#3e6b4e] rounded flex items-center justify-center text-white text-sm font-bold">D</div>
                <span>دایا الکترونیک</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                مرکز تخصصی تامین و توزیع عمده قطعات الکترونیک، میکروکنترلرهای ARM و ESP32، ماژول‌های مخابراتی 4G و قطعات پسیو قرقره در بازار ایران.
              </p>
              <div className="text-[11px] text-gray-500 font-en">
                © {new Date().getFullYear()} Daya Wholesale Electronics Co. All Rights Reserved.
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">دسترسی سریع</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveTab('catalog')} className="hover:text-white transition-colors">
                    کاتالوگ کامل قطعات و ریل‌ها
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('bom')} className="hover:text-white transition-colors">
                    موتور استعلام و برآورد BOM
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('invoice')} className="hover:text-white transition-colors">
                    صدور پیش‌فاکتور رسمی دارایی
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('platforms')} className="hover:text-white transition-colors">
                    تحلیل فنی پلتفرم‌ها (وردپرس vs هدلس)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">دسته‌بندی‌های اصلی</h4>
              <ul className="space-y-2 text-xs">
                <li>میکروکنترلرهای STM32 و GD32</li>
                <li>ماژول‌های بیسیم و اینترنت اشیاء ESP32</li>
                <li>رگولاتورهای سوئیچینگ و خطی AMS1117</li>
                <li>خازن و مقاومت‌های ریل 0805 و 0603</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-xs">تماس و دفتر مرکزی</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">
                تهران، خیابان جمهوری، تقاطع پل حافظ، مجتمع تجاری الکترونیک، طبقه ۳، واحد ۳۱۴
              </p>
              <p className="text-xs text-gray-400">
                تلفن تدارکات: ۰۲۱-۶۶۷۵xxxx
              </p>
              <p className="text-xs text-gray-400">
                ایمیل: b2b@daya-electronic.ir
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Sleek Interface Bottom Live Status Bar (Matching Design Template) */}
      <div className="no-print bg-gray-900 text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-[11px] font-medium border-t border-gray-800">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-mono text-green-400 uppercase tracking-wider text-[10px]">GLOBAL INVENTORY LINK ACTIVE</span>
          </div>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <span className="text-gray-400 hidden sm:inline font-mono">API Latency: 14ms (Tehran DC)</span>
          <span className="text-gray-600 hidden md:inline">|</span>
          <span className="text-gray-400 hidden md:inline">B2B Tier: {roleInfo.titleFa}</span>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse text-gray-400">
          <button onClick={() => setActiveTab('bom')} className="hover:text-white transition-colors">
            قالب اکسل BOM (.CSV)
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('invoice')} className="hover:text-white transition-colors">
            محاسبه ارزش افزوده و مالیات
          </button>
          <span>•</span>
          <span className="text-gray-500 font-mono">24/7 SUPPORT</span>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ProductModal
        component={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        currentRole={currentRole}
        onAddToCart={handleAddToCart}
        onOpenAdvisorWithPart={handleOpenAdvisorWithPart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        currentRole={currentRole}
        onProceedToInvoice={() => setActiveTab('invoice')}
      />

      <AiAdvisorDrawer
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        initialPartOrQuery={advisorInitialQuery}
        currentRole={currentRole}
        onSearchInCatalog={(q) => {
          setSearchQuery(q);
          setActiveTab('catalog');
          setIsAdvisorOpen(false);
        }}
      />
    </div>
  );
}
