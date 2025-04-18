import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Supplier } from "@/types";
// import { Todo, TodoWithMethod } from "@/types"
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface EditSupplier {
    supplieredit: Supplier;
}
const Edit = ({ supplieredit }: EditSupplier) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, post, processing, errors, reset } = useForm({
        nama_supplier: supplieredit.nama_supplier,
        alamat: supplieredit.alamat,
        no_telp: supplieredit.no_telp,
    });

    useEffect(() => {
        setData({
            ...data,
            nama_supplier: supplieredit.nama_supplier,
            alamat: supplieredit.alamat,
            no_telp: supplieredit.no_telp,
        });
    }, [supplieredit]);
    console.log(supplieredit);

    const submit = (e: any) => {
        e.preventDefault();
        put(route("admin.supplier.update", supplieredit.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline_blue"
                    onClick={() => setOpen(true)}
                >
                    <BsPencilSquare />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nama Supplier
                        </Label>
                        <Input
                            id="nama_supplier"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="nama_supplier"
                            value={data.nama_supplier}
                            onChange={(e) =>
                                setData("nama_supplier", e.target.value)
                            }
                            placeholder="masukkan nama supplier"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Alamat
                        </Label>
                        <Input
                            id="alamat"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="alamat"
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                            placeholder="masukkan alamat"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            No_Telp
                        </Label>
                        <Input
                            id="no_telp"
                            defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="no_telp"
                            value={data.no_telp}
                            onChange={(e) =>
                                setData(
                                    "no_telp",
                                    parseFloat(e.target.value) || 0
                                )
                            } // Parsing string to number, default to 0 if NaN
                            placeholder="Masukkan no_telp"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        disabled={processing}
                        onClick={submit}
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default Edit;
