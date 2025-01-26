import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import SideBar from './Components/SideBar';

function App() {
  return (
    <div className="min-h-screen flex overflow-hidden bg-black text-white">
      <SideBar/>
      <div className="flex-1 bg-gray-900 p-8">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
