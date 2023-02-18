import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./scenes/dashboard/Dashboard";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout";
import Products from "./scenes/products";
import Users from "./scenes/users";
import Orders from "./scenes/orders";
import NewOrder from "./scenes/orders/NewOrder";
import EditOrder from "./scenes/orders/EditOrder";
import NewProduct from "./scenes/products/NewProduct";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/new" element={<NewProduct />} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<NewOrder />} />
              <Route path="/orders/:id" element={<EditOrder />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
