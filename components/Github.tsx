"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
export default function Github({message}: {message: string}) {
  return (
    <button
      type="button"
      onClick={() => signIn("github")}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center gap-2"
    >
      <Image
        width={20}
        height={20}
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub Logo"
        className="w-5 h-5"
      />
      {message}
    </button>
  );
}