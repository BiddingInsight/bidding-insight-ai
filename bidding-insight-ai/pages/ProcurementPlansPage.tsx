
import React from 'react';
import { MOCK_PROCUREMENT_PLANS } from '../services/mockData';

export const ProcurementPlansPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blue-dark">Annual Procurement Plans</h1>
          <p className="mt-2 text-lg text-gray-600">Official procurement plans from public entities in Namibia.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {MOCK_PROCUREMENT_PLANS.map(plan => (
            <div key={plan.id} className="p-5 bg-white rounded-lg shadow-md border border-gray-200 flex justify-between items-center hover:border-brand-blue transition-all">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{plan.entity}</h2>
                    <p className="text-gray-500 text-sm">{plan.title}</p>
                    <p className="text-gray-500 text-sm mt-1">Period: {plan.period}</p>
                </div>
                <div>
                    <a href={plan.link} target="_blank" rel="noopener noreferrer" className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-brand-blue-light transition-colors">
                        View Plan
                    </a>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
