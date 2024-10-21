import { Button } from "@/Components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Produk } from "@/types"
// import { Todo, TodoWithMethod } from "@/types"
import { useForm } from "@inertiajs/react"
import { useEffect, useState } from "react"
import { BsPencilSquare } from "react-icons/bs"


interface EditProduk {
    produkedit: Produk;
}
const Edit = ({ produkedit }: EditProduk) => {
    const [open, setOpen] = useState(false);
    const { put, data, setData, post, processing, errors, reset } = useForm({
        no_botol: produkedit.no_botol,
        nama_produk: produkedit.nama_produk,
        simbol: produkedit.simbol,
        stok: produkedit.stok,
        harga: produkedit.harga
    });

    useEffect(() => {
        setData({
            ...data,
            no_botol: produkedit.no_botol,
            nama_produk: produkedit.nama_produk,
            simbol: produkedit.simbol,
            stok: produkedit.stok,
            harga: produkedit.harga
        })
    }, [produkedit]);
    console.log(produkedit);
    const submit = (e: any) => {
        e.preventDefault();
        put(route('admin.produk.update', [produkedit]))
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size= "sm"
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
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            No Botol
                        </Label>
                        <Input
                            id="no_botol"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="no_botol"
                            value={data.no_botol}
                            onChange={(e) => setData("no_botol", e.target.value)}
                            placeholder="masukkan nomor botol"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nama produk
                        </Label>
                        <Input
                            id="nama_produk"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="nama_produk"
                            value={data.nama_produk}
                            onChange={(e) => setData("nama_produk", e.target.value)}
                            placeholder="masukkan nama produk"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Simbol
                        </Label>
                        <Input
                            id="simbol"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="simbol"
                            value={data.simbol}
                            onChange={(e) => setData("simbol", e.target.value)}
                            placeholder="masukkan simbol"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Harga
                        </Label>
                        <Input
                            id="harga"
                            // defaultValue="Pedro Duarte"
                            className="col-span-3"
                            name="harga"
                            value={data.harga}
                            onChange={(e) => setData("harga", e.target.value)}
                            placeholder="Masukkan harga"
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
    )
}
export default Edit;
