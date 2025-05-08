import Image from 'next/image';
import Link from 'next/link';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

function Card({ recipe }: { recipe: Recipe }) {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold text-center mb-2">{recipe.title}</h2>
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