
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MAIN_NAV_LINKS } from '../constants';
import { Button } from './Button';
import { BiddingInsightLogo, MenuIcon, CloseIcon, ShieldCheckIcon, HeartIcon } from './IconComponents';

const { NavLink } = ReactRouterDOM;

const NavItem: React.FC<{
  link: { name: string; path: string; authRequired: boolean; };
  isProtected: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  mobile?: boolean;
}> = ({ link, isProtected, onClick, className = '', mobile = false }) => (
  <NavLink
    to={isProtected ? '#' : link.path}
    end={link.path === '/'}
    onClick={onClick}
    className={({ isActive }) =>
      `${className} ${
        isProtected ? 'cursor-pointer' : ''
      } ${isActive ? (mobile ? 'bg-blue-50 border-brand-blue-light text-brand-blue-dark' : 'text-brand-blue-light font-semibold') : ''}`
    }
  >
    {link.name}
  </NavLink>
);

export const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, isProtected: boolean) => {
    if (isProtected) {
      e.preventDefault();
      openAuthModal();
    } else {
        setIsMobileMenuOpen(false);
    }
  };
  
  const adminLink = { name: 'Admin', path: '/admin', authRequired: true };
  const donationLink = "https://www.paypal.com/ncp/payment/DS633BX7ARY3Y";

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3">
              <BiddingInsightLogo className="h-14 w-14" />
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold text-brand-blue-dark uppercase tracking-wider">Bidding</span>
                <span className="text-xl font-bold text-brand-gold uppercase tracking-wider">Insight</span>
              </div>
            </NavLink>
             <a href={donationLink} target="_blank" rel="noopener noreferrer" className="ml-4 hidden md:block">
                <Button variant="primary" className="!px-3 !py-2 flex items-center">
                    <HeartIcon className="w-5 h-5 mr-1"/>
                    <span className="hidden lg:inline">Donate</span>
                </Button>
            </a>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {MAIN_NAV_LINKS.map((link) => {
              const isProtected = link.authRequired && !isAuthenticated;
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
            {isAdmin && (
                <NavLink
                    to={adminLink.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                        `flex items-center text-base font-medium transition-colors text-gray-600 hover:text-brand-blue-light ${
                        isActive ? 'text-brand-blue-light font-semibold' : ''
                        }`
                    }
                >
                    <ShieldCheckIcon className="w-5 h-5 mr-1" />
                    {adminLink.name}
                </NavLink>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue-light"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <CloseIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {MAIN_NAV_LINKS.map((link) => {
                const isProtected = link.authRequired && !isAuthenticated;
                return (
                <NavItem
                    key={link.name}
                    link={link}
                    isProtected={isProtected}
                    onClick={(e) => handleLinkClick(e, isProtected)}
                    mobile
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue-dark hover:bg-gray-50 border-l-4 border-transparent"
                />
                );
            })}
             {isAdmin && (
                <NavItem
                    key={adminLink.name}
                    link={adminLink}
                    isProtected={false} // Already authenticated if isAdmin is true
                    onClick={(e) => handleLinkClick(e, false)}
                    mobile
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue-dark hover:bg-gray-50 border-l-4 border-transparent"
                />
            )}
            </div>
            <div className="py-3 border-t border-gray-200">
             <div className="px-5">
                 <a href={donationLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="primary" className="w-full flex items-center justify-center">
                        <HeartIcon className="w-5 h-5 mr-2"/>
                        Support Us
                    </Button>
                </a>
            </div>
            </div>
        </div>
      )}
    </header>
  );
};
