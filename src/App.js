import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Dashboard from "./scenes/dashboard/Dashboard";
import { themeSettings } from "./theme";
import Layout from "./scenes/layout";
import GeneralLayout from "./components/GeneralLayout";
import Products from "./scenes/products";
import Users from "./scenes/users";
import Orders from "./scenes/orders";
import NewOrder from "./scenes/orders/NewOrder";
import EditOrder from "./scenes/orders/EditOrder";
import NewProduct from "./scenes/products/NewProduct";
import EditProduct from "./scenes/products/EditProduct";
import Scaccounts from "./scenes/scaccounts";
import Login from "./scenes/auth/Login";
import PersistLogin from "./scenes/auth/PersistLogin";
import RequireAuth from "./scenes/auth/RequireAuth";
import { ROLES } from "./config/roles";

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <HashRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<GeneralLayout />}>
              {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

              {/** Public Routes */}
              <Route index element={<Login />} />
              <Route path="login" element={<Login />} />

              {/** Protected Routes */}
              <Route element={<PersistLogin />}>
                <Route
                  element={
                    <RequireAuth allowedRoles={[...Object.values(ROLES)]} />
                  }
                >
                  <Route path="managment" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products">
                      <Route index element={<Products />} />
                      <Route
                        element={<RequireAuth allowedRoles={[ROLES.Admin]} />}
                      >
                        <Route path=":id" element={<EditProduct />} />
                        <Route path="new" element={<NewProduct />} />
                      </Route>
                    </Route>
                    <Route path="users">
                      <Route index element={<Users />} />
                    </Route>
                    <Route path="orders">
                      <Route index element={<Orders />} />
                      <Route path=":id" element={<EditOrder />} />
                      <Route path="new" element={<NewOrder />} />
                    </Route>
                    <Route
                      element={<RequireAuth allowedRoles={[ROLES.Admin]} />}
                    >
                      <Route path="scaccounts">
                        <Route index element={<Scaccounts />} />
                      </Route>
                    </Route>
                  </Route>
                  {/** END Managment */}
                </Route>
              </Route>
              {/** END Protected Routes */}
            </Route>
          </Routes>
        </ThemeProvider>
      </HashRouter>
    </div>
  );
}

export default App;
