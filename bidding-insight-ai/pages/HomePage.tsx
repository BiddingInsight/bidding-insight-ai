
import React, { useState, useMemo } from 'react';
import { MOCK_TENDERS } from '../services/mockData';
import { TenderCard } from '../components/TenderCard';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { DashboardStats } from '../components/DashboardStats';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredTenders = useMemo(() => {
    return MOCK_TENDERS.filter(tender => {
      const matchesSearch =
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'All' || tender.region === selectedRegion;
      const matchesIndustry = selectedIndustry === 'All' || tender.industry === selectedIndustry;

      return matchesSearch && matchesRegion && matchesIndustry;
    });
  }, [searchQuery, selectedRegion, selectedIndustry]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue-dark">Find Your Next Big Opportunity</h1>
            <p className="mt-2 text-lg text-gray-600">Search and analyze thousands of tenders across Namibia.</p>
        </div>
        
        <div className="mb-8 max-w-3xl mx-auto">
            <SearchBar onSearch={setSearchQuery} />
        </div>
        
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FilterPanel 
              selectedRegion={selectedRegion}
              selectedIndustry={selectedIndustry}
              onRegionChange={setSelectedRegion}
              onIndustryChange={setSelectedIndustry}
            />
          </aside>
          
          <main className="lg:col-span-3">
            <div className="space-y-6">
              {filteredTenders.length > 0 ? (
                filteredTenders.map(tender => <TenderCard key={tender.id} tender={tender} />)
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-700">No Tenders Found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
