import React from "react";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <h1>Welcome to Recipedia Home</h1>
        <p>Here you can explore, save and manage your favorite recipes.</p>
      </div>
    </>
  );
};

export default Home;
