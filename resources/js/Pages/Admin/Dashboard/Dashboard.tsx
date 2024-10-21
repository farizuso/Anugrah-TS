import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import SectionTitle from "@/Components/section-title";
import { PageProps } from "@/types";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import BarChart from "@/Layouts/partials/aside/BarChart";
import SalesCard, { SalesProps } from "@/Layouts/partials/aside/SalesCard";
import PageTitle from "@/Layouts/partials/aside/PageTitle";

// Data for the cards
const cardData = [
    {
        label: "Total Revenue",
        amount: "$45,231.89",
        description: "+20.1% from last month",
        icon: DollarSign,
    },
    {
        label: "Subscriptions",
        amount: "+2350",
        description: "+180.1% from last month",
        icon: Users,
    },
    {
        label: "Sales",
        amount: "+12,234",
        description: "+19% from last month",
        icon: CreditCard,
    },
    {
        label: "Active Now",
        amount: "+573",
        description: "+201 since last hour",
        icon: Activity,
    },
];

// Data for the user sales
const userSalesData: SalesProps[] = [
    {
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        saleAmount: "+$1,999.00",
    },
    {
        name: "Jackson Lee",
        email: "isabella.nguyen@email.com",
        saleAmount: "+$1,999.00",
    },
    {
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        saleAmount: "+$39.00",
    },
    {
        name: "William Kim",
        email: "will@email.com",
        saleAmount: "+$299.00",
    },
    {
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        saleAmount: "+$39.00",
    },
];

// Combined Dashboard
const Dashboard = () => {
    const { auth } = usePage<PageProps>().props;

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            {/* Section Title */}
            <Card>
                <SectionTitle
                    title="Dashboard"
                    description={`Hi ${auth.user.name}, you are now logged in.`} />
                
                <div className="flex flex-col gap-5 w-full">
                    <PageTitle title="" />

                    {/* Cards Section */}
                    <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
                        {cardData.map((d, i) => (
                            <Card key={i}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{d.label}</p>
                                            <p className="text-lg font-semibold">{d.amount}</p>
                                            <p className="text-sm text-gray-400">{d.description}</p>
                                        </div>
                                        <d.icon className="w-6 h-6 text-gray-500" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </section>

                    {/* Overview & Sales Section */}
                    <section className="grid grid-cols-1 gap-4 transition-all lg:grid-cols-2">
                        <Card>
                            <CardContent>
                                <p className="p-4 font-semibold">Overview</p>
                                <BarChart />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="flex flex-col gap-4">
                                <section>
                                    <p>Recent Sales</p>
                                    <p className="text-sm text-gray-400">
                                        You made 265 sales this month.
                                    </p>
                                </section>
                                {userSalesData.map((d, i) => (
                                    <SalesCard
                                        key={i}
                                        email={d.email}
                                        name={d.name}
                                        saleAmount={d.saleAmount}
                                    />
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
