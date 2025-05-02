import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import SectionTitle from "@/Components/section-title";
import { DollarSign, CreditCard, Activity } from "lucide-react";
import BarChart from "@/Layouts/partials/aside/BarChart";
import PageTitle from "@/Layouts/partials/aside/PageTitle";
import { LowStock, MonthlySales, PageProps } from "@/types";

const Dashboard = () => {
    const {
        auth,
        totalRevenue = 0,
        totalPurchases = 0,
        totalSales = 0,
        totalStock = 0,
        recentSales = [],
        monthlySales = [],
        lowStockProducts = [],
    } = usePage<
        PageProps & {
            totalRevenue: number;
            totalPurchases: number;
            totalSales: number;
            totalStock: number;
            recentSales: {
                name: string;
                phone: string;
                totalAmount: string;
            }[];
            monthlySales: MonthlySales[];
            lowStockProducts: LowStock[];
        }
    >().props;

    const cardData = [
        {
            label: "Total Revenue",
            amount: `Rp ${(totalRevenue ?? 0).toLocaleString("id-ID")}`,
            description: "Total dari semua penjualan",
            icon: DollarSign,
        },
        {
            label: "Purchases",
            amount: `${totalPurchases ?? 0}`,
            description: "Jumlah pembelian dari supplier",
            icon: CreditCard,
        },
        {
            label: "Sales",
            amount: `${totalSales ?? 0}`,
            description: "Jumlah penjualan ke pelanggan",
            icon: CreditCard,
        },
        {
            label: "Total Stock",
            amount: `${totalStock ?? 0}`,
            description: "Jumlah stok saat ini",
            icon: Activity,
        },
    ];
    console.log("📊 monthlySales:", monthlySales);

    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <Card>
                <SectionTitle
                    title="Dashboard"
                    description={`Hi ${auth.user.name}, you are now logged in.`}
                />

                <div className="flex flex-col gap-5 w-full">
                    <PageTitle title="" />

                    {/* Cards Section */}
                    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
                        {cardData.map((d, i) => (
                            <Card key={i}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {d.label}
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {d.amount}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {d.description}
                                            </p>
                                        </div>
                                        <d.icon className="w-6 h-6 text-gray-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    <section>
                        <Card>
                            <CardContent className="flex flex-col gap-4">
                                <section>
                                    <p>Stok Terendah</p>
                                    <p className="text-sm text-gray-400">
                                        Produk dengan stok tersisa paling
                                        sedikit.
                                    </p>
                                </section>
                                {lowStockProducts.map((item, i) => (
                                    <div key={i} className="border-b pb-2 mb-2">
                                        <p className="font-semibold">
                                            {item.nama}
                                        </p>
                                        <p className="text-sm text-red-600">
                                            Sisa: {item.stok} unit
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>

                    {/* Overview & Top Customers */}
                    <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
                        <Card>
                            <CardContent>
                                <p className="text-sm text-gray-400">
                                    Grafik Penjualan Bulanan
                                </p>
                                <BarChart data={monthlySales} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex flex-col gap-4">
                                <section>
                                    <p>Pelanggan Terbaik</p>
                                    <p className="text-sm text-gray-400">
                                        Pelanggan dengan pembelian terbanyak.
                                    </p>
                                </section>
                                {(recentSales ?? []).map((d, i) => (
                                    <div key={i} className="border-b pb-2 mb-2">
                                        <p className="font-semibold">
                                            {d.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            HP: {d.phone}
                                        </p>
                                        <p className="text-sm text-green-600 font-semibold">
                                            {d.totalAmount}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </Card>
        </AdminLayout>
    );
};

export default Dashboard;
