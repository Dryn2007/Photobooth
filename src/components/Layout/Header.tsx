import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <Camera size={24} />
          <span>PhotoBooth</span>
        </Link>
        
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/scan" className="text-gray-600 hover:text-blue-600 transition-colors">
                Scan QR
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;