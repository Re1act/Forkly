'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Github from './Github';
import Link from 'next/link';
export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password || !name) {
            setError("All fields are required.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
        });
        if (res.ok) {
            router.push('/login');
        } else {
            setError('Registration failed. Please try again.');
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Register</h1>
            <Link href="/login" className="text-blue-500 hover:underline">Already have an account? Log in</Link>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
            />
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
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <Github message="Register with Github" />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Register
            </button>
        </form>
    )
}