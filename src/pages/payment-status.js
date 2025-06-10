import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function PaymentStatus() {
    const router = useRouter();
    // Extract 'payment_intent_id' from the URL query and alias it to 'id'
    const { payment_intent_id: id } = router.query; 

    const [status, setStatus] = useState('Loading...');
    const [details, setDetails] = useState(null);

    useEffect(() => {
        // Use 'id' (which holds the value of payment_intent_id)
        if (!id) return;

        const fetchStatus = async () => {
            try {
                // The API route expects 'id', which matches our alias
                const res = await fetch(`/api/payment-status?id=${id}`); 
                const data = await res.json();

                setStatus(data?.status || 'Unknown');
                setDetails(data?.details || null);
            } catch (err) {
                setStatus('Failed to fetch status');
            }
        };

        fetchStatus();
    }, [id]); // Dependency array uses 'id'

    return (
        <div className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6`}>
            <div className="bg-white/10 backdrop-blur-md text-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Payment Status</h2>

                <div className="text-center">
                    <p className="text-sm sm:text-base">
                        <span className="font-semibold">Status:</span>{' '}
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status === 'succeeded' ? 'bg-green-600' :
                            status === 'processing' ? 'bg-yellow-500' :
                                status === 'failed' ? 'bg-red-600' :
                                    'bg-gray-600'
                            }`}>
                            {status}
                        </span>
                    </p>
                </div>

                {details && (
                    <div className="space-y-2 text-sm sm:text-base">
                        <p><strong>Amount:</strong> ₱{(details.amount / 100).toFixed(2)}</p>
                        <p><strong>Currency:</strong> {details.currency.toUpperCase()}</p>
                        <p><strong>Payment Method:</strong> {details.payment_method_used || 'GCash'}</p>
                        <Link href="/checkout" legacyBehavior>
                            <a
                                className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
                            >
                                Back to Checkout
                            </a>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}