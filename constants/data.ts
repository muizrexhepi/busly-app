import { Ionicons } from '@expo/vector-icons';

export const SETTINGS_LINKS = [
  { 
    title: "Language", 
    icon: "language-outline" as keyof typeof Ionicons.glyphMap 
  },
  { 
    title: "Currency", 
    icon: "cash-outline" as keyof typeof Ionicons.glyphMap 
  },
  { 
    title: "Privacy", 
    icon: "lock-closed-outline" as keyof typeof Ionicons.glyphMap 
  },
  { 
    title: "Terms of Service", 
    icon: "document-text-outline" as keyof typeof Ionicons.glyphMap 
  },
];

export const SUPPORT_LINKS = [
  { title: "FAQs", icon: "help-circle-outline" as keyof typeof Ionicons.glyphMap },
      { title: "Contact Us", icon: "mail-outline" as keyof typeof Ionicons.glyphMap },
      { title: "Report an Issue", icon: "warning-outline" as keyof typeof Ionicons.glyphMap },
]

export const PROFILE_LINKS = [
  {
    title: "Personal Information",
    icon: "person-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/personal-info",
  },
  {
    title: "Payment Methods",
    icon: "card-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/payment-methods",
  },
  {
    title: "Travel Preferences",
    icon: "airplane-outline" as keyof typeof Ionicons.glyphMap,
    route: "/profile/travel-preferences",
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

