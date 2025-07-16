
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_TENDERS } from '../services/mockData';
import { REGIONS } from '../constants';
import { TenderStatus } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-brand-blue-dark mt-1">{value}</p>
    <p className="text-gray-400 text-xs mt-2">{description}</p>
  </div>
);

export const DashboardStats: React.FC = () => {
    const openTenders = MOCK_TENDERS.filter(t => t.status === TenderStatus.Open).length;
    const awardedTenders = MOCK_TENDERS.filter(t => t.status === TenderStatus.Awarded).length;
    const closedTenders = MOCK_TENDERS.filter(t => t.status === TenderStatus.Closed).length;

    const tendersByRegion = REGIONS.map(region => ({
        name: region,
        tenders: MOCK_TENDERS.filter(t => t.region === region).length
    })).filter(r => r.tenders > 0);

    return (
        <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Open Tenders" value={openTenders} description="Actively accepting bids" />
                <StatCard title="Awarded Tenders" value={awardedTenders} description="In the last 90 days (sample)" />
                <StatCard title="Closed Tenders" value={closedTenders} description="Recently closed for bidding (sample)" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-brand-blue-dark mb-4">Tenders by Region (Sample Data)</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={tendersByRegion} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }}/>
                            <YAxis allowDecimals={false} />
                            <Tooltip cursor={{fill: 'rgba(217, 119, 6, 0.1)'}} />
                            <Bar dataKey="tenders" fill="#D97706" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
