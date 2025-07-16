
import React from 'react';
import { InstagramIcon } from './IconComponents';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} Bidding Insight AI. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a 
              href="https://www.instagram.com/biddinginsight/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-brand-gold-light transition-colors"
              aria-label="Bidding Insight on Instagram"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
