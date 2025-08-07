import React from "react";
import Navbar from "../components/Navbar/Navbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="page-content">{children}</div>
    </>
  );
};

export default MainLayout;
