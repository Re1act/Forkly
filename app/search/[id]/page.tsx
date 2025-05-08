import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';
import { Metadata } from 'next';

type Recipe = {
  id: number;
  title: string;
  image: string;
  summary: string;
  extendedIngredients: Array<{
    id: number;
    original: string;
  }>;
  instructions: string;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string }
}): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `Recipe ${resolvedParams.id}`
  };
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await params;
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${resolvedParams.id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch recipe');
  }

  const recipe: Recipe = await res.json();
  const cleanSummary = DOMPurify.sanitize(recipe.summary, { ALLOWED_TAGS: [] });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <div className="relative w-full h-96 mb-4">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      <p className="text-gray-700 mb-4">{cleanSummary}</p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Ingredients</h2>
      <ul className="list-disc pl-6 mb-4">
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id} className="text-gray-800 mb-2">
            {ingredient.original}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Instructions</h2>
      <p className="whitespace-pre-line text-gray-800 leading-relaxed">
        {recipe.instructions
          ? DOMPurify.sanitize(recipe.instructions, { ALLOWED_TAGS: [] })
          : 'No instructions available.'}
      </p>
    </div>
  );
}