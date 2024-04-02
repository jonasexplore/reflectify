"use client";

import Image from "next/image";

import logo from "../../../public/logo.svg";
import { ModeToggle } from "../toggle";

import { Profile } from "./components/Avatar";
import { NavigationMenuHeader } from "./components/NavigationMenu";

type Props = {
  hideNavigationMenu?: boolean;
};

export const Navbar = ({ hideNavigationMenu = false }: Props) => {
  return (
    <div className="border-b">
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

      {!hideNavigationMenu && <NavigationMenuHeader />}
    </div>
  );
};
