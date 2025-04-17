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
import { LaporanPembelian, Todo } from "@/types";
import { useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";

interface DeleteLaporanPembelian {
    pembeliandelete: LaporanPembelian;
}
const Delete = ({ pembeliandelete }: DeleteLaporanPembelian) => {
    const { delete: destroy, reset } = useForm({
        name: "",
    });

    const destroyPembelian = (id: number) => {
        destroy(route("admin.laporanpembelian.destroy", id), {
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
                            onClick={() => destroyPembelian(pembeliandelete.id)}
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
