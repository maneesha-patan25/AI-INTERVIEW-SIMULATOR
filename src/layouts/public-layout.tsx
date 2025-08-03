import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuthHandler from "@/handlers/auth-handleer";

// Main layout for all public pages (TypeScript version)
export const PublicLayout: React.FC = () => {
  return (
    <div className="w-full">
      {/* handler to store the user data */}
      <AuthHandler />
      <Header />

      {/* Main content rendered based on route */}
      <Outlet />

      {/* Footer displayed on all pages */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
