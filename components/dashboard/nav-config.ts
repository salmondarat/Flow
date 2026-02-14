export interface NavItem {
  name: string;
  href: string;
  icon: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const ADMIN_NAV: NavSection[] = [
  {
    label: "Main Menu",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
      { name: "Active Builds", href: "/admin/orders", icon: "handyman" },
      { name: "Estimations", href: "/admin/orders", icon: "request_quote" },
      { name: "Inventory", href: "/admin/analytics", icon: "inventory_2" },
    ],
  },
  {
    label: "Team",
    items: [
      { name: "Clients", href: "/admin/clients", icon: "engineering" },
      { name: "Messages", href: "/admin/messages", icon: "schedule" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { name: "Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];

export const CLIENT_NAV: NavSection[] = [
  {
    label: "Menu",
    items: [
      { name: "Dashboard", href: "/client/dashboard", icon: "dashboard" },
      { name: "My Orders", href: "/client/orders", icon: "shopping_cart" },
      { name: "Profile", href: "/client/profile", icon: "person" },
      { name: "Settings", href: "/client/settings", icon: "settings" },
    ],
  },
];
