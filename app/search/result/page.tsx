import Card from "@/components/Card";

export default async function SearchResultPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (!query) {
    return <p>Please enter a search query.</p>;
  }

  const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${apiKey}`);
  if (!res.ok) {
    throw new Error("Failed to fetch data from the API");
  }

  const data = await res.json();

  console.log(data);  // Check the structure of the data

  if (!data.results || data.results.length === 0) {
    return <p>No results found for "{query}".</p>;
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      {data.results.map((recipe: any) => (
        <Card recipe={recipe} key={recipe.id} />
      ))}
    </div>
  );
}