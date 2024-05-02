import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { requireLogin } from "./utils/require_login";
import { useEffect, useState } from "react";
import { useApi } from "./utils/use_api";
import { RecipeTable } from "./RecipeTable";

export const Recipes = () => {
  requireLogin();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [favorites, setFavorites] = useState(false);
  const api = useApi();

  async function getUser() {
    const { user } = await api.get("/users/me");
    setUser(user);
  }

  async function getRecipes() {
    const recipes = await api.get("/recipes/my-recipes");
    setRecipes(recipes);
  }

  useEffect(() => {
    getUser();
    getRecipes();
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardHeader
          title="Recipes"
          titleTypographyProps={{ variant: "h4" }}
          subheader={`You have cooked ${
            100 *
            (recipes.filter((value) => value.completed).length / recipes.length)
          }% of the recipes needed!`}
          subheaderTypographyProps={{
            variant: "subtitle1",
          }}
        />
        <CardContent>
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch
                checked={showCompleted}
                onChange={() => setShowCompleted(!showCompleted)}
              />
            }
            label="Show Completed"
          />
          <FormControlLabel
            labelPlacement="top"
            control={
              <Switch
                checked={favorites}
                onChange={() => {
                  setFavorites(!favorites);
                }}
              />
            }
            label="Favorites Only"
          />
          <RecipeTable
            recipes={recipes}
            showCompleted={showCompleted}
            favorites={favorites}
            user={user}
          />
        </CardContent>
      </Card>
    </>
  );
};
