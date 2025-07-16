
import React from 'react';
import { REGIONS, INDUSTRIES } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface FilterPanelProps {
  onRegionChange: (region: string) => void;
  onIndustryChange: (industry: string) => void;
  selectedRegion: string;
  selectedIndustry: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onRegionChange, onIndustryChange, selectedRegion, selectedIndustry }) => {
  const { isSignedUp, promptSignUp } = useAuth();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>, callback: (value: string) => void) => {
    if (!isSignedUp) {
      promptSignUp();
      e.target.value = "All"; // Reset select if not signed up
    } else {
      callback(e.target.value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-brand-blue-dark mb-4">Filter Tenders</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <select
            id="region-filter"
            value={selectedRegion}
            onChange={(e) => handleFilterChange(e, onRegionChange)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white"
          >
            <option value="All">All Regions</option>
            {REGIONS.map(region => <option key={region} value={region}>{region}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="industry-filter" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select
            id="industry-filter"
            value={selectedIndustry}
            onChange={(e) => handleFilterChange(e, onIndustryChange)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white"
          >
            <option value="All">All Industries</option>
            {INDUSTRIES.map(industry => <option key={industry} value={industry}>{industry}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
