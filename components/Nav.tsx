"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import SearchForm from "./SearchForm";

export default function Nav() {
    const { data: session, status } = useSession();

    return (
        <nav className="flex items-center px-5 py-3 bg-white shadow">
            <div className="flex items-center gap-6 min-w-0">
                {status === "loading" ? null : session?.user && (
                    <>
                        <Link href="/" className="text-lg font-bold text-blue-600">
                            Home
                        </Link>
                    </>
                )}
            </div>
            <div className="flex-1 flex justify-center">
                {status === "loading" ? null : session?.user && (
                    <div className="w-full max-w-md">
                        <SearchForm />
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 min-w-0">
                {status === "loading" ? null : session?.user ? (
                    <>
                        <span className="font-medium text-base truncate max-w-[150px]">
                            {session.user.name ? session.user.name : session.user.email}
                        </span>
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt="User Avatar"
                                width={34}
                                height={34}
                                className="rounded-full"
                            />
                        )}
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/register" className="text-gray-700 hover:text-blue-600 text-base">
                            Register
                        </Link>
                        <Link href="/login" className="text-gray-700 hover:text-blue-600 text-base">
                            Login
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}