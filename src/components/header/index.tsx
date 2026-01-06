import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <AppBar position="sticky" elevation={0} color="transparent" className="bg-[rgba(255,255,255,0.9)]!">
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3 } }}>
        <Box className="flex items-center gap-2 flex-1">
          <IconButton size="small" onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
          <Box className="flex items-center gap-2">
            <Box className="leading-tight">
              <Box className="font-semibold text-slate-900">Salon App</Box>
              <Box className="text-sm text-slate-500">Discover &amp; Book</Box>
            </Box>
          </Box>
        </Box>
        <Box className="flex items-center gap-2">
          <Box className="w-9 h-9 rounded-full bg-slate-200" />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
