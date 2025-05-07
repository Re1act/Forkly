"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-800">Signed in as {session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
        >
          Sign out
        </button>
      </div>
    );
  } else {
    return (
      <button
        onClick={() => signIn("github")}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Sign in with GitHub
      </button>
    );
  }
}