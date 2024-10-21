import { Avatar, AvatarImage } from '@/Components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconHamburger } from '@irsyadadl/paranoid';
import React, { useEffect } from 'react';
import { ApplicationLogo } from '@/Components/application-logo';
import { PageProps } from '@/types';
import { Aside } from '@/Layouts/partials/aside/aside';
import { toast } from 'react-toastify';
import { LogOut, Menu, User } from "lucide-react";
import Toastify from '@/Components/Toastify';

const AdminLayout = ({ title, children }: { title?: string; children: React.ReactNode }) => {
    const { auth } = usePage<PageProps>().props;
    const { flash } = usePage<PageProps>().props;
    useEffect(() => {
        if (flash && flash?.error) {
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
        } else if (flash && flash?.success) {
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
        <>
            <Head title={title} />
            {flash?.success && <Toastify />}
            {flash?.error && <Toastify />}
            <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
                <div className='hidden border-r bg-muted/40 md:block'>
                    <div className='flex h-full max-h-screen flex-col gap-2'>
                        <div className='flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6'>
                            <Link href='/' className='flex items-center gap-2 font-semibold'>
                                <ApplicationLogo className='size-6 fill-foreground' />
                                <span className=''>Acme Inc</span>
                            </Link>
                        </div>
                        <div className='flex-1 py-1'>
                            <Aside />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <header className='flex h-14 items-center justify-between lg:justify-end gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
                        <Sheet>
                            <SheetTrigger className='lg:hidden'>
                                <IconHamburger className='size-5' />
                                <span className='sr-only'>Toggle navigation menu</span>
                            </SheetTrigger>
                            <SheetContent side='left' className='flex flex-col p-0'>
                                <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
                                    <Link href='/' className='flex items-center gap-2 font-semibold'>
                                        <ApplicationLogo className='size-6 fill-foreground' />
                                        <span className=''>Acme Inc</span>
                                    </Link>
                                </div>
                                <div className='-mt-2'>
                                    <Aside />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className=" items-center gap-3  cursor-pointer flex">
                        <img
                            className="w-9 h-9 rounded-full"
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${auth.user.name}`}
                            alt=""
                        />
                        <div className=" flex-col w-auto hidden md:flex">
                            <span className=" text-sm font-semibold line-clamp-1 text-white lg:text-black">
                                {auth.user.name}
                            </span>
                            <span className="text-xs font-medium text-gray-400 ">
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
                                d="m7 10l5 5m0 0l5-5"
                            ></path>
                        </svg>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 bg-white">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href="/siswa/profile">
                            <DropdownMenuItem className=" cursor-pointer">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <Link href={route("logout")} method="post">
                        <DropdownMenuItem className=" cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
                    </header>
                    <main className=' min-w-full flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>{children}</main>
                </div>
            </div>
        </>
    );
}

export default AdminLayout

