
import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { Tender, TenderStatus } from '../types';
import { Spinner } from '../components/Spinner';
import { TenderCard } from '../components/TenderCard';

export const CancelledTendersPage: React.FC = () => {
  const [cancelledTenders, setCancelledTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenders = async () => {
      setIsLoading(true);
      try {
        const allTenders = await db.getTenders();
        const filteredTenders = allTenders.filter(
          (tender) => tender.status === TenderStatus.Cancelled
        );
        setCancelledTenders(filteredTenders);
      } catch (error) {
        console.error("Failed to load cancelled tenders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTenders();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-blue-dark">
            Cancelled Tenders
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            A list of tenders that have been cancelled by the procuring entities.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-10">
              <Spinner size="lg" />
            </div>
          ) : cancelledTenders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700">No Cancelled Tenders Found</h3>
              <p className="text-gray-500 mt-2">
                There are currently no tenders listed with a "Cancelled" status.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {cancelledTenders.map((tender) => (
                <TenderCard key={tender.id} tender={tender} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
