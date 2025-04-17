import React from "react";
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
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { LaporanPembelian, Pesanan, Todo } from "@/types";
import { useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";

interface DeletePesanan {
    pesanandelete: Pesanan;
}
const Delete = ({ pesanandelete }: DeletePesanan) => {
    const { delete: destroy, reset } = useForm({
        name: "",
    });

    const destroyPesanan = (id: number) => {
        destroy(route("staffpenjualan.pesanan.destroy", id), {
            onSuccess: () => reset(),
        });
    };
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline_red">
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
                        <AlertDialogAction
                            onClick={() => destroyPesanan(pesanandelete.id)}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Delete;
