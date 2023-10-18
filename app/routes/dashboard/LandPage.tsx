import { Api, GitHub } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function LandPage(): JSX.Element {
  return (
    <Container sx={{ py: "20vh" }} maxWidth="sm">
      <Typography sx={{ mb: 2 }} variant="h1" align="center">
        Welcome to IVoiceUp HR System
      </Typography>

      <Typography sx={{ mb: 4 }} variant="h3" align="center">
        Start your journey with us as a trusted HR employee now.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gridGap: "1rem",
        }}
      >
        <Link to="/signup">
          <Button
            variant="outlined"
            size="large"
            children="Let's begin"
            startIcon={<Api />}
          />
        </Link>
        <Button
          variant="outlined"
          size="large"
          href="https://github.com/YusefNsar/hr-system-interface"
          children="View on GitHub"
          startIcon={<GitHub />}
        />
      </Box>
    </Container>
  );
}
