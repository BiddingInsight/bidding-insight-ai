
import React from 'react';
import { PROCUREMENT_ACT_CONTENT } from '../services/procurementActData';

const ActSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="mb-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <summary className="font-bold text-lg text-brand-blue-dark p-4 cursor-pointer hover:bg-gray-100 transition-colors">
      {title}
    </summary>
    <div className="p-4 border-t border-gray-200 prose prose-sm max-w-none text-gray-800">
      {children}
    </div>
  </details>
);

export const ProcurementActPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-blue-dark">Public Procurement Act 15 of 2015</h1>
          <p className="mt-2 text-lg text-gray-600">As amended by Public Procurement Amendment Act 3 of 2022.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          {PROCUREMENT_ACT_CONTENT.map((section) => (
            <ActSection key={section.title} title={section.title}>
              {section.points.map((p, i) => <p key={i}>{p}</p>)}
            </ActSection>
          ))}
          <p className="text-center text-gray-500 mt-8">... and other parts including General Provisions, Transitional Provisions, etc. This is a summary for demonstration.</p>
        </div>
      </div>
    </div>
  );
};
