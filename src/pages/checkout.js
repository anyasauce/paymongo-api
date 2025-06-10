import { useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Checkout() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        amount: '',
        secretKey: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const amountInCentavos = Math.round(parseFloat(form.amount) * 100);

            const res = await fetch('/api/paymongo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    amount: amountInCentavos,
                    secretKey: form.secretKey || undefined,
                    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-status`,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Unknown error');

            window.location.href = data.redirect_url;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div
            className={`${geistSans.className} ${geistMono.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 text-white`}
        >
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">
                    GCash Checkout Demonstration
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Amount (in pesos)"
                        required
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        min="1"
                        step="0.01"
                    />
                    <input
                        type="password"
                        placeholder="Your Secret Key (Optional)"
                        value={form.secretKey}
                        onChange={(e) => setForm({ ...form, secretKey: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-200 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        {loading ? 'Processing...' : 'Pay with GCash'}
                    </button>
                </form>

                {error && (
                    <p className="mt-4 text-red-400 text-sm text-center">Error: {error}</p>
                )}
            </div>
        </div>
    );
}
