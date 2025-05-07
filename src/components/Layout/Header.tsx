import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "/images/logo.png";


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm p-2">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <img src={logo} alt="Logo" />

        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
        >
          <span>DBI Photoboth</span>
        </Link>

        <nav>
          <ul className="flex gap-6">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;