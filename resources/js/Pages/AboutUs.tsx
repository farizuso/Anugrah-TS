import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";

export default function AboutUs() {
    return (
        <UserLayout>
            <Head title="Tentang Kami" />
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Tentang UD. Anugrah Gas
                </h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                    UD. Anugrah Gas adalah perusahaan yang bergerak di bidang
                    distribusi gas industri dan medis di Indonesia. Berdiri
                    sejak tahun 2005, kami telah melayani berbagai sektor
                    seperti rumah sakit, manufaktur, dan laboratorium dengan
                    komitmen terhadap kualitas dan keamanan.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Dengan tim yang profesional dan berpengalaman, kami siap
                    memberikan solusi kebutuhan gas Anda secara cepat dan tepat.
                    Kami menyediakan berbagai jenis gas seperti oksigen,
                    nitrogen, asetilen, CO2, dan lainnya dengan standar mutu
                    tinggi.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    Visi kami adalah menjadi mitra terpercaya dalam penyediaan
                    gas industri dan medis di seluruh Indonesia. Kami terus
                    berinovasi dan meningkatkan layanan demi kepuasan pelanggan.
                </p>
            </div>
        </UserLayout>
    );
}
