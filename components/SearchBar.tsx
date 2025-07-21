
import React, { useState } from 'react';
import { SearchIcon } from './IconComponents';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about tenders or the Procurement Act..."
        className="w-full pl-10 pr-32 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
        disabled={isLoading}
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>
      <button 
        type="submit" 
        className="absolute inset-y-0 right-0 m-1 flex items-center px-6 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue-light transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};
