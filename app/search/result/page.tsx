import Card from '@/components/Card';

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  description?: string; // Optional, in case you choose to use it
}

interface SearchPageProps {
  searchParams: Promise<{ q: string }> | { q: string };
}

export default async function SearchResultPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;
  const apiKey = process.env.SPOONACULAR_API_KEY;

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

  const data: { results: Recipe[] } = await res.json();

  if (!data.results || data.results.length === 0) {
    return <p>No results found for &quot;{query}&quot;.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {data.results.map((recipe) => (
        <Card recipe={recipe} key={recipe.id} />
      ))}
    </div>
  );
}