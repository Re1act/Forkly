"use client";
import { useState } from "react";
import Card from "./Card";

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary?: string;
  description?: string;
}

export default function ViewMoreRecipes({
  initialRecipes,
  query,
  totalResults,
  offset = 0,
}: {
  initialRecipes: Recipe[];
  query: string;
  totalResults?: number;
  offset?: number;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [shown, setShown] = useState(offset);
  const [loading, setLoading] = useState(false);

  const hasMore = totalResults ? shown + recipes.length < totalResults : true;

  async function handleViewMore() {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;

    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=12&offset=${shown + recipes.length}&addRecipeInformation=true&apiKey=${apiKey}`,
    );
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      setRecipes([...recipes, ...data.results]);
    }
    setLoading(false);
  }

  return (
    <>
      {recipes.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
          {recipes.map((recipe) => (
            <Card recipe={recipe} key={recipe.id} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleViewMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "View More"}
          </button>
        </div>
      )}
      {!hasMore && recipes.length > 0 && (
        <p className="text-center mt-6 text-gray-500">No more results.</p>
      )}
      {recipes.length === 0 && (
        <></>
      )}
    </>
  );
}
