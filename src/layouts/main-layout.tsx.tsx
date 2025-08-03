import { Outlet } from "react-router-dom";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Container } from "@/components/container"; // ✅ Adjust path if needed

// Main layout for all public pages
export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header displayed on all pages */}
      <Header />

      {/* Main content rendered based on route */}
      <Container className="flex-grow">
        <main className="flex-grow">
          <Outlet />
        </main>
      </Container>

      {/* Footer displayed on all pages */}
      <Footer />
    </div>
  );
};

export default MainLayout;
