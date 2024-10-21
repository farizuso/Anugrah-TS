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
import { Produk, Rekap, Stok, Todo } from '@/types'
import { useForm } from '@inertiajs/react'
import { FaTrash } from "react-icons/fa";

interface DeleteStok {
    stokdelete: Stok;
}

const Deletestok = ({stokdelete}:DeleteStok) => {

    const { delete: destroy ,data, setData, post, processing, errors, reset } = useForm({
        name: "",
    });

    const DeleteStok = (id: number) => {
        destroy(route("admin.stok.destroy", id), {
            onSuccess: () => reset(),
        });
    };
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size={'sm'} variant="outline_red">
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
                        <AlertDialogAction onClick={() => DeleteStok(stokdelete.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default Deletestok


