import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/auth.reducer";
import inventoryReducer from "./Inventory/inventory.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  inventory: inventoryReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;