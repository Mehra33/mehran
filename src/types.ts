export type BuyerRole = 'engineer' | 'partner' | 'oem_factory' | 'distributor';

export interface BuyerRoleInfo {
  id: BuyerRole;
  titleFa: string;
  titleEn: string;
  discountPercentage: number;
  creditTermDays: number;
  minOrderAmountToman: number;
  badgeColor: string;
  descriptionFa: string;
}

export type PackagingType = 'cut_tape' | 'reel' | 'tube' | 'tray' | 'bulk';

export interface PriceTier {
  minQty: number;
  maxQty: number | null; // null means and above
  priceToman: number;
  labelFa: string;
}

export interface ElectronicComponent {
  id: string;
  partNumber: string;
  titleFa: string;
  category: string;
  subCategory: string;
  manufacturer: string;
  packageFootprint: string;
  pinCount?: number;
  stockTehran: number;
  stockShenzhen: number;
  leadTimeDays: number;
  moq: number; // Minimum Order Quantity
  reelQuantity?: number;
  packagingTypes: PackagingType[];
  pricingTiers: PriceTier[];
  datasheetUrl?: string;
  isOriginal: boolean;
  grade: 'Original-Grade A' | 'OEM' | 'Industrial Certified' | 'Commercial';
  specs: Record<string, string>;
  isFlashDeal?: boolean;
  flashDealDiscount?: number;
  image: string;
  descriptionFa: string;
  alternatives?: string[]; // compatible part numbers
}

export interface CartItem {
  productId: string;
  product: ElectronicComponent;
  packagingType: PackagingType;
  quantity: number;
  unitPriceToman: number;
  totalPriceToman: number;
  designatorRef?: string; // e.g., "R1, R4, C12"
}

export interface BomItem {
  id: string;
  rawInput: string;
  partNumber: string;
  packageFootprint?: string;
  quantity: number;
  designators?: string;
  matchedProduct?: ElectronicComponent;
  alternativeProduct?: ElectronicComponent;
  matchStatus: 'exact' | 'alternative' | 'shenzhen_import' | 'not_found';
  unitPriceToman: number;
  totalPriceToman: number;
  selected: boolean;
}

export interface CustomerCompanyInfo {
  companyName: string;
  economicCode: string; // کد اقتصادی
  nationalId: string; // شناسه ملی / کد ملی
  registrationNo: string; // شماره ثبت
  postalCode: string;
  address: string;
  phone: string;
  contactPerson: string;
  email: string;
  officialInvoiceRequested: boolean; // درخواست فاکتور رسمی ارزش افزوده
}

export interface PlatformEvaluation {
  id: string;
  name: string;
  nameFa: string;
  techStack: string;
  bestFor: string;
  costRating: number; // 1-5
  scalabilityRating: number; // 1-5
  parametricSearchRating: number; // 1-5
  ttmWeeks: string; // Time to Market
  iranEcosystemSupport: {
    zarinpalSaman: boolean;
    kavenegarSms: boolean;
    sepidarHamkaranErp: boolean;
    torobEmalls: boolean;
  };
  prosFa: string[];
  consFa: string[];
  recommendedThemesOrLibs: string[];
  verdictFa: string;
}
