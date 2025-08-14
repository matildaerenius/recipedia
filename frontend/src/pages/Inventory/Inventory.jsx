import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredients,
  addIngredient,
  deleteIngredient,
  updateIngredient,
} from "../../Redux/Inventory/inventory.action.js";
import "./Inventory.css";

const UNITS = [
  "ST",
  "KG",
  "HG",
  "G",
  "PACK",
  "L",
  "DL",
  "CL",
  "ML",
  "MSK",
  "TSK",
  "KRM",
];

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
    unit: "ST",
  });

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    dispatch(addIngredient(newIngredient));
    setModalOpen(false);
    setNewIngredient({ name: "", category: "OTHER", quantity: 1, unit: "ST" });
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
      <div className="container">
        {/* HEADER-KORT SOM PÅ HOME */}
        <div className="card search-header">
          <div className="search-header-content">
            <h1>My Inventory</h1>
            <div className="top-row">
              <button
                className="search-button"
                onClick={() => setModalOpen(true)}
              >
                + Add Ingredient
              </button>
            </div>
          </div>
        </div>

        {/* INVENTORY-INNEHÅLL */}
        <div className="inventory-grid">
          {CATEGORIES.map((category) => (
            <div key={category} className="category-card">
              <div className="category-title">{category}</div>
              <div className="ingredients-scroll">
                {ingredientsByCategory[category]?.map((item) => (
                  <div key={item.id} className="ingredient-item">
                    <span>
                      {item.name} ({item.quantity ?? 0}
                      {item.unit ? ` ${item.unit}` : ""})
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

        {/* ADD MODAL */}
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
                  min="0"
                  step="0.001"
                  placeholder="Quantity"
                  value={newIngredient.quantity}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      quantity:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                  required
                />

                <select
                  value={newIngredient.unit}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      unit: e.target.value.toUpperCase(),
                    })
                  }
                  required
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

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

        {/* EDIT MODAL */}
        {editIngredient && (
          <div
            className="modal-backdrop"
            onClick={() => setEditIngredient(null)}
          >
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
                  min="0"
                  step="0.001"
                  value={editIngredient.quantity}
                  onChange={(e) =>
                    setEditIngredient({
                      ...editIngredient,
                      quantity:
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                    })
                  }
                />

                <select
                  value={editIngredient.unit}
                  onChange={(e) =>
                    setEditIngredient({
                      ...editIngredient,
                      unit: e.target.value.toUpperCase(),
                    })
                  }
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <select
                  value={editIngredient.category}
                  onChange={(e) =>
                    setEditIngredient({
                      ...editIngredient,
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
    </div>
  );
};

export default Inventory;
