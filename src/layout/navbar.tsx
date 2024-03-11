"use client";
import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between px-5 py-2 bg-gray-500">
      <Link href="/" className="text-black mt-2">
        Trial-Test-Ryuta
      </Link>
      <ul className="flex">
        <li className="mt-2">
          <Link href="/swap" className="text-black ">
            Swap
          </Link>
        </li>
        <li className="mt-2 ml-5">
          <Link href="/tokens" className="text-black ">
            Tokens
          </Link>
        </li>
        <li className="ml-5">
          <ConnectButton />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;