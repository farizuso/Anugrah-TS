import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="border flex items-center justify-center min-h-screen">
            {children}
        </div>
    );
}
