
import React, { useState, useEffect } from 'react';
import { InstagramIcon, HeartIcon } from './IconComponents';
import { db } from '../services/database';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';

export const Footer: React.FC = () => {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const { isAuthenticated, openAuthModal } = useAuth();
  const donationLink = "https://www.paypal.com/ncp/payment/DS633BX7ARY3Y";

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const users = await db.getUsers();
        // Filter out any admin accounts from the subscriber count
        const subscribers = users.filter(user => !user.isAdmin);
        setSubscriberCount(subscribers.length);
      } catch (error) {
        console.error("Failed to fetch subscriber count:", error);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
              <p className="text-sm text-gray-300">
                &copy; {new Date().getFullYear()} Bidding Insight AI. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Developed by Goletti Investments CC. Bidding Insight AI is a non-profit organisation.
              </p>
          </div>
          
          {isAuthenticated ? (
             subscriberCount !== null && (
                <p className="text-sm text-gray-300">
                  Total Subscribers: <span className="font-bold text-brand-gold-light">{subscriberCount}</span>
                </p>
              )
          ) : (
            <Button variant="primary" onClick={openAuthModal}>
              Sign Up / Sign In
            </Button>
          )}

          <div className="flex items-center space-x-4">
            <a href={donationLink} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" className="!text-white hover:!bg-brand-blue-light/20 flex items-center">
                <HeartIcon className="w-5 h-5 mr-2 text-brand-gold-light" />
                Donate
              </Button>
            </a>
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
