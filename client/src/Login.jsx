import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "./utils/use_api";
import { setAuthToken } from "./store/application_slice";
import { useDispatch } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const api = useApi();
  const dispatch = useDispatch();

  async function login(e) {
    e.preventDefault();
    const { token } = await api.post("/sessions", {
      email,
      password,
    });

    dispatch(setAuthToken(token));
    navigate("/recipes");
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader title="Login" />
      <CardContent>
        <Grid container>
          <form className="sign-up-form" onSubmit={login}>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <TextField
                placeholder="Email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <TextField
                placeholder="Password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <Button type="submit" variant="contained">
                Sign In
              </Button>
            </Grid>
          </form>
        </Grid>
      </CardContent>
    </Card>
  );
};
