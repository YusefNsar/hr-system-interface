/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { login, signup } from "../../core/api.js";
import { CurrentUser } from "../../core/auth.js";
import { SignInMethod, signIn } from "../../core/firebase.js";

/**
 * Handles login / signup via Email
 */
export function useHandleSubmit(
  state: State,
  setState: SetState,
  isSignUp: boolean,
): [submit: React.FormEventHandler, inFlight: boolean] {
  const [inFlight, setInFlight] = React.useState(false);
  const setCurrentUser = useSetRecoilState(CurrentUser);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return [
    React.useCallback(
      async (event) => {
        event.preventDefault();
        try {
          setInFlight(true);
          if (isSignUp) {
            // signup request
            const res = await signup(state);
            if (!res || res.status < 200 || res.status >= 300) {
              const error = res?.data?.message ?? "Signup failed.";
              setState((prev) => ({ ...prev, error }));
            } else {
              setState((prev) =>
                prev.error ? { ...prev, error: null } : prev,
              );
              enqueueSnackbar(
                "Permission granted from admins, you can now login.",
              );
              navigate("/login");
            }
          } else {
            // login request
            const res = await login(state);
            if (!res || res.status < 200 || res.status >= 300) {
              const error = res?.data?.message ?? "Login failed.";
              setState((prev) => ({ ...prev, error }));
            } else {
              setCurrentUser({
                ...res?.data?.employee,
                token: res?.data?.access_token,
              });
              setState((prev) =>
                prev.error ? { ...prev, error: null } : prev,
              );
              navigate("/");
            }
          }
        } finally {
          setInFlight(false);
        }
      },
      [state, navigate, setState, isSignUp, enqueueSnackbar, setCurrentUser],
    ),
    inFlight,
  ];
}

/**
 * The initial state of the Login component
 */
export function useState() {
  return React.useState({
    name: "",
    email: "",
    password: "",
    error: undefined as string | null | undefined,
  });
}

export function useHandleChange(setState: SetState) {
  return React.useCallback(
    function (event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target as Input;
      setState((prev) =>
        prev[name] === value ? prev : { ...prev, [name]: value },
      );
    },
    [setState],
  );
}

export function useHandleSignIn(setState: SetState) {
  const navigate = useNavigate();

  return React.useCallback(
    async function (event: React.MouseEvent<HTMLElement>) {
      try {
        const method = event.currentTarget.dataset.method as SignInMethod;
        const credential = await signIn({ method });
        if (credential.user) {
          setState((prev) => (prev.error ? { ...prev, error: null } : prev));
          navigate("/");
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Login failed.";
        setState((prev) => ({ ...prev, error }));
      }
    },
    [navigate, setState],
  );
}

export type Mode = "login" | "signup";
export type State = ReturnType<typeof useState>[0];
export type SetState = ReturnType<typeof useState>[1];
export type Input = { name: keyof State; value: string };
