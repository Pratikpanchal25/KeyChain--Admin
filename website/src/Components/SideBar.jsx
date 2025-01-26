import React from "react";
import { Link } from "react-router-dom";
const SideBar = () => {
    return(
        <div className="w-64 bg-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-6">Admin Panel</div>
        <ul>
          <li className="mb-4">
            <Link to="/create" className="text-gray-300 hover:text-white">
              Create Product
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/orders" className="text-gray-300 hover:text-white">
              Orders
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/products" className="text-gray-300 hover:text-white">
              Products
            </Link>
          </li>
        </ul>
      </div>
    )
}

export default SideBar;