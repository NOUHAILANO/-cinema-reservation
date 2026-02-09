import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import { FavoritesProvider } from "./context/useFavorites";
import { DataProvider } from "./context/DataContext";
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DataProvider>
    <UserProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </UserProvider>
  </DataProvider>
);