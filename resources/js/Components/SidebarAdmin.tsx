import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Search,
    LayoutDashboardIcon,
    SquareGanttChart,
    Package,
    FileBadge2,
    Banknote,
    User,
    DatabaseBackupIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import LogoAdmin from "../../assets/img/logo.png";
import { FaBookBible } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";



const sidebarItems = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboardIcon />,
    },
    // {label: "Laporan Penjualan", href: "/admin/laporan_penjualan", icon: <SquareGanttChart />},
    { label: "Produk", href: "/admin/produk", icon: <BsFillBoxSeamFill size={20} />},
    { label: "Rekap", href: "/admin/rekap", icon: <FaBookBible size={20} />},
    { label: "Transaksi", href: "/admin/transaksi", icon: <Banknote /> },
    { label: "Admin", href: "/admin/admin", icon: <User /> },
    { label: "Backup", href: "/admin/backup", icon: <DatabaseBackupIcon /> },
];

const SidebarAdmin = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <aside className="w-64 p-4 hidden lg:flex flex-col top-0 gap-4 h-screen fixed left-0 bg-gray-100">
            <div className="flex items-center justify-center rounded-xl">
                <img src={LogoAdmin} className="h-[90%]" alt="" />
            </div>
            <div className="relative mb-1">
                {/* <Search className="absolute top-2.5 left-1.5 size-5 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Cari..."
                    className="pl-8 bg-gray-800/75 border-none text-gray-200 placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={handleSearch}
                /> */}
            </div>

            {/* <span className="text-gray-300 text-xs">Navigasi</span> */}
            <ul className="flex flex-col gap-3 text-sm font-medium">
                {sidebarItems
                    .filter((item) =>
                        item.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    )
                    .map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className={`flex items-center gap-2 p-2 rounded-lg  transform duration-100 ${window.location.pathname === item.href
                                        ? "bg-gray-200 font-semibold"
                                        : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
            </ul>
        </aside>
    );
};

export default SidebarAdmin;
