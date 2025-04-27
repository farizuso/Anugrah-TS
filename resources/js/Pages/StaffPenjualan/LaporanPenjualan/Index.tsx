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
import { DataTable } from "@/Components/DataTable";
import { PageProps, Pesanan, Produk } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PenjualanColumns } from "./PenjualanColumn";

interface PesananProps {
    posts: Pesanan[];
}
const TabsDemo = ({ posts }: PesananProps) => {
    return (
        <AdminLayout>
            <DataTable data={posts} columns={PenjualanColumns} />
        </AdminLayout>
    );
};

export default TabsDemo;
