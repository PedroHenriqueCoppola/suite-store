import React from "react";
import { Route, BrowserRouter, Routes} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import History from "./pages/History";

const Router = () => {
   return(
        <Routes>
            <Route element={<Home />} path="/" exact />

            <Route element={<Products />} path="/products" />

            <Route element={<Categories />} path="/categories" />

            <Route element={<History />} path="/history" />
        </Routes>
   )
}

export default Router;