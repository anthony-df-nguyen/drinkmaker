interface NavLinks {
  name: string;
  href: string;
  icon: string;
}

const links: NavLinks[] = [
  {
    name: "Drinks",
    href: "/",
    icon: "M9 3h6M9 3v6l-4 9a1 1 0 0 0 .9 1.5h12.2a1 1 0 0 0 .9-1.5L15 9V3",
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    icon: "M3 6h18M3 12h12M3 18h8",
  },
];

export type { NavLinks };
export { links };
