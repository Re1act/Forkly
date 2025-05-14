"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Recipe = {
  id: string;
  title: string;
  summary: string;
  image?: string | null;
};

export default function RecipeList({ recipes: initialRecipes }: { recipes: Recipe[] }) {
  const [recipes, setRecipes] = useState(initialRecipes);

  async function handleRemove(id: string) {
    const res = await fetch("/api/removeRecipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  }

  if (!recipes || recipes.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No recipes found.</p>;
  }

  return (
    <div className="border rounded-xl shadow-lg bg-white p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Saved Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden border"
          >
            {recipe.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold mb-2 truncate">{recipe.title}</h2>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(recipe.id);
                  }}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Remove
                </button>
                <Link
                  href={`/search/${recipe.id}`}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={e => e.stopPropagation()}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}