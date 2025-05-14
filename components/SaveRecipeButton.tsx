"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SaveRecipeButton({ recipe, userId }: { recipe: any, userId: string }) {
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSaved() {
      const res = await fetch(`/api/saveRecipe?recipeId=${recipe.id}`);
      const data = await res.json();
      setIsSaved(data.saved);
    }
    checkSaved();
  }, [recipe.id]);

  if (isSaved) {
    return (
      <button
        className="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow flex items-center gap-2 cursor-not-allowed"
        disabled
      >
        This item is in your recipe list
      </button>
    );
  }

  return (
    <button
      onClick={async () => {
        setLoading(true);
        await fetch('/api/saveRecipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            id: recipe.id.toString(),
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            ingredients: recipe.extendedIngredients.map((ing: any) => ing.original),
            instructions: recipe.instructions
          }),
        });
        setLoading(false);
        router.push("/");
      }}
      className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors duration-150 flex items-center gap-2'
      disabled={loading}
    >
      {loading ? "Saving..." : "Add to recipe list"}
    </button>
  );
}