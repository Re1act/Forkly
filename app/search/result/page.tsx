import Card from '@/components/Card';
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import Link from 'next/link';
import ViewMoreRecipes from "@/components/ViewMoreRecipes";

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  description?: string; 
}

interface SearchPageProps {
  searchParams: any; 
}

export default async function SearchResultPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const resolvedParams = await searchParams;
  const query = resolvedParams.q || resolvedParams.query;
  const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

  if (!query) {
    return <p>Please enter a search query.</p>;
  }

  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data from the API');
  }

  const data: { results: Recipe[]; totalResults?: number } = await res.json();

  if (!data.results || data.results.length === 0) {
    return <p>No results found for &quot;{query}&quot;.</p>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 mt-2 text-center">
        Not what you were looking for? Try our <Link href="/search" className="text-blue-500 hover:underline">Advanced Search</Link>!
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-4">
        {data.results.map((recipe) => (
          <Card recipe={recipe} key={recipe.id} />
        ))}
      </div>
      <ViewMoreRecipes
        initialRecipes={[]}
        query={query}
        totalResults={data.totalResults}
        offset={data.results.length}
      />
    </>
  );
}