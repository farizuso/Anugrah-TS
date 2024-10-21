/** @format */

import "../../resources/css/app.css"; // Ensure this file exists in the correct location.
import { cn } from "@/lib/utils"; // Ensure utils are imported correctly.
import SideNavbar from "./partials/aside/SideBar";
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { LogOut, User } from "lucide-react";
import { IconHamburger } from '@irsyadadl/paranoid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import Toastify from '@/Components/Toastify';
import { ApplicationLogo } from '@/Components/application-logo';
import { PageProps } from '@/types';

export default function RootLayout({
  children,
  className // Adding className as props if needed.
}: {
  children: React.ReactNode;
  className?: string; // className is optional.
}) {
  const { auth, flash } = usePage<PageProps>().props;

  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (flash?.success) {
      toast.success(flash.success, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [flash]);

  return (
    <html lang="en">
      <Head title="Admin Panel" />
      <body
        className={cn(
          "min-h-screen w-full bg-white text-black flex", // Default layout properties.
          className, // Adding extra className from props, if any.
          {
            "debug-screens": process.env.NODE_ENV === "development" // Add class `debug-screens` in development mode.
          }
        )}
      >
        {/* Sidebar (hidden on small screens, visible on larger screens) */}
        <aside className="hidden md:flex">
          <SideNavbar />
        </aside>

        {/* Mobile Sheet for Sidebar */}
        <Sheet>
          <SheetTrigger className='lg:hidden'>
            <IconHamburger className='size-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col p-0'>
            <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
              <Link href='/' className='flex items-center gap-2 font-semibold'>
                <ApplicationLogo className='size-6 fill-foreground' />
                <span>Acme Inc</span>
              </Link>
            </div>
            <SideNavbar />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="flex h-14 items-center justify-between lg:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="flex lg:hidden">
              <SheetTrigger>
                <IconHamburger className='size-5' />
              </SheetTrigger>
            </div>
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="items-center gap-3 cursor-pointer flex">
                  <img
                    className="w-9 h-9 rounded-full"
                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${auth.user.name}`}
                    alt="User Avatar"
                  />
                  <div className="flex-col w-auto hidden md:flex">
                    <span className="text-sm font-semibold line-clamp-1 text-white lg:text-black">
                      {auth.user.name}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {auth.user.email}
                    </span>
                  </div>
                  <svg
                    className="hidden md:block ml-2 text-white lg:text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m7 10 5 5 5-5"
                    ></path>
                  </svg>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/siswa/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href={route("logout")} method="post">
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Main Page Content */}
          <main className="p-8 w-full flex-1">
            {flash?.success && <Toastify />}
            {flash?.error && <Toastify />}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
