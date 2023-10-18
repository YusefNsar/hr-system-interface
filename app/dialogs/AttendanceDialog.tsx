/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment, { Moment } from "moment";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { addAttendance } from "../core/api.js";
import { useRefreshAttendances } from "../core/attendences.js";
import { User } from "../core/auth.js";

export function AttendanceDialog(props: AttendanceDialogProps): JSX.Element {
  const [{ input, ...state }, setState] = useState(props.employee);
  const handleChange = useHandleChange(setState);

  const onClose = () => {
    props.onClose();
    setState({
      input: {
        _id: "",
        from: moment(),
        to: moment(),
      },
      loading: false,
      error: undefined as string | undefined,
    });
  };
  const handleSubmit = useHandleSubmit(input, setState, onClose);

  return (
    <Dialog
      scroll="body"
      maxWidth="xs"
      fullWidth
      {...props}
      {...state}
      onClose={onClose}
    >
      <DialogContent
        sx={{
          py: 4,
          px: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => onClose()}
          children={<Close />}
        />

        <Typography
          sx={{ mb: 3 }}
          variant="h3"
          align="center"
          children={"Log Attendance"}
        />
        <Container sx={{ my: 4 }} maxWidth="sm">
          {state.error && (
            <Alert sx={{ mb: 3 }} severity={"error"} children={state.error} />
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                label="From"
                value={input.from}
                onChange={(newTime) =>
                  setState((prev) => ({
                    ...prev,
                    input: { ...prev.input, from: newTime },
                  }))
                }
                sx={{ width: "100%", mb: 2 }}
                renderInput={(props) => (
                  <TextField
                    name="from"
                    label="from"
                    value={input.from}
                    onChange={handleChange}
                    disabled={state.loading}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    {...props}
                  />
                )}
              />
              <TimePicker
                label="To"
                value={input.to}
                onChange={(newTime) =>
                  setState((prev) => ({
                    ...prev,
                    input: { ...prev.input, to: newTime },
                  }))
                }
                sx={{ width: "100%", mb: 2 }}
                renderInput={(props) => (
                  <TextField
                    name="to"
                    label="to"
                    value={input.to}
                    onChange={handleChange}
                    disabled={state.loading}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    {...props}
                  />
                )}
              />
            </LocalizationProvider>

            <Button
              variant="contained"
              type="submit"
              children={"Save"}
              disabled={state.loading}
            />
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
}

function useState(defaultInput: User | undefined) {
  const [state, setState] = React.useState({
    input: {
      _id: defaultInput?._id || "",
      from: moment() as Moment | null,
      to: moment() as Moment | null,
    },
    loading: false,
    error: undefined as string | undefined,
  });

  React.useEffect(() => {
    setState({
      input: {
        _id: defaultInput?._id || "",
        from: moment(),
        to: moment(),
      },
      loading: false,
      error: undefined as string | undefined,
    });
  }, [defaultInput]);

  return [state, setState] as const;
}

function useHandleChange(setState: SetState) {
  return React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setState((prev) => ({
        ...prev,
        input: { ...prev.input, [name]: value },
      }));
    },
    [setState],
  );
}

function useHandleSubmit(
  input: Input,
  setState: SetState,
  onClose: () => void,
) {
  const refresh = useRefreshAttendances();

  return React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const todayDate = new Date().toDateString();
        const fromFormatted = input.from?.format("HH:mm");
        const toFormatted = input.to?.format("HH:mm");

        const fromEpochTime = new Date(
          `${todayDate} ${fromFormatted}`,
        ).getTime();
        const toEpochTime = new Date(`${todayDate} ${toFormatted}`).getTime();

        const res = await addAttendance({
          employee: input._id,
          fromEpochTime,
          toEpochTime,
        });

        if (!res || res.status !== 201) {
          const error = res?.data?.message ?? "Add failed.";
          setState((prev) => ({ ...prev, error, loading: false }));
        } else {
          setState((prev) =>
            prev.error ? { ...prev, error: undefined, loading: false } : prev,
          );
          enqueueSnackbar<"success">("Added Successfully");
          refresh();
          onClose();
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Failed.";
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    },
    [setState, input, refresh, onClose],
  );
}

export interface AttendanceDialogProps
  extends Omit<DialogProps, "open" | "children"> {
  employee: User | undefined;
  open: boolean;
  onClose: () => void;
}

type Input = ReturnType<typeof useState>[0]["input"];
type SetState = ReturnType<typeof useState>[1];
