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
import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";

interface EditSupplier {
    supplieredit: Supplier;
}

const Edit = ({ supplieredit }: EditSupplier) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, processing, errors } = useForm({
        nama_supplier: supplieredit.nama_supplier,
        alamat: supplieredit.alamat,
        no_telp: supplieredit.no_telp,
    });

    useEffect(() => {
        setData({
            nama_supplier: supplieredit.nama_supplier,
            alamat: supplieredit.alamat,
            no_telp: supplieredit.no_telp,
        });
    }, [supplieredit]);

    const submit = (e: React.FormEvent) => {
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Data Supplier</DialogTitle>
                    <DialogDescription>
                        Masukkan data supplier
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    {/* input nama supplier */}
                    <div className="grid gap-2">
                        <Label htmlFor="nama_supplier">Nama Supplier</Label>
                        <Input
                            id="nama_supplier"
                            name="nama_supplier"
                            value={data.nama_supplier}
                            onChange={(e) =>
                                setData("nama_supplier", e.target.value)
                            }
                            placeholder="masukkan nama supplier"
                        />
                    </div>

                    {/* input alamat */}
                    <div className="grid gap-2">
                        <Label htmlFor="alamat">Alamat</Label>
                        <Input
                            id="alamat"
                            name="alamat"
                            value={data.alamat}
                            onChange={(e) => setData("alamat", e.target.value)}
                            placeholder="masukkan alamat"
                        />
                    </div>

                    {/* input no_telp */}
                    <div className="grid gap-2">
                        <Label htmlFor="no_telp">No Telp</Label>
                        <Input
                            id="no_telp"
                            name="no_telp"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={data.no_telp}
                            onChange={(e) =>
                                setData(
                                    "no_telp",
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="Masukkan no_telp"
                        />
                        {errors.no_telp && (
                            <p className="text-sm text-red-600">
                                {errors.no_telp}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default Edit;
