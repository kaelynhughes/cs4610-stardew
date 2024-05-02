import { useEffect, useState } from "react";
import { useApi } from "./utils/use_api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken } from "./store/application_slice";
import { requireLogin } from "./utils/require_login";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";

export const Home = () => {
  requireLogin();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const api = useApi();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  function logout() {
    dispatch(setAuthToken(null));
  }

  return (
    <>
      <Card sx={{ m: 2 }}>
        <CardHeader title="Dashboard" />
        <CardContent>
          <Typography></Typography>
        </CardContent>
      </Card>
    </>
  );
};
