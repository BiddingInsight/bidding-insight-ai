
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MAIN_NAV_LINKS, DROPDOWN_NAV_LINKS } from '../constants';
import { Button } from './Button';
import { ChevronDownIcon } from './IconComponents';

const NavItem: React.FC<{
  link: { name: string; path: string; authRequired: boolean; };
  isProtected: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}> = ({ link, isProtected, onClick, className = '' }) => (
  <NavLink
    to={isProtected ? '#' : link.path}
    end={link.path === '/'}
    onClick={onClick}
    className={({ isActive }) =>
      `${className} ${
        isProtected ? 'cursor-pointer' : ''
      } ${isActive ? 'text-brand-blue-light font-semibold' : ''}`
    }
  >
    {link.name}
  </NavLink>
);

export const Header: React.FC = () => {
  const { isSignedUp, promptSignUp } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, isProtected: boolean) => {
    if (isProtected) {
      e.preventDefault();
      promptSignUp();
    } else {
        setIsDropdownOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <NavLink to="/" className="flex items-center space-x-3">
              <img className="h-14 w-14" src="https://i.imgur.com/vJ4JFlB.png" alt="Bidding Insight Logo" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-brand-blue-dark uppercase tracking-wider">Bidding</span>
                <span className="text-xl font-bold text-brand-gold uppercase tracking-wider">Insight</span>
              </div>
            </NavLink>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {MAIN_NAV_LINKS.map((link) => {
              const isProtected = link.authRequired && !isSignedUp;
              return (
                <NavItem
                  key={link.name}
                  link={link}
                  isProtected={isProtected}
                  onClick={(e) => handleLinkClick(e, isProtected)}
                  className="text-base font-medium transition-colors text-gray-600 hover:text-brand-blue-light"
                />
              );
            })}
             <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                <button
                    type="button"
                    className="flex items-center text-base font-medium transition-colors text-gray-600 hover:text-brand-blue-light focus:outline-none"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span>More</span>
                    <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                       {DROPDOWN_NAV_LINKS.map((link) => {
                         const isProtected = link.authRequired && !isSignedUp;
                         return (
                            <NavItem
                                key={link.name}
                                link={link}
                                isProtected={isProtected}
                                onClick={(e) => handleLinkClick(e, isProtected)}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-blue w-full text-left"
                            />
                         )
                       })}
                    </div>
                )}
            </div>
          </nav>
          <div className="hidden md:block">
            {!isSignedUp && (
              <Button onClick={promptSignUp} variant="primary">
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
