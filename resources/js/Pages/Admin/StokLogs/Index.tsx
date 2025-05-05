import React from "react";
import { PageProps } from "@/types";
// asumsi kamu sudah punya komponen DataTable
import { StokLog, StokLogsColumns } from "./StokLogsColumn";
import { DataTable } from "@/Components/DataTable";
import AdminLayout from "@/Layouts/AdminLayout";

interface StokLogsProps extends PageProps {
    stokLogs: {
        data: StokLog[];
        links: any;
    };
}

export default function Index({ stokLogs }: StokLogsProps) {
    return (
        <AdminLayout>
            <DataTable columns={StokLogsColumns} data={stokLogs.data} />
        </AdminLayout>
    );
}
