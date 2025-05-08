import React from 'react';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from "/images/logo.png";


const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-7 flex items-center">
        <img src={logo} alt="Logo" className='w-12 mr-3' />

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#aa7247]"
        >
          <span>P5 Photoboth</span>
        </Link>

        <nav>
          <ul className="flex gap-6">
            <li>
            
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;