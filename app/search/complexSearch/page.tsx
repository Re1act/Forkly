import Card from '@/components/Card';
import { redirect } from "next/navigation";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  description?: string;
}

interface SearchPageProps {
  searchParams: any
}

function buildQueryString(params: Record<string, string>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.append(key, value);
  });
  // Always add these for better results
  search.set("number", "20");
  search.set("addRecipeInformation", "true");
  return search.toString();
}

export default async function ComplexSearchResultPage({ searchParams }: SearchPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  // If no filters at all, show a message
  if (!Object.keys(searchParams).length) {
    return <p className="text-center mt-8">Please enter at least one filter to search for recipes.</p>;
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  const queryString = buildQueryString(searchParams);

  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?${queryString}&apiKey=${apiKey}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data from the API');
  }

  const data: { results: Recipe[] } = await res.json();

  if (!data.results || data.results.length === 0) {
    return <p className="text-center mt-8">No results found for your search.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Search Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {data.results.map((recipe) => (
          <Card recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
}
