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
import { PageProps, Produk } from "@/types";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProdukColumns } from "./ProdukColumn";

interface ProdukProps {
    posts: Produk[];
}
const TabsDemo = ({ posts }: ProdukProps) => {
    return (
        <AdminLayout>
            <DataTable data={posts} columns={ProdukColumns} />
        </AdminLayout>
    );
};

export default TabsDemo;
