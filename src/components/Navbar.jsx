import { AppBar, IconButton, Toolbar, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { width } from "@mui/system";
import { setMode } from "../state";
import FlexBetween from "./FlexBetween";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
        }}
      >
        {/** LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>

        {/** RIGHT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
