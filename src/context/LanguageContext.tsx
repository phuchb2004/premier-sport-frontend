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
  // LoginPage
  loginWelcomeTitle: string;
  loginWelcomeSubtitle: string;
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  loginPasswordLabel: string;
  loginPasswordPlaceholder: string;
  loginHidePassword: string;
  loginShowPassword: string;
  loginInvalidCredentials: string;
  loginSigningIn: string;
  loginSignIn: string;
  loginNoAccount: string;
  loginSignUpLink: string;
  // RegisterPage
  registerTitle: string;
  registerSubtitle: string;
  registerFirstNameLabel: string;
  registerFirstNamePlaceholder: string;
  registerLastNameLabel: string;
  registerLastNamePlaceholder: string;
  registerEmailLabel: string;
  registerEmailPlaceholder: string;
  registerPasswordLabel: string;
  registerPasswordPlaceholder: string;
  registerHidePassword: string;
  registerShowPassword: string;
  registerConfirmPasswordLabel: string;
  registerConfirmPasswordPlaceholder: string;
  registerPasswordMismatch: string;
  registerPasswordTooShort: string;
  registerAccountExists: string;
  registerFailed: string;
  registerCreating: string;
  registerCreate: string;
  registerHasAccount: string;
  registerSignInLink: string;
  // CartPage
  cartEmptyTitle: string;
  cartEmptyMessage: string;
  cartContinueShopping: string;
  cartPageTitle: string;
  cartNoImage: string;
  cartSizePrefix: string;
  cartEach: string;
  cartRemove: string;
  cartOrderSummary: string;
  cartSubtotalPrefix: string;
  cartSubtotalSuffix: string;
  cartDelivery: string;
  cartTotal: string;
  cartCheckout: string;
  // CheckoutPage
  checkoutTitle: string;
  checkoutShippingAddress: string;
  checkoutStreetLabel: string;
  checkoutStreetPlaceholder: string;
  checkoutCityLabel: string;
  checkoutStateLabel: string;
  checkoutPostalCodeLabel: string;
  checkoutCountryLabel: string;
  checkoutProcessing: string;
  checkoutContinue: string;
  checkoutPaymentMethod: string;
  checkoutVietQRScan: string;
  checkoutBankLabel: string;
  checkoutBankValue: string;
  checkoutAccountLabel: string;
  checkoutAccountOwner: string;
  checkoutAmountLabel: string;
  checkoutContentLabel: string;
  checkoutMoMoScan: string;
  checkoutMoMoPhone: string;
  checkoutNameLabel: string;
  checkoutPaymentNote: string;
  checkoutPaymentError: string;
  checkoutConfirming: string;
  checkoutConfirmPayment: string;
  checkoutCreateOrderError: string;
  checkoutOrderSummary: string;
  checkoutSubtotal: string;
  checkoutShippingFee: string;
  checkoutTotalLabel: string;
  checkoutBackToCart: string;
  // ProductsPage
  productsAll: string;
  productsNewest: string;
  productsPriceLow: string;
  productsPriceHigh: string;
  productsNameAsc: string;
  productsAllTitle: string;
  productsProductSingular: string;
  productsProductPlural: string;
  productsSearchPlaceholder: string;
  productsSearch: string;
  productsSale: string;
  productsPrev: string;
  productsNext: string;
  productsNotFound: string;
  productsNoResultsPrefix: string;
  productsNoResultsSuffix: string;
  productsCheckBack: string;
  productsClearFilters: string;
  // ProductDetailPage
  productErrorTitle: string;
  productErrorMessage: string;
  productTryAgain: string;
  productBack: string;
  productNotFound: string;
  productNotFoundMessage: string;
  productHome: string;
  productSizeLabel: string;
  productSelectedSize: string;
  productQuantityLabel: string;
  productAdding: string;
  productAdded: string;
  productAddFailed: string;
  productOutOfStock: string;
  productAddToCart: string;
  productSignInPrefix: string;
  productSignIn: string;
  productSignInSuffix: string;
  productOutOfStockIndicator: string;
  productLowStockPrefix: string;
  productLowStockSuffix: string;
  productSizeError: string;
  productSavePrefix: string;
  // ProfilePage
  profileTitle: string;
  profileTabProfile: string;
  profileTabPassword: string;
  profileTabAddresses: string;
  profileFirstName: string;
  profileLastName: string;
  profileEmail: string;
  profileEmailHelp: string;
  profileUpdateSuccess: string;
  profileUpdateError: string;
  profileSaving: string;
  profileSaveChanges: string;
  profilePasswordMismatch: string;
  profilePasswordMinLength: string;
  profilePasswordChangeSuccess: string;
  profilePasswordIncorrect: string;
  profileUpdating: string;
  profileUpdatePassword: string;
  profileCurrentPassword: string;
  profileNewPassword: string;
  profileConfirmPassword: string;
  profilePasswordPlaceholder: string;
  profileNoAddresses: string;
  profileAddAddress: string;
  profileNewAddress: string;
  profileStreet: string;
  profileStreetPlaceholder: string;
  profileCity: string;
  profileState: string;
  profilePostalCode: string;
  profileCountry: string;
  profileCountryPlaceholder: string;
  profileSetDefault: string;
  profileAddressAdded: string;
  profileAddressAddError: string;
  profileAddressRemoveError: string;
  profileAddressSaving: string;
  profileAddressSave: string;
  profileAddressCancel: string;
  profileAddressRemoving: string;
  profileAddressRemove: string;
  profileAddressDefault: string;
  // OrderHistoryPage
  orderHistoryTitle: string;
  orderHistoryEmpty: string;
  orderHistoryStartShopping: string;
  orderHistoryOrderNumber: string;
  orderHistoryDate: string;
  orderHistoryItems: string;
  orderHistoryTotal: string;
  orderHistoryStatus: string;
  orderHistoryView: string;
  orderHistoryLoadError: string;
  orderHistoryItemSingular: string;
  orderHistoryItemPlural: string;
  // OrderConfirmationPage
  orderConfirmTitle: string;
  orderConfirmThanks: string;
  orderConfirmOrderPrefix: string;
  orderConfirmStatus: string;
  orderConfirmItems: string;
  orderConfirmSizePrefix: string;
  orderConfirmQtyPrefix: string;
  orderConfirmTotal: string;
  orderConfirmShippingAddress: string;
  orderConfirmViewHistory: string;
  orderConfirmContinueShopping: string;
  orderConfirmNotFound: string;
  orderConfirmViewAll: string;
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
    aboutTitle: 'About Premier Sport',
    aboutSubtitle: 'Your home for premium football gear',
    ourStory: 'Our Story',
    storyP1: "Premier Sport was founded with a simple mission: make top-quality football gear accessible to players at every level. Whether you're a Sunday league warrior or an aspiring professional, you deserve the best.",
    storyP2: "We stock kits, boots, accessories, and training equipment from the world's leading brands, curated by our team of passionate football enthusiasts.",
    statProducts: 'Products',
    statBrands: 'Brands',
    statCustomers: 'Happy customers',
    footerTagline: 'Your premier destination for football kits, boots, accessories, and equipment. Gear up and play like a champion.',
    footerShop: 'Shop',
    footerCompany: 'Company',
    footerAboutUs: 'About Us',
    footerMyAccount: 'My Account',
    footerRights: 'All rights reserved.',
    footerBuiltWith: 'Built with React + Spring Boot',
    loginWelcomeTitle: 'Welcome back',
    loginWelcomeSubtitle: 'Sign in to your account to continue',
    loginEmailLabel: 'Email address',
    loginEmailPlaceholder: 'you@example.com',
    loginPasswordLabel: 'Password',
    loginPasswordPlaceholder: '••••••••',
    loginHidePassword: 'Hide password',
    loginShowPassword: 'Show password',
    loginInvalidCredentials: 'Invalid email or password. Please try again.',
    loginSigningIn: 'Signing in...',
    loginSignIn: 'Sign in',
    loginNoAccount: "Don't have an account? ",
    loginSignUpLink: 'Sign up',
    registerTitle: 'Create an account',
    registerSubtitle: 'Join thousands of football fans',
    registerFirstNameLabel: 'First name',
    registerFirstNamePlaceholder: 'John',
    registerLastNameLabel: 'Last name',
    registerLastNamePlaceholder: 'Smith',
    registerEmailLabel: 'Email address',
    registerEmailPlaceholder: 'you@example.com',
    registerPasswordLabel: 'Password',
    registerPasswordPlaceholder: 'Min. 8 characters',
    registerHidePassword: 'Hide password',
    registerShowPassword: 'Show password',
    registerConfirmPasswordLabel: 'Confirm password',
    registerConfirmPasswordPlaceholder: '••••••••',
    registerPasswordMismatch: 'Passwords do not match.',
    registerPasswordTooShort: 'Password must be at least 8 characters long.',
    registerAccountExists: 'An account with this email already exists. Please sign in or use a different email.',
    registerFailed: 'Registration failed. Please try again.',
    registerCreating: 'Creating account...',
    registerCreate: 'Create account',
    registerHasAccount: 'Already have an account? ',
    registerSignInLink: 'Sign in',
    cartEmptyTitle: 'Your cart is empty',
    cartEmptyMessage: "Looks like you haven't added anything yet.",
    cartContinueShopping: 'Continue Shopping',
    cartPageTitle: 'Shopping Cart',
    cartNoImage: 'No image',
    cartSizePrefix: 'Size: ',
    cartEach: 'each',
    cartRemove: 'Remove',
    cartOrderSummary: 'Order Summary',
    cartSubtotalPrefix: 'Subtotal (',
    cartSubtotalSuffix: ' items)',
    cartDelivery: 'Delivery',
    cartTotal: 'Total',
    cartCheckout: 'Proceed to Checkout',
    checkoutTitle: 'Checkout',
    checkoutShippingAddress: 'Shipping Address',
    checkoutStreetLabel: 'Street',
    checkoutStreetPlaceholder: '123 Main St',
    checkoutCityLabel: 'City',
    checkoutStateLabel: 'State / County',
    checkoutPostalCodeLabel: 'Postal Code',
    checkoutCountryLabel: 'Country',
    checkoutProcessing: 'Processing...',
    checkoutContinue: 'Continue to Payment',
    checkoutPaymentMethod: 'Payment Method',
    checkoutVietQRScan: 'Scan with any banking app',
    checkoutBankLabel: 'Bank',
    checkoutBankValue: 'Vietcombank (VCB)',
    checkoutAccountLabel: 'Account number',
    checkoutAccountOwner: 'Account name',
    checkoutAmountLabel: 'Amount',
    checkoutContentLabel: 'Transfer note',
    checkoutMoMoScan: 'Scan with MoMo app',
    checkoutMoMoPhone: 'MoMo phone number',
    checkoutNameLabel: 'Name',
    checkoutPaymentNote: 'After successful transfer, press the button below to confirm your order.',
    checkoutPaymentError: 'Payment confirmation failed. Please try again or contact support.',
    checkoutConfirming: 'Confirming...',
    checkoutConfirmPayment: 'I have completed payment',
    checkoutCreateOrderError: 'Unable to create order. Please try again.',
    checkoutOrderSummary: 'Order Summary',
    checkoutSubtotal: 'Subtotal',
    checkoutShippingFee: 'Shipping fee',
    checkoutTotalLabel: 'Total',
    checkoutBackToCart: '← Back to cart',
    productsAll: 'All',
    productsNewest: 'Newest',
    productsPriceLow: 'Price: Low → High',
    productsPriceHigh: 'Price: High → Low',
    productsNameAsc: 'Name A → Z',
    productsAllTitle: 'All Products',
    productsProductSingular: 'product',
    productsProductPlural: 'products',
    productsSearchPlaceholder: 'Search products...',
    productsSearch: 'Search',
    productsSale: 'SALE',
    productsPrev: '← Prev',
    productsNext: 'Next →',
    productsNotFound: 'No products found',
    productsNoResultsPrefix: 'No results for "',
    productsNoResultsSuffix: '"',
    productsCheckBack: 'Check back soon for new arrivals',
    productsClearFilters: 'Clear filters',
    productErrorTitle: 'Something went wrong',
    productErrorMessage: 'Unable to load this product. Please try again.',
    productTryAgain: 'Try Again',
    productBack: '← Back to Products',
    productNotFound: 'Product not found',
    productNotFoundMessage: 'This product may have been removed or the link is incorrect.',
    productHome: 'Home',
    productSizeLabel: 'Size',
    productSelectedSize: 'Selected: ',
    productQuantityLabel: 'Quantity',
    productAdding: 'Adding...',
    productAdded: '✓ Added to Cart!',
    productAddFailed: 'Failed to add — try again',
    productOutOfStock: 'Out of Stock',
    productAddToCart: 'Add to Cart',
    productSignInPrefix: "You'll be asked to ",
    productSignIn: 'sign in',
    productSignInSuffix: ' to add items to your cart.',
    productOutOfStockIndicator: 'Out of stock',
    productLowStockPrefix: 'Only ',
    productLowStockSuffix: ' left in stock!',
    productSizeError: 'Please select a size before adding to cart.',
    productSavePrefix: 'SAVE £',
    profileTitle: 'My Account',
    profileTabProfile: 'Profile Info',
    profileTabPassword: 'Change Password',
    profileTabAddresses: 'Addresses',
    profileFirstName: 'First Name',
    profileLastName: 'Last Name',
    profileEmail: 'Email address',
    profileEmailHelp: 'Email cannot be changed.',
    profileUpdateSuccess: 'Profile updated successfully.',
    profileUpdateError: 'Failed to update profile. Please try again.',
    profileSaving: 'Saving...',
    profileSaveChanges: 'Save Changes',
    profilePasswordMismatch: 'New passwords do not match.',
    profilePasswordMinLength: 'Password must be at least 8 characters.',
    profilePasswordChangeSuccess: 'Password changed successfully.',
    profilePasswordIncorrect: 'Incorrect current password.',
    profileUpdating: 'Updating...',
    profileUpdatePassword: 'Update Password',
    profileCurrentPassword: 'Current Password',
    profileNewPassword: 'New Password',
    profileConfirmPassword: 'Confirm New Password',
    profilePasswordPlaceholder: '••••••••',
    profileNoAddresses: 'No saved addresses yet.',
    profileAddAddress: 'Add New Address',
    profileNewAddress: 'New Address',
    profileStreet: 'Street',
    profileStreetPlaceholder: '123 Main St',
    profileCity: 'City',
    profileState: 'State / County',
    profilePostalCode: 'Postal Code',
    profileCountry: 'Country',
    profileCountryPlaceholder: 'United Kingdom',
    profileSetDefault: 'Set as default address',
    profileAddressAdded: 'Address added.',
    profileAddressAddError: 'Failed to add address.',
    profileAddressRemoveError: 'Failed to remove address.',
    profileAddressSaving: 'Saving...',
    profileAddressSave: 'Save Address',
    profileAddressCancel: 'Cancel',
    profileAddressRemoving: 'Removing...',
    profileAddressRemove: 'Remove',
    profileAddressDefault: 'Default',
    orderHistoryTitle: 'Order History',
    orderHistoryEmpty: "You haven't placed any orders yet.",
    orderHistoryStartShopping: 'Start Shopping',
    orderHistoryOrderNumber: 'Order #',
    orderHistoryDate: 'Date',
    orderHistoryItems: 'Items',
    orderHistoryTotal: 'Total',
    orderHistoryStatus: 'Status',
    orderHistoryView: 'View',
    orderHistoryLoadError: 'Failed to load orders.',
    orderHistoryItemSingular: 'item',
    orderHistoryItemPlural: 'items',
    orderConfirmTitle: 'Order Confirmed!',
    orderConfirmThanks: 'Thank you for your purchase.',
    orderConfirmOrderPrefix: 'Order #',
    orderConfirmStatus: 'Status',
    orderConfirmItems: 'Items',
    orderConfirmSizePrefix: 'Size: ',
    orderConfirmQtyPrefix: '× ',
    orderConfirmTotal: 'Total',
    orderConfirmShippingAddress: 'Shipping Address',
    orderConfirmViewHistory: 'View Order History',
    orderConfirmContinueShopping: 'Continue Shopping',
    orderConfirmNotFound: 'Order not found.',
    orderConfirmViewAll: 'View all orders',
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
    aboutTitle: 'Về Premier Sport',
    aboutSubtitle: 'Điểm đến của bạn cho trang bị bóng đá cao cấp',
    ourStory: 'Câu Chuyện Của Chúng Tôi',
    storyP1: 'Premier Sport được thành lập với một sứ mệnh đơn giản: mang trang bị bóng đá chất lượng hàng đầu đến với người chơi ở mọi cấp độ. Dù bạn là chiến binh giải phong trào hay người chơi chuyên nghiệp đầy khát vọng, bạn xứng đáng được trang bị tốt nhất.',
    storyP2: 'Chúng tôi cung cấp bộ đồ, giày, phụ kiện và thiết bị tập luyện từ các thương hiệu hàng đầu thế giới, được tuyển chọn bởi đội ngũ những người đam mê bóng đá.',
    statProducts: 'Sản phẩm',
    statBrands: 'Thương hiệu',
    statCustomers: 'Khách hàng hài lòng',
    footerTagline: 'Điểm đến hàng đầu của bạn cho bộ đồ bóng đá, giày, phụ kiện và thiết bị. Trang bị và chơi như một nhà vô địch.',
    footerShop: 'Cửa Hàng',
    footerCompany: 'Công Ty',
    footerAboutUs: 'Về Chúng Tôi',
    footerMyAccount: 'Tài Khoản Của Tôi',
    footerRights: 'Bản quyền thuộc về Premier Sport.',
    footerBuiltWith: 'Xây dựng bằng React + Spring Boot',
    loginWelcomeTitle: 'Chào mừng trở lại',
    loginWelcomeSubtitle: 'Đăng nhập vào tài khoản của bạn để tiếp tục',
    loginEmailLabel: 'Địa chỉ email',
    loginEmailPlaceholder: 'ban@example.com',
    loginPasswordLabel: 'Mật khẩu',
    loginPasswordPlaceholder: '••••••••',
    loginHidePassword: 'Ẩn mật khẩu',
    loginShowPassword: 'Hiện mật khẩu',
    loginInvalidCredentials: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
    loginSigningIn: 'Đang đăng nhập...',
    loginSignIn: 'Đăng nhập',
    loginNoAccount: 'Chưa có tài khoản? ',
    loginSignUpLink: 'Đăng ký',
    registerTitle: 'Tạo tài khoản',
    registerSubtitle: 'Tham gia cùng hàng nghìn người hâm mộ bóng đá',
    registerFirstNameLabel: 'Tên',
    registerFirstNamePlaceholder: 'Nguyễn',
    registerLastNameLabel: 'Họ',
    registerLastNamePlaceholder: 'Văn A',
    registerEmailLabel: 'Địa chỉ email',
    registerEmailPlaceholder: 'ban@example.com',
    registerPasswordLabel: 'Mật khẩu',
    registerPasswordPlaceholder: 'Tối thiểu 8 ký tự',
    registerHidePassword: 'Ẩn mật khẩu',
    registerShowPassword: 'Hiện mật khẩu',
    registerConfirmPasswordLabel: 'Xác nhận mật khẩu',
    registerConfirmPasswordPlaceholder: '••••••••',
    registerPasswordMismatch: 'Mật khẩu không khớp.',
    registerPasswordTooShort: 'Mật khẩu phải có ít nhất 8 ký tự.',
    registerAccountExists: 'Tài khoản với email này đã tồn tại. Vui lòng đăng nhập hoặc sử dụng email khác.',
    registerFailed: 'Đăng ký thất bại. Vui lòng thử lại.',
    registerCreating: 'Đang tạo tài khoản...',
    registerCreate: 'Tạo tài khoản',
    registerHasAccount: 'Đã có tài khoản? ',
    registerSignInLink: 'Đăng nhập',
    cartEmptyTitle: 'Giỏ hàng của bạn trống',
    cartEmptyMessage: 'Có vẻ như bạn chưa thêm gì vào giỏ hàng.',
    cartContinueShopping: 'Tiếp tục mua sắm',
    cartPageTitle: 'Giỏ hàng',
    cartNoImage: 'Không có ảnh',
    cartSizePrefix: 'Cỡ: ',
    cartEach: 'mỗi cái',
    cartRemove: 'Xóa',
    cartOrderSummary: 'Tóm tắt đơn hàng',
    cartSubtotalPrefix: 'Tạm tính (',
    cartSubtotalSuffix: ' sản phẩm)',
    cartDelivery: 'Giao hàng',
    cartTotal: 'Tổng cộng',
    cartCheckout: 'Tiến hành thanh toán',
    checkoutTitle: 'Thanh toán',
    checkoutShippingAddress: 'Địa chỉ giao hàng',
    checkoutStreetLabel: 'Địa chỉ',
    checkoutStreetPlaceholder: '123 Nguyễn Huệ',
    checkoutCityLabel: 'Thành phố',
    checkoutStateLabel: 'Tỉnh / Quận',
    checkoutPostalCodeLabel: 'Mã bưu chính',
    checkoutCountryLabel: 'Quốc gia',
    checkoutProcessing: 'Đang xử lý…',
    checkoutContinue: 'Tiếp tục thanh toán',
    checkoutPaymentMethod: 'Phương thức thanh toán',
    checkoutVietQRScan: 'Quét mã bằng app ngân hàng bất kỳ',
    checkoutBankLabel: 'Ngân hàng',
    checkoutBankValue: 'Vietcombank (VCB)',
    checkoutAccountLabel: 'Số tài khoản',
    checkoutAccountOwner: 'Chủ tài khoản',
    checkoutAmountLabel: 'Số tiền',
    checkoutContentLabel: 'Nội dung',
    checkoutMoMoScan: 'Quét mã bằng ứng dụng MoMo',
    checkoutMoMoPhone: 'Số điện thoại MoMo',
    checkoutNameLabel: 'Tên',
    checkoutPaymentNote: 'Sau khi chuyển khoản thành công, nhấn nút bên dưới để xác nhận đơn hàng.',
    checkoutPaymentError: 'Xác nhận thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.',
    checkoutConfirming: 'Đang xác nhận…',
    checkoutConfirmPayment: 'Tôi đã hoàn tất thanh toán',
    checkoutCreateOrderError: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
    checkoutOrderSummary: 'Tóm tắt đơn hàng',
    checkoutSubtotal: 'Tạm tính',
    checkoutShippingFee: 'Phí vận chuyển',
    checkoutTotalLabel: 'Tổng cộng',
    checkoutBackToCart: '← Quay lại giỏ hàng',
    productsAll: 'Tất cả',
    productsNewest: 'Mới nhất',
    productsPriceLow: 'Giá: Thấp → Cao',
    productsPriceHigh: 'Giá: Cao → Thấp',
    productsNameAsc: 'Tên A → Z',
    productsAllTitle: 'Tất cả sản phẩm',
    productsProductSingular: 'sản phẩm',
    productsProductPlural: 'sản phẩm',
    productsSearchPlaceholder: 'Tìm kiếm sản phẩm...',
    productsSearch: 'Tìm kiếm',
    productsSale: 'KHUYẾN MÃI',
    productsPrev: '← Trước',
    productsNext: 'Tiếp →',
    productsNotFound: 'Không tìm thấy sản phẩm',
    productsNoResultsPrefix: 'Không có kết quả cho "',
    productsNoResultsSuffix: '"',
    productsCheckBack: 'Hàng mới sắp về, quay lại sau nhé',
    productsClearFilters: 'Xóa bộ lọc',
    productErrorTitle: 'Đã xảy ra lỗi',
    productErrorMessage: 'Không thể tải sản phẩm này. Vui lòng thử lại.',
    productTryAgain: 'Thử lại',
    productBack: '← Quay lại sản phẩm',
    productNotFound: 'Không tìm thấy sản phẩm',
    productNotFoundMessage: 'Sản phẩm này có thể đã bị xóa hoặc liên kết không đúng.',
    productHome: 'Trang chủ',
    productSizeLabel: 'Cỡ',
    productSelectedSize: 'Đã chọn: ',
    productQuantityLabel: 'Số lượng',
    productAdding: 'Đang thêm...',
    productAdded: '✓ Đã thêm vào giỏ!',
    productAddFailed: 'Thêm thất bại — thử lại',
    productOutOfStock: 'Hết hàng',
    productAddToCart: 'Thêm vào giỏ hàng',
    productSignInPrefix: 'Bạn sẽ được yêu cầu ',
    productSignIn: 'đăng nhập',
    productSignInSuffix: ' để thêm sản phẩm vào giỏ hàng.',
    productOutOfStockIndicator: 'Hết hàng',
    productLowStockPrefix: 'Chỉ còn ',
    productLowStockSuffix: ' trong kho!',
    productSizeError: 'Vui lòng chọn cỡ trước khi thêm vào giỏ hàng.',
    productSavePrefix: 'TIẾT KIỆM £',
    profileTitle: 'Tài khoản của tôi',
    profileTabProfile: 'Thông tin hồ sơ',
    profileTabPassword: 'Đổi mật khẩu',
    profileTabAddresses: 'Địa chỉ',
    profileFirstName: 'Tên',
    profileLastName: 'Họ',
    profileEmail: 'Địa chỉ email',
    profileEmailHelp: 'Không thể thay đổi email.',
    profileUpdateSuccess: 'Cập nhật hồ sơ thành công.',
    profileUpdateError: 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.',
    profileSaving: 'Đang lưu...',
    profileSaveChanges: 'Lưu thay đổi',
    profilePasswordMismatch: 'Mật khẩu mới không khớp.',
    profilePasswordMinLength: 'Mật khẩu phải có ít nhất 8 ký tự.',
    profilePasswordChangeSuccess: 'Đổi mật khẩu thành công.',
    profilePasswordIncorrect: 'Mật khẩu hiện tại không đúng.',
    profileUpdating: 'Đang cập nhật...',
    profileUpdatePassword: 'Cập nhật mật khẩu',
    profileCurrentPassword: 'Mật khẩu hiện tại',
    profileNewPassword: 'Mật khẩu mới',
    profileConfirmPassword: 'Xác nhận mật khẩu mới',
    profilePasswordPlaceholder: '••••••••',
    profileNoAddresses: 'Chưa có địa chỉ nào được lưu.',
    profileAddAddress: 'Thêm địa chỉ mới',
    profileNewAddress: 'Địa chỉ mới',
    profileStreet: 'Địa chỉ',
    profileStreetPlaceholder: '123 Đường Nguyễn Huệ',
    profileCity: 'Thành phố',
    profileState: 'Tỉnh / Quận',
    profilePostalCode: 'Mã bưu chính',
    profileCountry: 'Quốc gia',
    profileCountryPlaceholder: 'Việt Nam',
    profileSetDefault: 'Đặt làm địa chỉ mặc định',
    profileAddressAdded: 'Đã thêm địa chỉ.',
    profileAddressAddError: 'Thêm địa chỉ thất bại.',
    profileAddressRemoveError: 'Xóa địa chỉ thất bại.',
    profileAddressSaving: 'Đang lưu...',
    profileAddressSave: 'Lưu địa chỉ',
    profileAddressCancel: 'Hủy',
    profileAddressRemoving: 'Đang xóa...',
    profileAddressRemove: 'Xóa',
    profileAddressDefault: 'Mặc định',
    orderHistoryTitle: 'Lịch sử đơn hàng',
    orderHistoryEmpty: 'Bạn chưa đặt đơn hàng nào.',
    orderHistoryStartShopping: 'Bắt đầu mua sắm',
    orderHistoryOrderNumber: 'Đơn hàng #',
    orderHistoryDate: 'Ngày',
    orderHistoryItems: 'Sản phẩm',
    orderHistoryTotal: 'Tổng cộng',
    orderHistoryStatus: 'Trạng thái',
    orderHistoryView: 'Xem',
    orderHistoryLoadError: 'Không thể tải đơn hàng.',
    orderHistoryItemSingular: 'sản phẩm',
    orderHistoryItemPlural: 'sản phẩm',
    orderConfirmTitle: 'Đơn hàng đã được xác nhận!',
    orderConfirmThanks: 'Cảm ơn bạn đã mua hàng.',
    orderConfirmOrderPrefix: 'Đơn hàng #',
    orderConfirmStatus: 'Trạng thái',
    orderConfirmItems: 'Sản phẩm',
    orderConfirmSizePrefix: 'Cỡ: ',
    orderConfirmQtyPrefix: '× ',
    orderConfirmTotal: 'Tổng cộng',
    orderConfirmShippingAddress: 'Địa chỉ giao hàng',
    orderConfirmViewHistory: 'Xem lịch sử đơn hàng',
    orderConfirmContinueShopping: 'Tiếp tục mua sắm',
    orderConfirmNotFound: 'Không tìm thấy đơn hàng.',
    orderConfirmViewAll: 'Xem tất cả đơn hàng',
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
