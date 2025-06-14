"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import SearchForm from "./SearchForm";

export default function Nav() {
    const { data: session, status } = useSession();

    return (
        <nav className="bg-white shadow px-4 py-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200">
            <div className="flex items-center gap-4 min-w-0 justify-between sm:justify-start">
                {status === "loading" ? null : session?.user && (
                    <>
                    <Link href="/" className="text-lg font-bold text-blue-600">
                        Home
                    </Link>
                    <Link href="/search" className="text-lg font-bold text-purple-600">
                        Advanced Search
                    </Link>
                    </>
                    
                )}
            </div>
            <div className="flex items-center gap-2 min-w-0 justify-end mt-2 sm:mt-0">
                {status === "loading" ? null : session?.user ? (
                    <>
                        <span className="font-medium text-base truncate max-w-[100px] sm:max-w-[150px]">
                            {session.user.name ? session.user.name : session.user.email}
                        </span>
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt="User Avatar"
                                width={32}
                                height={32}
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