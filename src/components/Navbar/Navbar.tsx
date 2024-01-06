"use client";

import Image from "next/image";
import { ModeToggle } from "../Toggle";
import { Avatar } from "./components/Avatar";
import logo from "../../../public/logo.svg";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center ">
      <div className="flex gap-2 items-center">
        <Image alt="logo" src={logo} className="w-4 h-4" />
        <span className="font-bold">reflectify</span>
      </div>
      <strong>Team Board</strong>
      <div className="flex gap-4">
        <ModeToggle />
        <Avatar />
      </div>
    </div>
  );
};
