/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  Alert,
  Button,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useHandleChange, useHandleSubmit, useState } from "./Login.hooks.js";

/**
 * The login and registration page inspired by Notion. Example:
 *
 *    https://www.notion.so/login
 *    https://www.notion.so/signup
 */
export function Component(): JSX.Element {
  const [state, setState] = useState();
  const handleChange = useHandleChange(setState);
  const { pathname } = useLocation();
  const isSignUp = pathname === "/signup";
  const [handleSubmit, submitInFlight] = useHandleSubmit(
    state,
    setState,
    isSignUp,
  );

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "1rem",
        flexGrow: 0.8,
      }}
    >
      <Typography
        sx={{ mb: 2, fontWeight: 800, order: -3 }}
        variant="h1"
        align="center"
        children={isSignUp ? "Sign Up" : "Login"}
      />

      {state.error && (
        <Alert
          sx={{ mb: 2, order: -2 }}
          severity="error"
          children={state.error}
        />
      )}

      <form id="login-form" onSubmit={handleSubmit}>
        <Stack sx={{ gap: "1rem" }}>
          {isSignUp && (
            <TextField
              key="name"
              name="name"
              type="text"
              variant="outlined"
              label="Name"
              placeholder="Enter your name..."
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              disabled={submitInFlight}
              fullWidth
              required
            />
          )}
          <TextField
            key="email"
            name="email"
            type="email"
            variant="outlined"
            label="Work email"
            placeholder="Enter your email address..."
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            disabled={submitInFlight}
            fullWidth
            required
          />

          <TextField
            key="password"
            name="password"
            type="password"
            variant="outlined"
            label="Password"
            placeholder="Enter password..."
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            disabled={submitInFlight}
            fullWidth
            required
          />
        </Stack>
      </form>

      <Button
        color="inherit"
        form="login-form"
        type="submit"
        variant="outlined"
        size="large"
        children={`Continue with Email`}
        disabled={submitInFlight}
        fullWidth
      />

      <Typography
        sx={{ color: "text.secondary" }}
        variant="body2"
        align="center"
      >
        {isSignUp ? "Already have an account? " : "Don't have account yet? "}
        <Link
          sx={{ ":hover": { color: "text.primary" } }}
          color="inherit"
          to={isSignUp ? "/login" : "/signup"}
          component={RouterLink}
        >
          {isSignUp ? "Login" : "Sign Up"}
        </Link>
      </Typography>
    </Container>
  );
}

Component.displayName = "Login";
