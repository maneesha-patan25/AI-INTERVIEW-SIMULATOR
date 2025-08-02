import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import Footer from "@/components/footer";

// Main layout for all public pages (TypeScript version)
 export const PublicLayout: React.FC = () => {
  return (
    <div className="w-full">
      {/*handler to store the user data*}
      {/* Header displayed on all pages */}
      <Header />

      {/* Main content rendered based on route */}
      <Outlet />

      {/* Footer displayed on all pages */}
      <Footer />
    </div>
  );
};

export default PublicLayout;
