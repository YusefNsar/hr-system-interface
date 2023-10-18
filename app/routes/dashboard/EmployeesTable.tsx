import EditIcon from "@mui/icons-material/Edit";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import * as React from "react";
import { useAttendances } from "../../core/attendences.js";
import { User } from "../../core/auth.js";
import { useEmployees } from "../../core/employees.js";
import { AttendanceDialog } from "../../dialogs/AttendanceDialog.js";
import { EmployeeDialog } from "../../dialogs/EmployeeDialog.js";

export default function EmployeesTable() {
  const [state, setState] = useState();
  const employees = useEmployees();
  const openEmployeeDialog = useOpenEmployeeDialog(setState);
  const openLogDialog = useOpenLogDialog(setState);
  const getColumns = useTableColumns(openEmployeeDialog, openLogDialog);
  const columns = getColumns();

  return (
    <Box sx={{ height: 800, width: "100%" }}>
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Typography variant="h2" fontWeight={"bold"}>
          Company Employees
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => openEmployeeDialog()}
        >
          New Employee
        </Button>
      </Stack>
      <DataGrid
        rows={employees || []}
        getRowId={(e) => e._id}
        columns={columns}
        loading={employees === null}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        autoPageSize
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      <EmployeeDialog
        open={state.open}
        onClose={() =>
          setState({ open: false, openLog: false, employee: undefined })
        }
        employee={state.employee}
      />
      <AttendanceDialog
        open={state.openLog}
        onClose={() =>
          setState({ open: false, openLog: false, employee: undefined })
        }
        employee={state.employee}
      />
    </Box>
  );
}

function useState() {
  const [state, setState] = React.useState({
    open: false,
    openLog: false,
    employee: undefined as User | undefined,
  });

  return [state, setState] as const;
}

function useOpenEmployeeDialog(setState: SetState) {
  return React.useCallback(
    (employee?: User) => {
      setState((prev) => ({
        ...prev,
        open: true,
        employee,
      }));
    },
    [setState],
  );
}

function useOpenLogDialog(setState: SetState) {
  return React.useCallback(
    (employee?: User) => {
      setState((prev) => ({
        ...prev,
        openLog: true,
        employee,
      }));
    },
    [setState],
  );
}

function useTableColumns(
  openEmployeeDialog: (employee?: User | undefined) => void,
  openLogDialog: (employee?: User | undefined) => void,
) {
  const attendances = useAttendances();

  return React.useCallback(() => {
    const columns: GridColDef[] = [
      {
        field: "name",
        headerName: "Name",
        description: "Employee name.",
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        description: "Employee email.",
        width: 250,
      },
      {
        field: "group",
        headerName: "Group",
        description:
          "The group of employees the employee belongs to, e.g. Accounting.",
        width: 120,
        groupable: true,
      },
      {
        field: "edit",
        headerName: "Edit",
        description: "Edit employee's data.",
        sortable: false,
        align: "center",
        headerAlign: "center",
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
          const employee = params.row;

          return (
            <IconButton
              color="primary"
              onClick={() => openEmployeeDialog({ ...employee })}
              children={<EditIcon />}
            />
          );
        },
      },
      {
        field: "log",
        headerName: "Log Attendance",
        description: "Log attendance/worked hours for employee.",
        sortable: false,
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => {
          const employee = params.row;

          return (
            <IconButton
              onClick={() => openLogDialog({ ...employee })}
              children={<MoreTimeIcon />}
            />
          );
        },
      },
      {
        field: "view attendance",
        headerName: "Work Record",
        description: "View logged attendance/worked hours for employee.",
        sortable: false,
        align: "center",
        headerAlign: "center",
        width: 120,
        valueGetter: (params: GridValueGetterParams) => {
          const employee = params.row;

          const hoursWorked =
            (attendances
              ?.filter((att) => att.employee._id === employee._id)
              .reduce(
                (sum, att) => sum + (att.toEpochTime - att.fromEpochTime),
                0,
              ) ?? 0) /
            (1000 * 60 * 60);

          return `${hoursWorked.toFixed(2)} h`;
        },
      },
    ];

    return columns;
  }, [openEmployeeDialog, openLogDialog, attendances]);
}

type SetState = ReturnType<typeof useState>[1];
