"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import logo from "../../../public/logo.svg";
import { ModeToggle } from "../toggle";

import { Profile } from "./components/Avatar";

export const Navbar = () => {
  const path = usePathname();

  return (
    <div className="border-b ">
      <div className="flex justify-between items-center pb-2">
        <div className="flex gap-2 items-center">
          <Image alt="logo" src={logo} className="w-4 h-4" />
          <span className="font-bold">reflectify</span>
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <Profile />
        </div>
      </div>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/boards" legacyBehavior passHref>
              <NavigationMenuLink
                active={path.includes("/boards")}
                className={navigationMenuTriggerStyle()}
              >
                Quadros
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
