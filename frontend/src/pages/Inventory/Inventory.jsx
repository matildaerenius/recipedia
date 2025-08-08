import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredients,
  addIngredient,
  deleteIngredient,
  updateIngredient,
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
  const [editIngredient, setEditIngredient] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    category: "OTHER",
    quantity: 1,
  });

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    dispatch(addIngredient(newIngredient));
    setModalOpen(false);
    setNewIngredient({ name: "", category: "OTHER", quantity: 1 });
  };

  const handleDelete = (id) => {
    dispatch(deleteIngredient(id));
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    dispatch(updateIngredient(editIngredient.id, editIngredient));
    setEditIngredient(null);
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
                  <span>
                    {item.name} ({item.quantity ?? 0})
                  </span>
                  <div className="ingredient-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditIngredient(item)}
                    >
                      ✎
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      ✖
                    </button>
                  </div>
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
                    category: e.target.value.toUpperCase(),
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
      {editIngredient && (
        <div className="modal-backdrop" onClick={() => setEditIngredient(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Ingredient</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editIngredient.name}
                onChange={(e) =>
                  setEditIngredient({
                    ...editIngredient,
                    name: e.target.value,
                  })
                }
              />
              <input
                type="number"
                min="1"
                value={editIngredient.quantity}
                onChange={(e) =>
                  setEditIngredient({
                    ...editIngredient,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
              <select
                value={editIngredient.category}
                onChange={(e) =>
                  setEditIngredient({
                    ...editIngredient,
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
                Save
              </button>
            </form>
            <button
              className="close-btn"
              onClick={() => setEditIngredient(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
