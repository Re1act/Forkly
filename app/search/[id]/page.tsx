import { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import Image from 'next/image';

interface Ingredient {
  id: number;
  original: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  summary: string;
  extendedIngredients: Ingredient[];
  instructions: string;
}

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function RecipeDetails({ params, searchParams }: Props) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${params.id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const recipe: Recipe = await res.json();

  const cleanSummary = DOMPurify.sanitize(recipe.summary, { ALLOWED_TAGS: [] });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <div className="relative w-full max-h-96">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover rounded-lg mb-4"
          sizes="(max-width: 768px) 100vw, 50vw"
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

// Optionally, you can also add metadata
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  return {
    title: `Recipe ${params.id}`,
  };
};