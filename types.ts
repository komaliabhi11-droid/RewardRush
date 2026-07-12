export interface BrandingConfig {
  appName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  supportEmail: string;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export interface AddressDetails {
  line: string;
  state: string;
}

export interface PayoutAccounts {
  upiId: string;
  redeemEmail: string;
}

export interface Transaction {
  id: string;
  uid: string;
  amount: number;
  type: string;
  description: string;
  timestamp: number;
  status: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  rewardSpins: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: number;
}
