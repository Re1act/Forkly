import DOMPurify from 'isomorphic-dompurify'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth'
import { getServerSession } from 'next-auth'
import SaveRecipeButton from '@/components/SaveRecipeButton'
interface Ingredient {
  id: number
  original: string
}

interface Recipe {
  id: number
  title: string
  image: string
  summary: string
  extendedIngredients: Ingredient[]
  instructions: string
}

interface PageProps {
  params: any
  searchParams?: any
}

export default async function RecipeDetails({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  const { id } = params;

  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  const recipe: Recipe = await res.json();
  const cleanSummary = DOMPurify.sanitize(recipe.summary, { ALLOWED_TAGS: [] });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <p className="text-gray-700 mb-4">{cleanSummary}</p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Ingredients</h2>
      <ul className="list-disc pl-6 mb-4">
        {recipe.extendedIngredients.map((ing) => (
          <li key={ing.id} className="text-gray-800 mb-2">
            {ing.original}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Instructions</h2>
      <p className="whitespace-pre-line text-gray-800 leading-relaxed">
        {recipe.instructions
          ? DOMPurify.sanitize(recipe.instructions, { ALLOWED_TAGS: [] })
          : 'No instructions available.'}
      </p>
      <SaveRecipeButton recipe={recipe} userId={session.user.id}/>
    </div>
  );
}