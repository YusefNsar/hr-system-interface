/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container } from "@mui/material";
import { useCurrentUser } from "../../core/auth.js";
import { usePageEffect } from "../../core/page.js";
import EmployeesTable from "./EmployeesTable.js";
import { LandPage } from "./LandPage.js";

export function Component(): JSX.Element {
  usePageEffect({ title: "HR System" });
  const user = useCurrentUser();

  if (!user) {
    return <LandPage />;
  }

  return (
    <Container sx={{ py: "5vh" }} maxWidth="xl">
      <EmployeesTable />
    </Container>
  );
}

Component.displayName = "Dashboard";
