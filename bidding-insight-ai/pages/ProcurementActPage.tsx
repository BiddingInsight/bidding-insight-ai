
import React from 'react';

const ActSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <details className="mb-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <summary className="font-bold text-lg text-brand-blue-dark p-4 cursor-pointer hover:bg-gray-100 transition-colors">
      {title}
    </summary>
    <div className="p-4 border-t border-gray-200 prose prose-sm max-w-none">
      {children}
    </div>
  </details>
);

export const ProcurementActPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blue-dark">Public Procurement Act 15 of 2015</h1>
          <p className="mt-2 text-lg text-gray-600">As amended by Public Procurement Amendment Act 3 of 2022.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <ActSection title="PART 1: INTRODUCTORY PROVISIONS">
            <p><strong>1. Definitions:</strong> Defines key terms used in the Act like "accounting officer", "bid", "public entity", etc.</p>
            <p><strong>2. Objects of Act:</strong> Aims to promote integrity, accountability, transparency, and value for money in public procurement.</p>
            <p><strong>3. Application of Act:</strong> Applies to all procurement of goods, works, and services by public entities.</p>
            <p><strong>4. Exemptions:</strong> Allows the Minister to exempt certain security-related procurements.</p>
            <p><strong>5. Determination of procurement policy:</strong> The Minister determines policy on procurement, including preferences.</p>
          </ActSection>
          <ActSection title="PART 2: PROCUREMENT POLICY UNIT">
            <p><strong>6. Procurement Policy Unit:</strong> Establishes a specialised unit within the Ministry of Finance.</p>
            <p><strong>7. Functions of Policy Unit:</strong> Includes advising the Minister, monitoring compliance, preparing guidelines, and conducting training.</p>
          </ActSection>
          <ActSection title="PART 3: CENTRAL PROCUREMENT BOARD OF NAMIBIA">
             <p><strong>8. Establishment:</strong> Establishes the Central Procurement Board of Namibia as a juristic person.</p>
             <p><strong>9. Powers and functions:</strong> Conducts bidding processes for contracts exceeding prescribed thresholds.</p>
             <p><strong>10-18A:</strong> Covers fiduciary duties, constitution, term of office, and other governance aspects of the Board.</p>
          </ActSection>
          <ActSection title="PART 5: METHODS OF PROCUREMENT">
            <p><strong>27. Choice of procurement methods:</strong> Lists available methods like open bidding, restricted bidding, request for quotations, etc.</p>
            <p><strong>28-38:</strong> Details the conditions and procedures for each procurement method, such as open national/international bidding, emergency procurement, and electronic reverse auctions.</p>
          </ActSection>
          <ActSection title="PART 6: BIDDING PROCESS">
            <p><strong>39-57:</strong> Outlines the entire bidding process from invitation, pre-qualification, bidding documents, submission, opening, evaluation, to the award of contracts.</p>
          </ActSection>
          <ActSection title="PART 7: REVIEW">
            <p><strong>58-61:</strong> Establishes a Review Panel to handle applications for review from aggrieved bidders and outlines the procedures for such reviews.</p>
          </ActSection>
           <ActSection title="PART 11: PREFERENCES">
            <p><strong>69-72:</strong> Details provisions for granting preferential treatment in procurement to support developmental and empowerment policies, including national preferences and exclusive preference for local suppliers.</p>
          </ActSection>
          <p className="text-center text-gray-500 mt-8">... and other parts including General Provisions, Transitional Provisions, etc. This is a summary for demonstration.</p>
        </div>
      </div>
    </div>
  );
};
