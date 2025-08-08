import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Favorites from "./pages/Favorites/Favorites";
import Profile from "./pages/Profile/Profile";
import MealPlan from "./pages/MealPlan/MealPlan";
import ShoppingList from "./pages/ShoppingList/ShoppingList";
import MainLayout from "./layout/MainLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={1500} />

      <Routes>
        {/* Public route (no navbar) */}
        <Route path="/auth" element={<Authentication />} />

        {/* Protected routes with Navbar */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
        <Route path="/favorites" element={<MainLayout><Favorites /></MainLayout>} />
        <Route path="/mealplan" element={<MainLayout><MealPlan /></MainLayout>} />
        <Route path="/shoppinglist" element={<MainLayout><ShoppingList /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
