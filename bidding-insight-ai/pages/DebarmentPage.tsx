
import React from 'react';
import { MOCK_SUSPENDED_ENTITIES } from '../services/mockData';

export const DebarmentPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blue-dark">Debarment & Suspension List</h1>
          <p className="mt-2 text-lg text-gray-600">List of suppliers suspended from participating in public procurement.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3">Entity Name</th>
                  <th scope="col" className="px-6 py-3">Reason for Suspension</th>
                  <th scope="col" className="px-6 py-3">Suspension Period</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SUSPENDED_ENTITIES.map(entity => (
                  <tr key={entity.id} className="bg-white border-b hover:bg-gray-50">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {entity.name}
                    </th>
                    <td className="px-6 py-4">
                      {entity.reason}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(entity.suspendedFrom).toLocaleDateString('en-CA')} to {new Date(entity.suspendedTo).toLocaleDateString('en-CA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
