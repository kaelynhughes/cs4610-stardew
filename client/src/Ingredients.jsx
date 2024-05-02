import {
  Button,
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
import { IngredientTable } from "./IngredientTable";

export const Ingredients = () => {
  requireLogin();
  const [user, setUser] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [favorites, setFavorites] = useState(false);
  const api = useApi();

  async function getUser() {
    const { user } = await api.get("/users/me");
    setUser(user);
  }

  async function getIngredients() {
    const ingredients = await api.get("/recipes/ingredients");
    console.log(ingredients);
    setIngredients(ingredients);
  }

  useEffect(() => {
    getUser();
    getIngredients();
  }, []);

  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardHeader
          title="Ingredients"
          titleTypographyProps={{ variant: "h4" }}
          subheader={`You have cooked!`}
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
          <IngredientTable
            ingredients={ingredients}
            showCompleted={showCompleted}
            favorites={favorites}
            user={user}
          />
        </CardContent>
      </Card>
    </>
  );
};
