import { Router } from "express";
import { RecipesRepository } from "../repositories/recipes_repository";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middleware/authentication";

export type RecipeIngredient = {
  id: number;
  name: string;
  description: string;
};

export type MarkedRecipes = {
  completedRecipes: number[];
  favoritedRecipes: number[];
};

export type FullRecipe = {
  id: number;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  completed: boolean;
  favorite: boolean;
};

export type FullIngredient = {
  id: number;
  name: string;
  description: string;
  totalQuantity: number;
  quantityNeeded: number;
  favorite: boolean;
  recipeIds: number[];
  recipeQuantities: { id: number; quantity: number }[];
};

export const buildRecipesController = (
  recipesRepository: RecipesRepository
) => {
  const router = Router();

  router.get("/my-recipes", authMiddleware, async (req, res) => {
    const recipes: FullRecipe[] = [];

    const dbRecipes = await recipesRepository.getAllRecipes();
    dbRecipes.forEach((recipe) => {
      recipes.push({
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients.map((ingredient) => {
          return {
            id: ingredient.id,
            name: ingredient.ingredient.name,
            description: ingredient.ingredient.description,
          };
        }),
        completed: false,
        favorite: false,
      });
    });

    const markedRecipes = await recipesRepository.getUserMarkedRecipes(
      req.user?.id ?? 1
    );
    (await markedRecipes.completedRecipes).forEach((recipeId: number) => {
      const recipe = recipes.find((recipe) => recipe.id == recipeId);
      if (recipe) {
        recipe.completed = true;
      }
    });
    (await markedRecipes.favoriteRecipes).forEach((recipeId: number) => {
      const recipe = recipes.find((recipe) => recipe.id == recipeId);
      if (recipe) {
        recipe.favorite = true;
      }
    });

    res.json(recipes);
  });

  router.post("/favorite", authMiddleware, async (req, res) => {
    const newFavorite = await recipesRepository.createFavoriteRecipe(req.body);
    const token = jwt.sign(
      {
        userId: req.user!!.id,
      },
      process.env.ENCRYPTION_KEY as string
    );
    res.json({ newFavorite, token });
  });

  router.delete(
    "/favorite/:userId/:recipeId",
    authMiddleware,
    async (req, res) => {
      const removeFavorite = await recipesRepository.removeFavoriteRecipe({
        userId: Number(req.params.userId),
        recipeId: Number(req.params.recipeId),
      });
      const token = jwt.sign(
        {
          userId: req.user!!.id,
        },
        process.env.ENCRYPTION_KEY as string
      );
      res.json({ removeFavorite, token });
    }
  );

  router.post("/completed", authMiddleware, async (req, res) => {
    const complete = await recipesRepository.addCompletedRecipe(req.body);
    const token = jwt.sign(
      {
        userId: req.user!!.id,
      },
      process.env.ENCRYPTION_KEY as string
    );
    res.json({ complete, token });
  });

  router.delete(
    "/completed/:userId/:recipeId",
    authMiddleware,
    async (req, res) => {
      const uncomplete = await recipesRepository.removeCompletedRecipe({
        userId: Number(req.params.userId),
        recipeId: Number(req.params.recipeId),
      });
      const token = jwt.sign(
        {
          userId: req.user!!.id,
        },
        process.env.ENCRYPTION_KEY as string
      );
      res.json({ uncomplete, token });
    }
  );

  router.get("/ingredients", authMiddleware, async (req, res) => {
    const ingredients: FullIngredient[] = [];

    const dbIngredients = await recipesRepository.getAllIngredients();
    console.log(dbIngredients);

    dbIngredients.forEach((ingredient) => {
      ingredients.push({
        id: ingredient.id,
        name: ingredient.name,
        description: ingredient.description,
        totalQuantity: ingredient.totalQuantity,
        quantityNeeded: ingredient.totalQuantity,
        favorite: false,
        recipeIds: ingredient.recipes.map((recipe) => recipe.recipe.id),
        recipeQuantities: ingredient.recipes.map((recipe) => {
          return { id: recipe.recipe.id, quantity: recipe.quantity };
        }),
      });
    });
    console.log(ingredients);

    try {
      const markedRecipes = await recipesRepository.getUserMarkedRecipes(
        req.user?.id ?? 1
      );
      await Promise.all(
        ingredients.map(async (ingredient) => {
          await Promise.all(
            ingredient.recipeIds.map(async (id) => {
              if ((await markedRecipes.favoriteRecipes).includes(id)) {
                ingredient.favorite = true;
              }
            })
          );
        })
      );
      await Promise.all(
        ingredients.map(async (ingredient) => {
          await Promise.all(
            ingredient.recipeQuantities.map(async (obj) => {
              if ((await markedRecipes.completedRecipes).includes(obj.id)) {
                ingredient.quantityNeeded -= obj.quantity;
              }
              console.log(obj.id);
            })
          );
        })
      );
    } catch (error) {
      console.log(error);
    }
    console.log("done");
    res.json(ingredients);
  });
  return router;
};
