import { PrismaClient } from "@prisma/client";

export type MarkedRecipePayload = {
  userId: number;
  recipeId: number;
};

export class RecipesRepository {
  private db: PrismaClient;
  private static instance: RecipesRepository;
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): RecipesRepository {
    if (!this.instance) {
      this.instance = new RecipesRepository(db!!);
    }
    return this.instance;
  }

  async createFavoriteRecipe({ userId, recipeId }: MarkedRecipePayload) {
    return this.db.favoriteRecipe.create({
      data: {
        userId: userId,
        recipeId: recipeId,
      },
    });
  }

  async removeFavoriteRecipe({ userId, recipeId }: MarkedRecipePayload) {
    console.log(userId);
    console.log(recipeId);
    return this.db.favoriteRecipe.deleteMany({
      where: {
        AND: [
          {
            userId: userId,
          },
          {
            recipeId: recipeId,
          },
        ],
      },
    });
  }

  async clearFavoriteRecipes(userId: number) {
    return this.db.favoriteRecipe.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async addCompletedRecipe({ userId, recipeId }: MarkedRecipePayload) {
    return this.db.completedRecipe.create({
      data: {
        userId: userId,
        recipeId: recipeId,
      },
    });
  }

  async removeCompletedRecipe({ userId, recipeId }: MarkedRecipePayload) {
    return this.db.completedRecipe.deleteMany({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });
  }

  async clearCompletedRecipes(userId: number) {
    return this.db.completedRecipe.deleteMany({
      where: {
        userId: userId,
      },
    });
  }

  async getUserMarkedRecipes(userId: number) {
    return {
      completedRecipes: this.db.completedRecipe
        .findMany({
          where: { userId: { equals: userId } },
        })
        .then((value) => value.map((item) => item.recipeId)),
      favoriteRecipes: this.db.favoriteRecipe
        .findMany({
          where: { userId: { equals: userId } },
        })
        .then((value) => value.map((item) => item.recipeId)),
    };
  }

  async getAllRecipes() {
    return this.db.recipe.findMany({
      include: {
        ingredients: {
          select: {
            id: true,
            ingredient: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllIngredients() {
    return this.db.ingredient.findMany({
      include: {
        recipes: {
          select: {
            id: true,
            recipe: {
              select: {
                id: true,
              },
            },
            quantity: true,
          },
        },
      },
    });
  }
}
