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
        await prisma.savedRecipes.delete({
            where: {
                userId_recipeId: {
                    userId: session.user.id,
                    recipeId: id,
                },
            },
        })
        return NextResponse.json({ success: true })
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}