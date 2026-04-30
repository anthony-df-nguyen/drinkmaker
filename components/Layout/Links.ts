import { IconType } from "react-icons/lib";
import { TbGlassCocktail } from "react-icons/tb";
import { FaRegLemon, FaRegCircleUser } from "react-icons/fa6";
interface NavLinks {
  name: string;
  href: string;
  icon: IconType;
}

const links: NavLinks[] = [
  {
    name: "Drinks",
    href: "/",
    icon: TbGlassCocktail,
  },
  {
    name: "Ingredients",
    href: "/ingredients",
    icon: FaRegLemon,
  },
    {
    name: "My Profile",
    href: "/profile",
     icon: FaRegCircleUser,
  },
];

export type { NavLinks };
export { links };
