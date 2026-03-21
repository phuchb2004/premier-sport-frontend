import { createContext, useContext, useState, type ReactNode } from 'react';

type Language = 'en' | 'vi';

export interface Translations {
  topBar: string;
  kits: string;
  boots: string;
  accessories: string;
  balls: string;
  about: string;
  login: string;
  signUp: string;
  orders: string;
  admin: string;
  logout: string;
  editProfile: string;
  switchTo: string;
  currentLang: string;
  // HomePage
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  shopNow: string;
  learnMore: string;
  shopByCategory: string;
  categorySubtitle: string;
  kitsDesc: string;
  bootsDesc: string;
  accessoriesDesc: string;
  ballsDesc: string;
  featuredProducts: string;
  featuredSubtitle: string;
  viewAll: string;
  loadingError: string;
  featuredEmpty: string;
  freeDelivery: string;
  freeDeliveryDesc: string;
  easyReturns: string;
  easyReturnsDesc: string;
  securePayment: string;
  securePaymentDesc: string;
  // AboutPage
  aboutTitle: string;
  aboutSubtitle: string;
  ourStory: string;
  storyP1: string;
  storyP2: string;
  statProducts: string;
  statBrands: string;
  statCustomers: string;
  // Footer
  footerTagline: string;
  footerShop: string;
  footerCompany: string;
  footerAboutUs: string;
  footerMyAccount: string;
  footerRights: string;
  footerBuiltWith: string;
}

