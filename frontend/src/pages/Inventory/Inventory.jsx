import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredients,
  addIngredient,
  deleteIngredient,
} from "../../Redux/Inventory/inventory.action.js";
import "./Inventory.css";

const CATEGORIES = [
  "VEGETABLE",
  "FRUIT",
  "MEAT",
  "FISH",
  "DAIRY",
  "GRAIN",
  "SPICE",
  "FROZEN",
  "LEGUME",
  "SAUCE",
  "OTHER",
];

const Inventory = () => {
  const dispatch = useDispatch();
  const { ingredients } = useSelector((state) => state.inventory);

  const [modalOpen, setModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "VEGETABLE",
    quantity: 1,
  });

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    dispatch(addIngredient(newIngredient));
    setModalOpen(false);
    setNewIngredient({ name: "", category: "VEGETABLE", quantity: 1 });
  };

  const handleDelete = (id) => {
    dispatch(deleteIngredient(id));
  };

  const ingredientsByCategory = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = ingredients.filter((i) => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="inventory-page">
      <h1 className="inventory-header">My Inventory</h1>

      <button className="add-button" onClick={() => setModalOpen(true)}>
        + Add Ingredient
      </button>

      <div className="inventory-grid">
        {CATEGORIES.map((category) => (
          <div key={category} className="category-card">
            <div className="category-title">{category}</div>
            <div className="ingredients-scroll">
              {ingredientsByCategory[category]?.map((item) => (
                <div key={item.id} className="ingredient-item">
                  {item.name} ({item.quantity ?? 0})
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Ingredient</h2>
            <form onSubmit={handleAddIngredient}>
              <input
                type="text"
                placeholder="Name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
              <select
                value={newIngredient.category}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    category: e.target.value,
                  })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button type="submit" className="submit-btn">
                Add
              </button>
            </form>
            <button className="close-btn" onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
