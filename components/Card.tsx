function Card({ recipe }: any) {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={recipe.image} 
        alt={recipe.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-center mb-2">{recipe.title}</h2>
        <p className="text-gray-600 text-center">{recipe.description}</p>
      </div>
    </div>
  );
}

export default Card;