import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import RecipeList from "@/components/RecipeList";
import SearchForm from "@/components/SearchForm";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  // Query saved recipes directly
  const saved = await prisma.savedRecipes.findMany({
    where: { userId: session.user.id },
    include: { recipe: true },
  });

  const recipes = saved.map((s) => s.recipe);

  return (
    <>
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 mt-6 mb-8">
        <h1 className="text-3xl font-bold text-center drop-shadow-sm">
          Welcome back, {session.user.name}!
        </h1>
        <div className="w-full">
          <SearchForm />
        </div>
      </div>
      <div>
        <RecipeList recipes={recipes} />
      </div>
    </>
  );
}
