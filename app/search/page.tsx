"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CUISINES = [
  "african", "american", "british", "cajun", "caribbean", "chinese", "eastern european",
  "european", "french", "german", "greek", "indian", "irish", "italian", "japanese",
  "jewish", "korean", "latin american", "mediterranean", "mexican", "middle eastern",
  "nordic", "southern", "spanish", "thai", "vietnamese"
];
const DIETS = [
  "gluten free", "ketogenic", "vegetarian", "lacto-vegetarian", "ovo-vegetarian",
  "vegan", "pescetarian", "paleo", "primal", "low FODMAP", "whole30"
];
const INTOLERANCES = [
  "dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame", "shellfish",
  "soy", "sulfite", "tree nut", "wheat"
];
const SORTS = [
  { value: "", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "healthiness", label: "Healthiness" },
  { value: "price", label: "Price" },
  { value: "time", label: "Time" },
  { value: "calories", label: "Calories" },
  { value: "protein", label: "Protein" },
  { value: "carbs", label: "Carbs" },
  { value: "fat", label: "Fat" },
];

export default function AdvancedSearchPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    query: "",
    cuisine: "",
    diet: "",
    intolerances: "",
    includeIngredients: "",
    excludeIngredients: "",
    maxReadyTime: "",
    sort: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/search/complexSearch?${params.toString()}`);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Advanced Recipe Search</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="query"
          value={form.query}
          onChange={handleChange}
          placeholder="Search (e.g. Pasta, Chicken, Salad)"
          className="p-3 border rounded-lg"
        />
        <div className="flex gap-4">
          <select name="cuisine" value={form.cuisine} onChange={handleChange} className="flex-1 p-3 border rounded-lg">
            <option value="">Any Cuisine</option>
            {CUISINES.map(c => (
              <option key={c} value={c}>
                {c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <select name="diet" value={form.diet} onChange={handleChange} className="flex-1 p-3 border rounded-lg">
            <option value="">Any Diet</option>
            {DIETS.map(d => (
              <option key={d} value={d}>
                {d.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <select name="intolerances" value={form.intolerances} onChange={handleChange} className="flex-1 p-3 border rounded-lg">
            <option value="">No Intolerances</option>
            {INTOLERANCES.map(i => (
              <option key={i} value={i}>
                {i.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
          <input
            name="maxReadyTime"
            value={form.maxReadyTime}
            onChange={handleChange}
            type="number"
            min={1}
            placeholder="Max Ready Time (Min)"
            className="flex-1 p-3 border rounded-lg"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="includeIngredients"
            value={form.includeIngredients}
            onChange={handleChange}
            placeholder="Include Ingredients (Comma Separated)"
            className="flex-1 p-3 border rounded-lg"
          />
          <input
            name="excludeIngredients"
            value={form.excludeIngredients}
            onChange={handleChange}
            placeholder="Exclude Ingredients (Comma Separated)"
            className="flex-1 p-3 border rounded-lg"
          />
        </div>
        <div className="flex gap-4">
          <select name="sort" value={form.sort} onChange={handleChange} className="flex-1 p-3 border rounded-lg">
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>
                {s.label.charAt(0).toUpperCase() + s.label.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search Recipes
        </button>
      </form>
    </div>
  );
}
