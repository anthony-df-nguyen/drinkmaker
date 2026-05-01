import { IconType } from "react-icons/lib";
import { BiSolidDrink } from "react-icons/bi";
import { FaRegLemon, FaRegUser } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";

interface NavLinks {
  name: string;
  href?: string;
  icon: IconType;
  requiresAuth?: boolean;
  guestOnly?: boolean;
  action?: "signIn";
}

const links: NavLinks[] = [
  {
    name: "Drinks",
    href: "/",
    icon: BiSolidDrink,
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    icon: FaRegLemon,
  },
  {
    name: "My Profile",
    href: "/profile",
    icon: FaRegUser,
    requiresAuth: true,
  },
  {
    name: "Sign In",
    icon: FiLogIn,
    guestOnly: true,
    action: "signIn",
  },
];

export type { NavLinks };
export { links };
