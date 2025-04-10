import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import { LaporanPembelian, Todo } from '@/types'
import { useForm } from '@inertiajs/react'
import { FaTrash } from "react-icons/fa";



interface DeleteLaporanPembelian {
    pembeliandelete:LaporanPembelian;
}
const Delete = ({pembeliandelete}:DeleteLaporanPembelian) => {

    const { delete: destroy ,data, setData, post, processing, errors, reset } = useForm({
        name: "",
    })

    const destroyPembelian = (id: number) => {
        destroy(route("admin.pembelian.destroy", id), {
            onSuccess: () => reset(),
        });
    }
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="red">
                        <FaTrash />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete it permanently?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => destroyPembelian(pembeliandelete.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Delete
