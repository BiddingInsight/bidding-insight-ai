
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/database';
import { SearchBar } from '../components/SearchBar';
import { DashboardStats } from '../components/DashboardStats';
import { Tender, ProcurementPlan } from '../types';
import { getTenderInsightsFromQuery } from '../services/geminiService';
import { SearchResults } from '../components/SearchResults';
import { Spinner } from '../components/Spinner';
import { PROCUREMENT_ACT_CONTENT } from '../services/procurementActData';

interface SearchResult {
  summary: string;
  relevantTenderIds: string[];
}

export const HomePage: React.FC = () => {
  const [allTenders, setAllTenders] = useState<Tender[]>([]);
  const [procurementPlans, setProcurementPlans] = useState<ProcurementPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [tendersData, plansData] = await Promise.all([
          db.getTenders(),
          db.getProcurementPlans(),
        ]);
        setAllTenders(tendersData);
        setProcurementPlans(plansData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        // Optionally, set an error state to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchResult(null);
    const result = await getTenderInsightsFromQuery(query, allTenders, PROCUREMENT_ACT_CONTENT);
    setSearchResult(result);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchResult(null);
    // After clearing search, the dashboard will show again.
    // We already have allTenders loaded.
  };

  const searchResultTenders = useMemo(() => {
    if (!searchResult) return [];
    return allTenders.filter(t => searchResult.relevantTenderIds.includes(t.id));
  }, [searchResult, allTenders]);


  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-brand-blue-dark">Find Your Next Big Opportunity</h1>
            <p className="mt-2 text-lg text-gray-600">Search for tenders or ask questions about the Procurement Act.</p>
        </div>
        
        <div className="mb-8 max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>
        
        {isSearching && (
            <div className="text-center py-16">
                <Spinner size="lg" />
                <p className="mt-4 text-lg text-gray-600">Our AI is analyzing tenders...</p>
            </div>
        )}

        {!isSearching && searchResult ? (
          <SearchResults 
            summary={searchResult.summary}
            tenders={searchResultTenders}
            onClear={handleClearSearch}
          />
        ) : !isSearching && (
            isLoading ? (
                <div className="text-center py-16"><Spinner size="lg" /></div>
            ) : (
                <>
                    {/* Image slideshow disabled to improve performance */}
                    <DashboardStats tenders={allTenders} procurementPlans={procurementPlans} />
                </>
            )
        )}
      </div>
    </div>
  );
};
