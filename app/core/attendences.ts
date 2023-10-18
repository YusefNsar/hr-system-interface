import * as React from "react";
import {
  AtomEffect,
  atom,
  useRecoilValueLoadable,
  useResetRecoilState,
} from "recoil";
import { getAttendances } from "./api.js";
import { User } from "./auth.js";

const getAttendancesListEffect: () => AtomEffect<Attendance[] | []> =
  () =>
  ({ setSelf, onSet }) => {
    const getAttendancesPromise = getAttendances().then((res) => {
      if (!res || res.status !== 200) {
        // request failed
        return [];
      }

      return res.data;
    });

    setSelf(getAttendancesPromise);

    // refetch attendances list
    onSet((_, __, isReset) => {
      if (isReset) {
        getAttendances().then((res) => {
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

export const Attendances = atom<Attendance[] | []>({
  key: "Attendances",
  default: [],
  effects: [getAttendancesListEffect()],
});

// Attendances List
export function useAttendances() {
  const value = useRecoilValueLoadable(Attendances);
  return value.state === "loading" ? null : value.valueOrThrow();
}

// refetch attendances list
export function useRefreshAttendances() {
  const reset = useResetRecoilState(Attendances);

  return React.useCallback(() => reset(), [reset]);
}

interface Attendance {
  fromEpochTime: number;
  toEpochTime: number;
  dateISO: string;
  employee: User;
  // hr who recorded the attendance
  hr: User;
}

export type { Attendance };
