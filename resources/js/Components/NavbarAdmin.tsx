import { PageProps } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import LogoAdmin from "../../assets/img/logo.png";
import { LogOut, Menu, User } from "lucide-react";
const NavbarAdmin = () => {
    const user = usePage<PageProps>().props.auth.user;

    return (
        <nav className=" w-full h-20 bg-gray-900 lg:bg-gray-100 items-center top-0 fixed flex p-4 justify-between lg:justify-end">
            <div className="flex items-center gap-1 lg:hidden">
                <Menu className="w-6 h-6 text-gray-400" />
                <img src={LogoAdmin} className="w-44" alt="" />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className=" items-center gap-3  cursor-pointer flex">
                        <img
                            className="w-9 h-9 rounded-full"
                            src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`}
                            alt=""
                        />
                        <div className=" flex-col w-auto hidden md:flex">
                            <span className=" text-sm font-semibold line-clamp-1 text-white lg:text-black">
                                {user.name}
                            </span>
                            <span className="text-xs font-medium text-gray-400 ">
                                {user.email}
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
        </nav>
    );
};

export default NavbarAdmin;
