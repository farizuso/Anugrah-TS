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
import { Produk, Rekap, Supplier, Todo } from "@/types";
import { useForm } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";

interface DeleteSupplier {
    supplierdelete: Supplier;
}

const Delete = ({ supplierdelete }: DeleteSupplier) => {
    const {
        delete: destroy,
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: "",
    });

    const DestroySupplier = (id: number) => {
        destroy(route("admin.supplier.destroy", id), {
            onSuccess: () => reset(),
        });
    };
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size={"sm"} variant="outline_red">
                        <FaTrash />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi</AlertDialogTitle>
                        <AlertDialogDescription>
                            apakah anda ingin menghapus data ini ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => DestroySupplier(supplierdelete.id)}
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
