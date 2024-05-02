import { useState } from "react";
import { useApi } from "./utils/use_api";
import { useDispatch } from "react-redux";
import { setAuthToken } from "./store/application_slice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from "@mui/material";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const api = useApi();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function createUser(e) {
    e.preventDefault();
    const res = await api.post("/users", {
      email,
      password,
      firstName,
      lastName,
    });
    dispatch(setAuthToken(res.token));

    navigate("/recipes");
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader title="Sign Up" />
      <CardContent>
        <Grid container>
          <form className="sign-up-form" onSubmit={createUser}>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <TextField
                placeholder="First name"
                type="text"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item sx={{ pb: 2 }} xs={12}>
              <TextField
                placeholder="Last name"
                type="text"
                value={lastName}
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
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
                Create Account
              </Button>
            </Grid>
          </form>
        </Grid>
      </CardContent>
    </Card>
  );
};
