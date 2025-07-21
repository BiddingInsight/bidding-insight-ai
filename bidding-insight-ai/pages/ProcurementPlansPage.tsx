
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/database';
import { ProcurementPlan, Company } from '../types';
import { Spinner } from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { CloseIcon, PencilSquareIcon } from '../components/IconComponents';

const InterestManagementModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  allCompanies: Company[];
  userInterests: string[];
  onSave: (newInterests: string[]) => void;
}> = ({ isOpen, onClose, allCompanies, userInterests, onSave }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(userInterests);
    }
  }, [isOpen, userInterests]);

  const handleToggle = (companyId: string) => {
    setSelectedIds(prev =>
      prev.includes(companyId)
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(selectedIds);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <h3 className="text-xl font-bold mb-4">Manage Your Interests</h3>
        <p className="text-gray-600 mb-4">Select the entities you want to receive notifications and updates for.</p>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="max-h-64 overflow-y-auto border rounded-md p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allCompanies.map(company => (
            <div key={company.id} className="flex items-center">
              <input
                type="checkbox"
                id={`company-${company.id}`}
                checked={selectedIds.includes(company.id)}
                onChange={() => handleToggle(company.id)}
                className="h-4 w-4 text-brand-blue-light border-gray-300 rounded focus:ring-brand-blue"
              />
              <label htmlFor={`company-${company.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                {company.name}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="plain" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner size="sm" /> : 'Save Interests'}
          </Button>
        </div>
      </div>
    </div>
  );
};


export const ProcurementPlansPage: React.FC = () => {
  const { user, updateUserContext } = useAuth();
  const [allPlans, setAllPlans] = useState<ProcurementPlan[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [plansData, companiesData] = await Promise.all([
          db.getProcurementPlans(),
          db.getCompanies()
        ]);
        setAllPlans(plansData);
        setAllCompanies(companiesData);
      } catch (error) {
        console.error("Failed to load procurement data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveInterests = async (newInterests: string[]) => {
    await updateUserContext({ interestedEntityIds: newInterests });
  };

  const displayedPlans = useMemo(() => {
    if (!user || !user.interestedEntityIds || user.interestedEntityIds.length === 0) {
      return allPlans; // Show all if user has no specific interests
    }
    const interestedEntityNames = user.interestedEntityIds.map(id => {
      return allCompanies.find(c => c.id === id)?.name;
    }).filter(Boolean);
    
    return allPlans.filter(plan => interestedEntityNames.includes(plan.entity));
  }, [user, allPlans, allCompanies]);

  return (
    <>
      <InterestManagementModal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        allCompanies={allCompanies}
        userInterests={user?.interestedEntityIds || []}
        onSave={handleSaveInterests}
      />
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-blue-dark">Annual Procurement Plans</h1>
            <p className="mt-2 text-lg text-gray-600">Official procurement plans from public entities in Namibia.</p>
          </div>
          
          <div className="flex justify-center mb-12">
            <Button variant="secondary" onClick={() => setIsInterestModalOpen(true)}>
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Manage Interests
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-10"><Spinner /></div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {displayedPlans.length > 0 ? displayedPlans.map(plan => (
                <div key={plan.id} className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:items-center hover:border-brand-blue transition-all">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{plan.entity}</h2>
                        <p className="text-gray-500 text-sm">{plan.title}</p>
                        <p className="text-gray-500 text-sm mt-1">Period: {plan.period}</p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <a href={plan.link} target="_blank" rel="noopener noreferrer" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-brand-blue-light transition-colors w-full inline-block text-center sm:w-auto">
                            View Plan
                        </a>
                    </div>
                </div>
              )) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-700">No Plans to Display</h3>
                    <p className="text-gray-500 mt-2">
                        You are not currently following any entities with published plans, or no plans are available.
                    </p>
                    <Button className="mt-4" onClick={() => setIsInterestModalOpen(true)}>
                        Follow Entities
                    </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
