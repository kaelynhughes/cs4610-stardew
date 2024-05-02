import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useApi } from "./utils/use_api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthToken } from "./store/application_slice";

export const RecipeTable = ({ recipes, showCompleted, favorites, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api = useApi();

  async function setFavorite(recipe) {
    const body = {
      userId: user?.id,
      recipeId: recipe.id,
    };
    const { res, token } = recipe.favorite
      ? await api.del(`/recipes/favorite/${user.id}/${recipe.id}`)
      : await api.post("/recipes/favorite", body);
    dispatch(setAuthToken(token));
    navigate(0);
  }

  async function setComplete(recipe) {
    const body = {
      userId: user?.id,
      recipeId: recipe.id,
    };
    const { res, token } = recipe.completed
      ? await api.del(`/recipes/completed/${user.id}/${recipe.id}`)
      : await api.post("/recipes/completed", body);
    dispatch(setAuthToken(token));
    navigate(0);
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Favorited</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes
            .filter(
              (recipe) =>
                (!recipe.completed || showCompleted) &&
                (recipe.favorite || !favorites)
            )
            .map((recipe, i) => (
              <TableRow key={i}>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>{recipe.description}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={recipe.completed}
                    onClick={() => setComplete(recipe)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={recipe.favorite}
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    onClick={() => setFavorite(recipe)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
