import React, { PropsWithChildren } from "react";
import { InertiaLinkProps, Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    IconBrandProducthunt,
    IconDashboard,
    IconGrid4,
    IconMacbookAir,
    IconMacbookAirFill,
    IconNotes,
    IconPerson,
    IconSettings,
    IconStoreFill,
    IconToolbox,
} from "@irsyadadl/paranoid";

export function Aside() {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role;

    return (
        <ul className="grid items-center gap-1 px-4 text-md font-medium lg:px-4">
            <AsideLink
                active={route().current("admin.dashboard.index")}
                href={route("admin.dashboard.index")}
            >
                <IconDashboard />
                <span>Dashboard</span>
            </AsideLink>

            {role === "admin" && (
                <>
                    <AsideLink
                        active={route().current("admin.laporanpembelian.index")}
                        href={route("admin.laporanpembelian.index")}
                    >
                        <IconBrandProducthunt />
                        <span>Laporan Pembelian</span>
                    </AsideLink>

                    <AsideLink
                        active={route().current("admin.laporanpenjualan.index")}
                        href={route("admin.laporanpenjualan.index")}
                    >
                        <IconStoreFill />
                        <span>Laporan Penjualan</span>
                    </AsideLink>

                    <AsideLink
                        active={route().current("admin.produk.index")}
                        href={route("admin.produk.index")}
                    >
                        <IconBrandProducthunt />
                        <span>Produk</span>
                    </AsideLink>

                    <AsideLink
                        active={route().current("admin.supplier.index")}
                        href={route("admin.supplier.index")}
                    >
                        <IconToolbox />
                        <span>Supplier</span>
                    </AsideLink>
                </>
            )}

            {role === "staff_gudang" && (
                <>
                    <AsideLink
                        active={route().current("admin.rekap.index")}
                        href={route("staffgudang.rekap.index")}
                    >
                        <IconPerson />
                        <span>Rekap</span>
                    </AsideLink>

                    <AsideLink
                        active={route().current(
                            "staffgudang.laporanpembelian.index"
                        )}
                        href={route("staffgudang.laporanpembelian.index")}
                    >
                        <IconBrandProducthunt />
                        <span>Laporan Pembelian</span>
                    </AsideLink>
                </>
            )}

            {role === "staff_penjualan" && (
                <>
                    <AsideLink
                        active={route().current(
                            "staffpenjualan.pelanggan.index"
                        )}
                        href={route("staffpenjualan.pelanggan.index")}
                    >
                        <IconPerson />
                        <span>Data Pelanggan</span>
                    </AsideLink>

                    <AsideLink
                        active={route().current("staffpenjualan.pesanan.index")}
                        href={route("staffpenjualan.pesanan.index")}
                    >
                        <IconMacbookAirFill />
                        <span>Pesanan</span>
                    </AsideLink>
                </>
            )}
        </ul>
    );
}

interface AsideLinkProps extends InertiaLinkProps {
    className?: string;
    active?: boolean;
}

export function AsideLink({ className, active, ...props }: AsideLinkProps) {
    return (
        <li className="-mx-1">
            <Link
                className={cn(
                    active ? "font-extrabold bg-slate-300" : "",
                    "flex items-center [&>svg]:size-4 [&>svg]:stroke-[1.25] [&>svg]:mr-2 [&>svg]:-ml-1 hover:bg-slate-300 tracking-tight text-base, hover:text-foreground px-4 py-2 rounded-md"
                )}
                {...props}
            />
        </li>
    );
}

export function AsideLabel({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <li className="-mx-4">
            <span
                className={cn(
                    "flex items-center text-muted-foreground [&>svg]:w-4 [&>svg]:stroke-[1.25] [&>svg]:h-4 [&>svg]:mr-3 tracking-tight text-sm px-4 py-2 rounded-md",
                    className
                )}
            >
                {children}
            </span>
        </li>
    );
}
