import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function User({ children }: PropsWithChildren) {
    return (
        <div className="">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
