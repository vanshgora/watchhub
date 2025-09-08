import {
  createBrowserRouter,
  Router,
  RouterProvider,
} from "react-router";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ProductList from "./pages/ProductList/ProductList";
import CartPage from "./pages/CartPage/CartPage";

let router = createBrowserRouter([
 {
    path: "/signup",
    Component: Signup
  },
  {
    path: "/login",
    Component: Login
  },
  {
    path: "/",
    Component: ProductList
  },
  {
    path: "/cart",
    Component: CartPage
  },
]);

export default router;