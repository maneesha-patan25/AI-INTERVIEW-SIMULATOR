import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "@/layouts/public-layout";
import AuthenticationLayout from "@/layouts/auth-layout";
import HomePage from "@/routes/home";
import SignInPage from "@/routes/sign-in";
import SignOutPage from "@/routes/sign-out";
import ProtectRoutes from "./layouts/protected-routes";// Adjust if needed
import MainLayout from "@/layouts/main-layout.tsx" // Adjust if needed

 const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Authentication layout */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signin/*" element={<SignInPage />} />
          <Route path="/signout/*" element={<SignOutPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={
          <ProtectRoutes>
            <MainLayout />
          </ProtectRoutes>
        }>
          {/* Add protected child routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
