'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/result?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-md mx-auto bg-white rounded-xl shadow border border-gray-200"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for recipes..."
        className="flex-1 w-full p-4 rounded-l-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
      />
      <button
        type="submit"
        className="px-8 py-2 bg-blue-600 text-white rounded-r-xl font-bold text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
      >
        Search
      </button>
    </form>
  );
}