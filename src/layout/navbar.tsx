"use client";
import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const Navbar: React.FC = () => {
  const onLogout = () => {
    signOut()
  }
  const { data: session } = useSession()
  const [show, setShow] = React.useState(false)
  return (
    <>
      {
        session ? (
          <nav className="flex justify-between px-5 py-2 bg-[#8fa2c7] sticky top-0">
            <Link href="/" className="text-black mt-2">
              Trial-Test-Ryuta
            </Link>
            <ul className="flex">
              <div className="lg:hidden relative">
                <button className="navbar-burger flex items-center text-black-600 p-3" onClick={() => setShow(item => !item)}>
                  <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Mobile menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                  </svg>
                </button>
                {
                  show && (
                    <ul className="absolute bg-[#8fa2c7] w-[150px] right-[10px]">
                      <li className="mt-2 text-center">
                        <Link href="#" className="text-black" onClick={() => onLogout()}>
                          Logout
                        </Link>
                      </li>
                      {/* <li className="mt-2 text-center" onClick={() => setShow(false)}>
                        <Link href="/uniswap" className="text-black ">
                          Swap
                        </Link>
                      </li> */}
                      <li className="mt-2 text-center" onClick={() => setShow(false)}>
                        <Link href="/uniswaphook" className="text-black ">
                          SwapHook
                        </Link>
                      </li>
                      <li className="mt-2 text-center" onClick={() => setShow(false)}>
                        <Link href="/tokens" className="text-black ">
                          Tokens
                        </Link>
                      </li>
                    </ul>
                  )
                }
              </div>
              <li className="mt-2 hidden lg:block">
                <Link href="#" className="text-black " onClick={() => onLogout()}>
                  Logout
                </Link>
              </li>
              {/* <li className="mt-2 ml-5 hidden lg:block">
                <Link href="/uniswap" className="text-black ">
                  Swap
                </Link>
              </li> */}
              <li className="mt-2 ml-5 hidden lg:block" onClick={() => setShow(false)}>
                <Link href="/uniswaphook" className="text-black ">
                  SwapHook
                </Link>
              </li>
              <li className="mt-2 ml-5 hidden lg:block">
                <Link href="/tokens" className="text-black ">
                  Tokens
                </Link>
              </li>
              <li className="ml-5">
                <ConnectButton />
              </li>
            </ul>
          </nav>
        ) : (
          <nav className="flex justify-between px-5 py-2 bg-[#8fa2c7] sticky top-0">
            <Link href="/" className="text-black mt-2">
              Trial-Test-Ryuta
            </Link>
            <ul className="flex">
              <div className="lg:hidden relative">
                <button className="navbar-burger flex items-center text-black-600 p-3" onClick={() => setShow(item => !item)}>
                  <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Mobile menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                  </svg>
                </button>
                {
                  show && (
                    <ul className="absolute bg-[#8fa2c7] w-[150px] right-[10px] ">
                      <li className="mt-2 text-center" onClick={() => setShow(false)}>
                        <Link href="/login" className="text-black ">
                          Login
                        </Link>
                      </li>
                      <li className="mt-2 text-center" onClick={() => setShow(false)}>
                        <Link href="/register" className="text-black ">
                          Register
                        </Link>
                      </li>
                    </ul>
                  )
                }
              </div>
              <li className="mt-2 ml-5 hidden lg:block">
                <Link href="/login" className="text-black ">
                  Login
                </Link>
              </li>
              <li className="mt-2 ml-5 hidden lg:block">
                <Link href="/register" className="text-black ">
                  Register
                </Link>
              </li>
            </ul>
          </nav>
        )
      }
    </>
  )
}

export default Navbar;