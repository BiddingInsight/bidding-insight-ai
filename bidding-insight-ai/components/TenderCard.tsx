
import React, { useState } from 'react';
import { Tender, TenderStatus } from '../types';
import { CalendarIcon, BuildingOfficeIcon, StatusOnlineIcon, SparklesIcon } from './IconComponents';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';
import { getTenderInsight } from '../services/geminiService';
import { Spinner } from './Spinner';

interface TenderCardProps {
  tender: Tender;
}

const statusColors: { [key in TenderStatus]: string } = {
  [TenderStatus.Open]: 'bg-green-100 text-green-800',
  [TenderStatus.Awarded]: 'bg-blue-100 text-blue-800',
  [TenderStatus.Closed]: 'bg-yellow-100 text-yellow-800',
  [TenderStatus.Cancelled]: 'bg-red-100 text-red-800',
};

export const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
  const { isSignedUp, promptSignUp } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const handleGetInsight = async () => {
    if (!isSignedUp) {
      promptSignUp();
      return;
    }
    setIsLoadingInsight(true);
    setInsight(null);
    const result = await getTenderInsight(tender.description);
    setInsight(result);
    setIsLoadingInsight(false);
    setShowDetails(true);
  };
  
  const formattedDate = new Date(tender.closingDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-brand-blue-dark leading-tight">{tender.title}</h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[tender.status]}`}>
            {tender.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{tender.referenceNumber}</p>
        
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{tender.entity}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>Closing: {formattedDate}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
           <Button variant="secondary" onClick={handleGetInsight} disabled={isLoadingInsight}>
             <div className="flex items-center">
                {isLoadingInsight ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                <span>{isLoadingInsight ? 'Analyzing...' : 'Get AI Insight'}</span>
             </div>
           </Button>
           <Button variant="ghost" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide Details' : 'View Details'}
           </Button>
        </div>
      </div>

      {showDetails && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <h4 className="font-semibold text-brand-blue-dark mb-2">Tender Description</h4>
          <p className="text-gray-600 text-sm mb-4">{tender.description}</p>
          
          {insight && (
             <div>
                <h4 className="font-semibold text-brand-blue-dark mb-2 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-brand-gold"/>
                    AI Generated Insight
                </h4>
                <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} />
             </div>
          )}
        </div>
      )}
    </div>
  );
};
