import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ThemeToggleButton from "@/shared/ui/ThemeToggleButton";

const NotFoundPage = () => (
  <Stack spacing={2} alignItems="flex-start">
    <Stack direction="row" justifyContent="flex-end" alignItems="center" width="100%">
      <ThemeToggleButton size="small" />
    </Stack>
    <Typography variant="h4">Page Not Found</Typography>
    <Typography variant="body1">The page you are looking for does not exist.</Typography>
  </Stack>
);

export default NotFoundPage;

