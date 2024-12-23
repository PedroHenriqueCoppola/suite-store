import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import History from "./pages/History";
import About from "./pages/About";
import Error from "./pages/Error";

const Router = () => {
   return(
        <Routes>
            <Route element={<Home />} path="/" exact />

            <Route element={<Products />} path="/products" />

            <Route element={<Categories />} path="/categories" />

            <Route element={<History />} path="/history" />

            <Route element={<About />} path="/about" />

            <Route element={<Error />} path="*" />
        </Routes>
   )
}

export default Router;