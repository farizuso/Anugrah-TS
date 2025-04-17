// File: resources/js/Pages/LaporanPembelian/TabsDemo.tsx

import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import React, { FormEventHandler, useEffect } from "react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { LaporanDataTable } from "@/Components/LaporanDataTable";
import { Produk, Supplier, LaporanPembelian, PageProps, User } from "@/types";
import { DataTable } from "@/Components/DataTable";
import { KonfirmasiColumns } from "./KonfirmasiColumn";

interface LaporanPembelianProps {
    posts: LaporanPembelian[];
    produks: Produk[];
    suppliers: Supplier[];
}

const TabsDemo = ({ posts, produks, suppliers }: LaporanPembelianProps) => {
    return (
        <AdminLayout>
            <DataTable data={posts} columns={KonfirmasiColumns} />
        </AdminLayout>
    );
};

export default TabsDemo;
