import { Favorite, FavoriteBorder } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const IngredientTable = ({ ingredients, showCompleted, favorites }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Still Needed</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Favorite</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients
            .filter(
              (ingredient) =>
                (ingredient.quantityNeeded > 0 || showCompleted) &&
                (ingredient.favorite || !favorites)
            )
            .map((ingredient, i) => (
              <TableRow key={i}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.description}</TableCell>
                <TableCell>{ingredient.quantityNeeded}</TableCell>
                <TableCell>{ingredient.totalQuantity}</TableCell>
                <TableCell>
                  {ingredient.favorite ? <Favorite /> : <span />}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
