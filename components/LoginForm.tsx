"use client";
import { signIn } from 'next-auth/react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Github from './Github';
import Link from 'next/link';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const errorTimeout = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) {
            if (errorTimeout.current) clearTimeout(errorTimeout.current);
            errorTimeout.current = setTimeout(() => {
                setError("Email and password are required.");
            }, 1000);
            return;
        }
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });
        if (res?.error) {
            if (errorTimeout.current) clearTimeout(errorTimeout.current);
            errorTimeout.current = setTimeout(() => {
                setError('Invalid email or password');
            }, 1000);
        } else {
            setError('');
            router.push('/');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <Link href="/register" className="text-blue-500 hover:underline">Don&apos;t have an account? Register here</Link>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <Github message="Sign in with Github" />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Login
            </button>
        </form>
    );
}