const translations: Record<Language, Translations> = {
  en: {
    topBar: 'Free shipping on orders over £50',
    kits: 'Kits',
    boots: 'Boots',
    accessories: 'Accessories',
    balls: 'Balls',
    about: 'About',
    login: 'Login',
    signUp: 'Sign Up',
    orders: 'Orders',
    admin: 'Admin',
    logout: 'Logout',
    editProfile: 'Edit Profile',
    switchTo: 'Tiếng Việt',
    currentLang: 'English',
    // HomePage
    heroTitle1: 'Play Like a',
    heroTitle2: 'Champion',
    heroSubtitle: 'Premium football gear for every level. From grassroots to professional — find your perfect kit, boots, and equipment.',
    shopNow: 'Shop Now',
    learnMore: 'Learn More',
    shopByCategory: 'Shop by Category',
    categorySubtitle: 'Everything you need on and off the pitch',
    kitsDesc: 'Full match kits & training wear',
    bootsDesc: 'Performance football boots',
    accessoriesDesc: 'Shin pads, gloves & more',
    ballsDesc: 'Match & training balls',
    featuredProducts: 'Featured Products',
    featuredSubtitle: 'Hand-picked for performance and style',
    viewAll: 'View all →',
    loadingError: 'Unable to load featured products. Please try again later.',
    featuredEmpty: 'Featured products coming soon',
    freeDelivery: 'Free Delivery',
    freeDeliveryDesc: 'On orders over £50',
    easyReturns: 'Easy Returns',
    easyReturnsDesc: '30-day return policy',
    securePayment: 'Secure Payment',
    securePaymentDesc: 'VietQR & MoMo',
    // AboutPage
    aboutTitle: 'About Premier Sport',
    aboutSubtitle: 'Your home for premium football gear',
    ourStory: 'Our Story',
    storyP1: "Premier Sport was founded with a simple mission: make top-quality football gear accessible to players at every level. Whether you're a Sunday league warrior or an aspiring professional, you deserve the best.",
    storyP2: "We stock kits, boots, accessories, and training equipment from the world's leading brands, curated by our team of passionate football enthusiasts.",
    statProducts: 'Products',
    statBrands: 'Brands',
    statCustomers: 'Happy customers',
    // Footer
    footerTagline: 'Your premier destination for football kits, boots, accessories, and equipment. Gear up and play like a champion.',
    footerShop: 'Shop',
    footerCompany: 'Company',
    footerAboutUs: 'About Us',
    footerMyAccount: 'My Account',
    footerRights: 'All rights reserved.',
    footerBuiltWith: 'Built with React + Spring Boot',
  },
  vi: {
    topBar: 'Miễn phí vận chuyển cho đơn hàng trên £50',
    kits: 'Bộ dụng cụ',
    boots: 'Giày',
    accessories: 'Phụ kiện',
    balls: 'Bóng',
    about: 'Giới thiệu',
    login: 'Đăng nhập',
    signUp: 'Đăng ký',
    orders: 'Đơn hàng',
    admin: 'Quản trị',
    logout: 'Đăng xuất',
    editProfile: 'Chỉnh sửa hồ sơ',
    switchTo: 'English',
    currentLang: 'Tiếng Việt',
    // HomePage
    heroTitle1: 'Chơi Như Một',
    heroTitle2: 'Nhà Vô Địch',
    heroSubtitle: 'Trang bị bóng đá cao cấp cho mọi cấp độ. Từ phong trào đến chuyên nghiệp — tìm bộ đồ, giày và thiết bị hoàn hảo của bạn.',
    shopNow: 'Mua Ngay',
    learnMore: 'Tìm Hiểu Thêm',
    shopByCategory: 'Mua Theo Danh Mục',
    categorySubtitle: 'Mọi thứ bạn cần trên và ngoài sân',
    kitsDesc: 'Bộ đồ thi đấu & tập luyện đầy đủ',
    bootsDesc: 'Giày bóng đá hiệu suất cao',
    accessoriesDesc: 'Bảo vệ ống chân, găng tay & nhiều hơn',
    ballsDesc: 'Bóng thi đấu & tập luyện',
    featuredProducts: 'Sản Phẩm Nổi Bật',
    featuredSubtitle: 'Được chọn lọc vì hiệu suất và phong cách',
    viewAll: 'Xem tất cả →',
    loadingError: 'Không thể tải sản phẩm nổi bật. Vui lòng thử lại sau.',
    featuredEmpty: 'Sản phẩm nổi bật sắp ra mắt',
    freeDelivery: 'Giao Hàng Miễn Phí',
    freeDeliveryDesc: 'Cho đơn hàng trên £50',
    easyReturns: 'Đổi Trả Dễ Dàng',
    easyReturnsDesc: 'Chính sách hoàn trả 30 ngày',
    securePayment: 'Thanh Toán An Toàn',
    securePaymentDesc: 'VietQR & MoMo',
    // AboutPage
    aboutTitle: 'Về Premier Sport',
    aboutSubtitle: 'Điểm đến của bạn cho trang bị bóng đá cao cấp',
    ourStory: 'Câu Chuyện Của Chúng Tôi',
    storyP1: 'Premier Sport được thành lập với một sứ mệnh đơn giản: mang trang bị bóng đá chất lượng hàng đầu đến với người chơi ở mọi cấp độ. Dù bạn là chiến binh giải phong trào hay người chơi chuyên nghiệp đầy khát vọng, bạn xứng đáng được trang bị tốt nhất.',
    storyP2: 'Chúng tôi cung cấp bộ đồ, giày, phụ kiện và thiết bị tập luyện từ các thương hiệu hàng đầu thế giới, được tuyển chọn bởi đội ngũ những người đam mê bóng đá.',
    statProducts: 'Sản phẩm',
    statBrands: 'Thương hiệu',
    statCustomers: 'Khách hàng hài lòng',
    // Footer
    footerTagline: 'Điểm đến hàng đầu của bạn cho bộ đồ bóng đá, giày, phụ kiện và thiết bị. Trang bị và chơi như một nhà vô địch.',
    footerShop: 'Cửa Hàng',
    footerCompany: 'Công Ty',
    footerAboutUs: 'Về Chúng Tôi',
    footerMyAccount: 'Tài Khoản Của Tôi',
    footerRights: 'Bản quyền thuộc về Premier Sport.',
    footerBuiltWith: 'Xây dựng bằng React + Spring Boot',
  },
};

interface LanguageContextType {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) ?? 'en';
  });

  const toggleLanguage = () => {
    setLanguage((l) => {
      const next = l === 'en' ? 'vi' : 'en';
      localStorage.setItem('language', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, t: translations[language], toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
