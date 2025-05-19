import { NextRequest, NextResponse } from "next/server";

const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;

async function fetchRecipeTitlesFromSpoonacular(query: string) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=5&apiKey=${spoonacularApiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to fetch recipes from Spoonacular API:", await response.text());
      throw new Error("Failed to fetch recipes from Spoonacular API");
    }

    const data = await response.json();
    console.log("Fetched Titles from Spoonacular:", data.results); 
    return data.results.map((recipe: any) => recipe.title); 
  } catch (error) {
    console.error("Error in fetchRecipeTitlesFromSpoonacular:", error);
    return [];
  }
}

async function isRecipeIntent(messages: any[]): Promise<boolean> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a classifier that returns only 'yes' or 'no'. If the user is asking for recipe suggestions or food ideas, respond with 'yes'. Otherwise, respond with 'no'.",
        },
        ...messages,
      ],
      temperature: 0,
      max_tokens: 1,
    }),
  });

  const data = await res.json();
  const result = data.choices?.[0]?.message?.content?.trim().toLowerCase();
  return result === "yes";
}

export async function POST(req: NextRequest) {
  try {
    const { messages, query } = await req.json();

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "'messages' must be an array" }, { status: 400 });
    }

    if (!spoonacularApiKey) {
      return NextResponse.json({ error: "Spoonacular API key missing" }, { status: 500 });
    }

    let updatedMessages = [...messages];

    const wantsRecipes = await isRecipeIntent(messages);

    if (wantsRecipes) {
      const q = query || "dinner";
      const titles = await fetchRecipeTitlesFromSpoonacular(q);

      const context = titles.length
        ? `You are a recipe assistant with access to real-time search results. The user requested recipes related to "${q}". You already searched and found these real recipe titles from the Spoonacular API:\n\n${titles.join(
            "\n"
          )}\n\nPlease use these results to suggest which ones the user might explore next. Do not generate your own recipes.`
        : `You are a recipe assistant. The user requested recipes related to "${q}", but no results were found in the Spoonacular API. You can let the user know and offer to try a different search.`;

      updatedMessages = [
        {
          role: "system",
          content: context,
        },
        ...messages,
      ];
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: updatedMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "OpenAI request failed" }, { status: response.status });
    }

    const content = data.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ response: content });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
