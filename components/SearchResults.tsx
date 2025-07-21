import React from 'react';
import { Tender } from '../types';
import { useAuth } from '../hooks/useAuth';
import { TenderCard } from './TenderCard';
import { Button } from './Button';
import { SparklesIcon } from './IconComponents';

interface SearchResultsProps {
  summary: string;
  tenders: Tender[];
  onClear: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ summary, tenders, onClear }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold text-brand-blue-dark flex items-center">
                <SparklesIcon className="w-6 h-6 mr-3 text-brand-gold" />
                AI-Powered Search Results
            </h2>
            <p className="mt-2 text-gray-700">{summary}</p>
        </div>
        <Button onClick={onClear} variant="ghost" className="flex-shrink-0 self-start sm:self-center">Clear Search</Button>
      </div>

      <div className="space-y-6">
        {tenders.length > 0 ? (
          <>
            {isAuthenticated ? (
              tenders.map(tender => <TenderCard key={tender.id} tender={tender} />)
            ) : (
              <div className="text-center py-12 px-6 bg-blue-50 rounded-lg border-2 border-dashed border-brand-blue-light">
                <h3 className="text-xl font-bold text-brand-blue-dark">
                  Found {tenders.length} relevant tender{tenders.length > 1 ? 's' : ''}.
                </h3>
                <p className="text-gray-600 mt-2 mb-4">Sign up or sign in to view the full tender details and get AI insights.</p>
                <Button onClick={openAuthModal} variant="primary">
                  Sign Up / Sign In to View
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-8">No specific tenders were identified for this query.</p>
        )}
      </div>
    </div>
  );
};