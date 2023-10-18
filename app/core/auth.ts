import * as React from "react";
import {
  AtomEffect,
  atom,
  useRecoilValueLoadable,
  useResetRecoilState,
} from "recoil";
import { getProfile, updateAxiosAuthHeader, userTokenKey } from "./api.js";

const getLogedUserEffect: () => AtomEffect<User | null> =
  () =>
  ({ setSelf, onSet }) => {
    const getLogedUser = getProfile().then((res) => {
      if (!res || res.status !== 200) {
        // unauthorized, remove token
        localStorage.removeItem(userTokenKey);
        updateAxiosAuthHeader(undefined);
        return null;
      }

      return { ...res.data, token: localStorage.getItem(userTokenKey) };
    });

    setSelf(getLogedUser);

    // Subscribe to state changes and persist them to localStorage
    onSet((newValue, _, isReset) => {
      if (isReset) {
        localStorage.removeItem(userTokenKey);
        updateAxiosAuthHeader(undefined);
      } else {
        if (newValue?.token) {
          localStorage.setItem(userTokenKey, `Bearer ${newValue.token}`);
          updateAxiosAuthHeader(localStorage.getItem(userTokenKey) || "");
        }
      }
    });
  };

export const CurrentUser = atom<User | null>({
  key: "CurrentUser",
  default: null,
  effects: [getLogedUserEffect()],
});

// The currently logged-in (authenticated) user object.
export function useCurrentUser() {
  const value = useRecoilValueLoadable(CurrentUser);
  return value.state === "loading" ? null : value.valueOrThrow();
}

export function useSignOut() {
  const reset = useResetRecoilState(CurrentUser);

  return React.useCallback(() => reset(), [reset]);
}

export enum EmployeeGroup {
  HR = "hr",
  EXECUTIVE = "executive",
  MANAGER = "manager",
  OPERATIONS = "operations",
  BUSINESS = "business",
  ACCOUNTANT = "accountant",
  MARKETING = "marketing",
  IT = "it",
  OTHERS = "others",
}

interface User {
  _id: string;
  name: string;
  email: string;
  group: EmployeeGroup;
  password: string;
  isVerified: boolean;
  token?: string;
}

export type { User };
