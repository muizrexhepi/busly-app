import { environment } from '@/environment';
import { Ionicons } from '@expo/vector-icons';

export const SETTINGS_LINKS = [
  { 
    title: "Language", 
    icon: "language-outline" as keyof typeof Ionicons.glyphMap,
    url:'/settings/language',
    openWeb:false,
  },
  { 
    title: "Currency", 
    icon: "cash-outline" as keyof typeof Ionicons.glyphMap,
    url:'/settings/currency',
    openWeb:false,
  },
  { 
    title: "Privacy", 
    icon: "lock-closed-outline" as keyof typeof Ionicons.glyphMap,
    url:`${environment.base_url}/legal/privacy-policy`,
    openWeb:true,
  },
  { 
    title: "Terms of Service", 
    icon: "document-text-outline" as keyof typeof Ionicons.glyphMap,
    url:`${environment.base_url}/legal/terms-of-service`,
    openWeb:true,
  },
];

export const SUPPORT_LINKS = [
       { title: "FAQs", icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap,url:`${environment.base_url}/help` },
      { title: "Contact Us", icon: "mail-outline" as keyof typeof Ionicons.glyphMap,url:`${environment.base_url}/help/contact-support` },
      { title: "Report an Issue", icon: "warning-outline" as keyof typeof Ionicons.glyphMap,url:`${environment.base_url}/help/report-an-issue` },
]

export const PROFILE_LINKS = [
  {
    title: "Personal Information",
    icon: "person-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/personal-information",
  },
  {
    title: "Payment Methods",
    icon: "card-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/payment-methods",
  },
  {
    title: "Notifications",
    icon: "notifications-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/notifications",
  },
  {
    title: "Settings",
    icon: "settings-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/settings",
    sublinks: SETTINGS_LINKS,
  },
  {
    title: "Help & Support",
    icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/support",
    sublinks: SUPPORT_LINKS,
  },
];

export enum RECENT_STATIONS {
  FROM = 'recentFromStations',
  TO = 'recentToStations'
}
