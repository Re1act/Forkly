import Link from 'next/link';

interface Recipe {
  id: number;
  title: string;
  image: string;
  description?: string; 
}

function Card({ recipe }: { recipe: Recipe }) {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-center mb-2">{recipe.title}</h2>
        <p className="text-gray-600 text-center">{recipe.description}</p>
      </div>
      <div className="p-4 pt-0 flex justify-center">
        <Link
          href={`/search/${recipe.id}`}
          className="mt-2 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default Card;