import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  TextField,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import { setAuthToken } from "./store/application_slice";
import { useEffect, useState } from "react";

function App() {
  const authToken = useSelector((state) => state.application.authToken);

  // const worker = new Worker(new URL("./worker.js", import.meta.url));

  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);

  const theme = createTheme({
    palette: {
      background: {
        default: "#F0F0F0",
      },
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function logout() {
    dispatch(setAuthToken(null));
  }

  function toChat() {
    navigate("/chat");
  }

  function toIngredients() {
    navigate("/ingredients");
  }

  function toRecipes() {
    navigate("/recipes");
  }

  function toSignup() {
    navigate("/sign_up");
  }

  function toLogin() {
    navigate("/login");
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <nav className="my-nav">
          <Box sx={{ flexGrow: 1, mx: -1, mt: -1, mb: 2 }}>
            <AppBar position="static">
              <Toolbar disableGutters sx={{ pl: 3 }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="#app-bar-with-responsive-menu"
                  sx={{
                    mx: 1,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".2rem",
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Stardew Valley Cooking Checklist
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                  {!authToken ? (
                    <>
                      <Button
                        key={"signUp"}
                        sx={{ my: 2, color: "white", display: "block" }}
                        onClick={toSignup}
                      >
                        Create Account
                      </Button>
                      <Button
                        sx={{ my: 2, color: "white", display: "block" }}
                        onClick={toLogin}
                      >
                        Log In
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        key={"Recipes"}
                        onClick={toRecipes}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Recipes
                      </Button>
                      <Button
                        key={"Ingredients"}
                        onClick={toIngredients}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Ingredients
                      </Button>
                      <Button
                        key={"Chat"}
                        onClick={toChat}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Chat
                      </Button>
                      <Button
                        key={"Logout"}
                        onClick={logout}
                        sx={{ my: 2, color: "white", display: "block" }}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </Box>
              </Toolbar>
            </AppBar>
          </Box>
        </nav>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
