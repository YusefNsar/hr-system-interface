import * as React from "react";
import {
  AtomEffect,
  atom,
  useRecoilValueLoadable,
  useResetRecoilState,
} from "recoil";
import { getEmployees } from "./api.js";
import { User } from "./auth.js";

const getEmployeesListEffect: () => AtomEffect<User[] | []> =
  () =>
  ({ setSelf, onSet }) => {
    const getEmployeesPromise = getEmployees().then((res) => {
      if (!res || res.status !== 200) {
        // request failed
        return [];
      }

      return res.data;
    });

    setSelf(getEmployeesPromise);

    // refetch employees list
    onSet((_, __, isReset) => {
      if (isReset) {
        getEmployees().then((res) => {
          if (!res || res.status !== 200) {
            // request failed
            setSelf([]);
            return;
          }

          setSelf(res.data);
        });
      }
    });
  };

export const Employees = atom<User[] | []>({
  key: "Employees",
  default: [],
  effects: [getEmployeesListEffect()],
});

// Employees List
export function useEmployees() {
  const value = useRecoilValueLoadable(Employees);
  return value.state === "loading" ? null : value.valueOrThrow();
}

// refetch employees list
export function useRefreshEmployees() {
  const reset = useResetRecoilState(Employees);

  return React.useCallback(() => reset(), [reset]);
}
