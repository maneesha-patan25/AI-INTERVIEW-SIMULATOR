import React from "react";
import { Outlet } from "react-router-dom";

export const Generate: React.FC = () => {
  return (
    <div className="flex flex-col md:px-12">
      <Outlet />
    </div>
  );
};
