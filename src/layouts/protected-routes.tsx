import { useAuth } from "@clerk/clerk-react";
import LoaderPage from "@/routes/loader-page";
import { Navigate } from "react-router-dom";
import React from "react";

interface ProtectRoutesProps {
  children: React.ReactNode;
}

const ProtectRoutes = ({ children }: ProtectRoutesProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoaderPage />;
  }

  if (!isSignedIn) {
    return <Navigate to={"/signin"} replace />;
  }

  return <>{children}</>;
};

export default ProtectRoutes;
