import Link from 'next/link'; // Import Link for navigation
import { Geist, Geist_Mono } from "next/font/google"; // Keep your fonts

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    // Main container for the page
    <div
      className={`${geistSans.className} ${geistMono.className} min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-8`}
    >
      {/* Main content area */}
      <main className="flex flex-col items-center text-center gap-6 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 max-w-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
          Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600">PayMongo API</span> Service
        </h1>

        <p className="text-sm sm:text-base text-gray-200 mb-6 max-w-md">
          This is your central hub for integrating PayMongo payments. Our API allows you to securely process transactions using your own PayMongo credentials.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link href="/checkout" legacyBehavior>
            <a
              className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              Try Our Demo Checkout
            </a>
          </Link>
          <a
            href="https://developers.paymongo.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            Read PayMongo Docs
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} Josiah API Service. All rights reserved.</p>
      </footer>
    </div>
  );
}
