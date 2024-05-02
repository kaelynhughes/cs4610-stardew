import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { config } from "dotenv";
import * as bcrypt from "bcryptjs";
import { Ingredient, Recipe, RecipeIngredient } from "./types";
config();

const ingredients: Ingredient[] = [
  {
    id: 1,
    name: "Beet",
    description:
      "A sweet and earthy root vegetable. As a bonus, the leaves make a great salad.",
    totalQuantity: 1,
  },
  {
    id: 2,
    name: "Blue Jazz",
    description:
      "The flower grows in a sphere to invite as many butterflies as possible.",
    totalQuantity: 1,
  },
  {
    id: 3,
    name: "Bream",
    description: "A fairly common river fish that becomes active at night.",
    totalQuantity: 1,
  },
  {
    id: 4,
    name: "Cauliflower",
    description:
      "Valuable, but slow-growing. Despite its pale color, the florets are packed with nutrients.",
    totalQuantity: 1,
  },
  {
    id: 5,
    name: "Cheese",
    description: "It's your basic cheese.",
    totalQuantity: 1,
  },
  {
    id: 6,
    name: "Dandelion",
    description: "Not the prettiest flower, but the leaves make a good salad.",
    totalQuantity: 1,
  },
  {
    id: 7,
    name: "Egg",
    description: "A regular white chicken egg.",
    totalQuantity: 2,
  },
  {
    id: 8,
    name: "Leek",
    description: "A tasty relative of the onion.",
    totalQuantity: 1,
  },
  {
    id: 9,
    name: "Milk",
    description: "A jug of cow's milk.",
    totalQuantity: 1,
  },
  {
    id: 10,
    name: "Oil",
    description: "All purpose cooking oil.",
    totalQuantity: 1,
  },
  {
    id: 11,
    name: "Parsnip",
    description:
      "A spring tuber closely related to the carrot. It has an earthy taste and is full of nutrients.",
    totalQuantity: 1,
  },
  {
    id: 12,
    name: "Periwinkle",
    description: "A tiny freshwater snail that lives in a blue shell.",
    totalQuantity: 1,
  },
  {
    id: 13,
    name: "Sea Cucumber",
    description: "A slippery, slimy creature found on the ocean floor.",
    totalQuantity: 1,
  },
  {
    id: 14,
    name: "Squid",
    description: "A deep sea creature that can grow to enormous size.",
    totalQuantity: 1,
  },
  {
    id: 15,
    name: "Sunfish",
    description: "A common river fish.",
    totalQuantity: 1,
  },
  {
    id: 16,
    name: "Tomato",
    description:
      "Rich and slightly tangy, the Tomato has a wide variety of culinary uses.",
    totalQuantity: 1,
  },
  {
    id: 17,
    name: "Tortilla",
    description: "Can be used as a vessel for food or eaten by itself.",
    totalQuantity: 1,
  },
  {
    id: 18,
    name: "Vinegar",
    description: "An aged fermented liquid used in many cooking recipes.",
    totalQuantity: 1,
  },
  {
    id: 19,
    name: "Void Mayonnaise",
    description: "A thick, black paste that smells like burnt hair.",
    totalQuantity: 1,
  },
  {
    id: 20,
    name: "Wheat Flour",
    description: "A common cooking ingredient made from crushed wheat seeds.",
    totalQuantity: 1,
  },
];

const recipes: Recipe[] = [
  {
    id: 1,
    name: "Fried Egg",
    description: "Sunny-side up.",
  },
  {
    id: 2,
    name: "Omelet",
    description: "It's super fluffy.",
  },
  {
    id: 3,
    name: "Salad",
    description: "A healthy garden salad.",
  },
  {
    id: 4,
    name: "Cheese Cauliflower",
    description: "It smells great!",
  },
  {
    id: 5,
    name: "Baked Fish",
    description: "Baked fish on a bed of herbs.",
  },
  {
    id: 6,
    name: "Parsnip Soup",
    description: "It's fresh and hearty.",
  },
  {
    id: 7,
    name: "Vegetable Medley",
    description: "This is very nutritious.",
  },
  {
    id: 8,
    name: "Fried Calamari",
    description: "It's so chewy.",
  },
  {
    id: 9,
    name: "Strange Bun",
    description: "What's inside?",
  },
  {
    id: 10,
    name: "Lucky Lunch",
    description: "A special little meal.",
  },
];

const recipeIngredients: RecipeIngredient[] = [
  {
    ingredientId: 7,
    recipeId: 1,
    quantity: 1,
  },
  {
    ingredientId: 7,
    recipeId: 2,
    quantity: 1,
  },
  {
    ingredientId: 9,
    recipeId: 2,
    quantity: 1,
  },
  {
    ingredientId: 8,
    recipeId: 3,
    quantity: 1,
  },
  {
    ingredientId: 6,
    recipeId: 3,
    quantity: 1,
  },
  {
    ingredientId: 18,
    recipeId: 3,
    quantity: 1,
  },
  {
    ingredientId: 5,
    recipeId: 4,
    quantity: 1,
  },
  {
    ingredientId: 4,
    recipeId: 4,
    quantity: 1,
  },
  {
    ingredientId: 15,
    recipeId: 5,
    quantity: 1,
  },
  {
    ingredientId: 3,
    recipeId: 5,
    quantity: 1,
  },
  {
    ingredientId: 20,
    recipeId: 5,
    quantity: 1,
  },
  {
    ingredientId: 11,
    recipeId: 6,
    quantity: 1,
  },
  {
    ingredientId: 9,
    recipeId: 6,
    quantity: 1,
  },
  {
    ingredientId: 18,
    recipeId: 6,
    quantity: 1,
  },
];

async function main() {
  await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: {
      firstName: "SITE",
      lastName: "ADMIN",
      email: process.env.ADMIN_EMAIL!!,
      password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
    },
    update: {
      email: process.env.ADMIN_EMAIL!!,
      password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
    },
  });
  await prisma.ingredient.createMany({
    data: ingredients,
    skipDuplicates: true,
  });
  await prisma.recipe.createMany({
    data: recipes,
    skipDuplicates: true,
  });
  await prisma.recipeIngredient.createMany({
    data: recipeIngredients,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
