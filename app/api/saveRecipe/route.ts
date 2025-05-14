import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, summary, instructions, image, ingredients } = await req.json();
    if (!id) {
        return NextResponse.json({ error: "Missing recipe id" }, { status: 400 });
    }

    let recipe;
    try {
        recipe = await prisma.recipe.findUnique({ where: { id } });
        if (!recipe) {
            recipe = await prisma.recipe.create({
                data: {
                    id,
                    title,
                    summary,
                    instructions,
                    image,
                    ingredients,
                },
            });
        }

        await prisma.savedRecipes.upsert({
            where: {
                userId_recipeId: {
                    userId: session.user.id,
                    recipeId: id,
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                recipeId: id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");
    if (!recipeId) {
        return NextResponse.json({ error: "Missing recipeId" }, { status: 400 });
    }

    const saved = await prisma.savedRecipes.findUnique({
        where: {
            userId_recipeId: {
                userId: session.user.id,
                recipeId: recipeId,
            },
        },
    });

    return NextResponse.json({ saved: !!saved });
}