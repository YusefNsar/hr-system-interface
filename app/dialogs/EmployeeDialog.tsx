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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { addEmployee, editEmployee } from "../core/api.js";
import { EmployeeGroup, User } from "../core/auth.js";
import { useRefreshEmployees } from "../core/employees.js";

export function EmployeeDialog(props: EmployeeDialogProps): JSX.Element {
  const [{ input, ...state }, setState] = useState(props.employee);
  const handleChange = useHandleChange(setState);
  const isEditing = !!props.employee;
  const onClose = () => {
    props.onClose();
    setState({
      input: {
        _id: "",
        name: "",
        email: "",
        group: EmployeeGroup.ACCOUNTANT,
      },
      loading: false,
      error: undefined as string | undefined,
    });
  };
  const handleSubmit = useHandleSubmit(input, setState, isEditing, onClose);

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
          children={isEditing ? "Edit Employee" : "Save Employee"}
        />
        <Container sx={{ my: 4 }} maxWidth="sm">
          {state.error && (
            <Alert sx={{ mb: 3 }} severity={"error"} children={state.error} />
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Name"
              value={input.name}
              helperText={" "}
              onChange={handleChange}
              disabled={state.loading}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            {!isEditing && (
              <TextField
                name="email"
                type="email"
                label="Email"
                value={input.email}
                helperText={" "}
                onChange={handleChange}
                disabled={state.loading}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            )}

            <TextField
              name="group"
              label="Group"
              select
              helperText={" "}
              onChange={handleChange}
              value={input.group}
              disabled={state.loading}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            >
              {groups.map((group, i) => (
                <MenuItem key={group + i} value={group}>
                  {group[0].toUpperCase() + group.substring(1)}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              type="submit"
              children={isEditing ? "Edit" : "Save"}
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
      name: defaultInput?.name || "",
      email: defaultInput?.email || "",
      group: defaultInput?.group || EmployeeGroup.ACCOUNTANT,
    },
    loading: false,
    error: undefined as string | undefined,
  });

  React.useEffect(() => {
    setState({
      input: {
        _id: defaultInput?._id || "",
        name: defaultInput?.name || "",
        email: defaultInput?.email || "",
        group: defaultInput?.group || EmployeeGroup.ACCOUNTANT,
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
  isEditing: boolean,
  onClose: () => void,
) {
  const refresh = useRefreshEmployees();

  return React.useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setState((prev) => ({ ...prev, loading: true }));

      try {
        if (isEditing) {
          const res = await editEmployee({
            _id: input._id,
            group: input.group,
            name: input.name,
          });

          if (!res || res.status !== 200) {
            const error = res?.data?.message ?? "Edit failed.";
            setState((prev) => ({ ...prev, error, loading: false }));
          } else {
            setState((prev) =>
              prev.error ? { ...prev, error: undefined, loading: false } : prev,
            );
            enqueueSnackbar<"success">("Edited Successfully");
            refresh();
            onClose();
          }
        } else {
          const res = await addEmployee({ newEmployee: input });

          if (!res || res.status !== 201) {
            const error = res?.data?.message ?? "Add failed.";
            setState((prev) => ({ ...prev, error, loading: false }));
          } else {
            setState((prev) =>
              prev.error ? { ...prev, error: undefined, loading: false } : prev,
            );
            enqueueSnackbar("Added Successfully");
            refresh();
            onClose();
          }
        }
      } catch (err) {
        const error = (err as Error)?.message ?? "Failed.";
        setState((prev) => ({ ...prev, loading: false, error }));
      }
    },
    [setState, input, isEditing, refresh, onClose],
  );
}

const groups = [
  "executive",
  "manager",
  "operations",
  "business",
  "accountant",
  "marketing",
  "it",
  "others",
];

export interface EmployeeDialogProps
  extends Omit<DialogProps, "open" | "children"> {
  employee: User | undefined;
  open: boolean;
  onClose: () => void;
}

type Input = ReturnType<typeof useState>[0]["input"];
type SetState = ReturnType<typeof useState>[1];
