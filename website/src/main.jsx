import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import HomePage from "./Pages/HomePage.jsx"
import CreateProduct from "./Pages/CreateProduct.jsx";
import Orders from "./Pages/Orders.jsx";
import Products from "./Pages/Products.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateProduct />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/products" element={<Products />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
      <RouterProvider router={router} />
  // </Provider>
);