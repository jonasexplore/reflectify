import Image from "next/image";
import Link from "next/link";

import logo from "../../../../../public/logo.svg";
import { ModeToggle } from "../toggle";

import { Profile } from "./components/Avatar";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image alt="logo" src={logo} className="w-4 h-4" />
        <span className="font-bold">reflectify</span>
      </div>
      <div className="flex gap-4">
        <Link
          href="/boards"
          className="text-sm font-bold flex gap-1 items-center"
        >
          Meus quadros
        </Link>
        <ModeToggle />
        <Profile />
      </div>
    </div>
  );
};
