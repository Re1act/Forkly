import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import RecipeList from "@/components/RecipeList";

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
    <div>
      <RecipeList recipes={recipes} />
    </div>
  );
}
