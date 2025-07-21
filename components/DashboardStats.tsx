
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { REGIONS } from '../constants';
import { Tender, TenderStatus, ProcurementPlan } from '../types';
import { SparklesIcon, CheckCircleIcon, NoSymbolIcon, ShieldCheckIcon, BuildingOfficeIcon, TrashIcon, DocumentTextIcon } from './IconComponents';

// Stat Card component
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string; colorClass: string; }> = ({ icon, title, value, colorClass }) => (
  <div className={`bg-white p-5 rounded-lg shadow-md border-l-4 ${colorClass} flex items-center`}>
    <div className="flex-shrink-0">{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);


export const DashboardStats: React.FC<{ tenders: Tender[], procurementPlans: ProcurementPlan[] }> = ({ tenders, procurementPlans }) => {
    // Stat Card data
    const openTenders = tenders.filter(t => t.status === TenderStatus.Open).length;
    const closedTenders = tenders.filter(t => t.status === TenderStatus.Closed).length;
    const awardedTenders = tenders.filter(t => t.status === TenderStatus.Awarded).length;
    const cancelledTenders = tenders.filter(t => t.status === TenderStatus.Cancelled).length;
    const totalTenders = tenders.length;
    const totalPlans = procurementPlans.length;

    // Data for Tenders by Region Bar Chart
    const tendersByRegion = REGIONS.map(region => ({
        name: region,
        tenders: tenders.filter(t => t.region === region).length
    })).filter(r => r.tenders > 0);

    // Data for Top 5 Entities Pie Chart
    const entityCounts = tenders.reduce((acc, tender) => {
        acc[tender.entity] = (acc[tender.entity] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const sortedEntities = Object.entries(entityCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, value]) => ({ name, value }));
        
    const topEntities = sortedEntities.slice(0, 5);
    const otherEntitiesValue = sortedEntities.slice(5).reduce((acc, curr) => acc + curr.value, 0);

    const entityPieData = [...topEntities];
    if (otherEntitiesValue > 0) {
        entityPieData.push({ name: 'Other', value: otherEntitiesValue });
    }

    const PIE_COLORS = ['#1E3A8A', '#D97706', '#3B82F6', '#FBBF24', '#10B981', '#9CA3AF'];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard
                    icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />}
                    title="Open Tenders"
                    value={openTenders}
                    colorClass="border-green-500"
                />
                <StatCard
                    icon={<NoSymbolIcon className="w-8 h-8 text-yellow-500" />}
                    title="Closed Tenders"
                    value={closedTenders}
                    colorClass="border-yellow-500"
                />
                <StatCard
                    icon={<ShieldCheckIcon className="w-8 h-8 text-blue-500" />}
                    title="Awarded Tenders"
                    value={awardedTenders}
                    colorClass="border-blue-500"
                />
                <StatCard
                    icon={<TrashIcon className="w-8 h-8 text-red-500" />}
                    title="Cancelled Tenders"
                    value={cancelledTenders}
                    colorClass="border-red-500"
                />
                <StatCard
                    icon={<BuildingOfficeIcon className="w-8 h-8 text-brand-blue-dark" />}
                    title="Total Tenders Listed"
                    value={totalTenders}
                    colorClass="border-brand-blue-dark"
                />
                 <StatCard
                    icon={<DocumentTextIcon className="w-8 h-8 text-purple-500" />}
                    title="Procurement Plans"
                    value={totalPlans}
                    colorClass="border-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tenders by Region Chart (Full Width on Large Screens) */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
                    <h3 className="text-xl font-bold text-brand-blue-dark mb-4">Tenders by Region</h3>
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

                {/* Top Entities Pie Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                     <h3 className="text-xl font-bold text-brand-blue-dark mb-4">Top 5 Entities by Tender Volume</h3>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={entityPieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {entityPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} tenders`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                {/* Most Asked Question Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                     <div>
                        <h3 className="text-xl font-bold text-brand-blue-dark mb-2 flex items-center">
                            <SparklesIcon className="w-6 h-6 mr-2 text-brand-gold"/>
                            Community Insight
                        </h3>
                        <p className="text-sm text-gray-500 mb-4 font-semibold">TRENDING QUESTION</p>
                        <blockquote className="border-l-4 border-brand-gold pl-4">
                            <p className="text-lg font-medium text-gray-800 italic">
                                "What's the first step to bid on a tender in Namibia?"
                            </p>
                        </blockquote>
                        <div className="mt-4 text-gray-700 space-y-2">
                            <p>
                                Ensure your company is registered and fully compliant (Tax, Social Security, etc.). 
                            </p>
                            <p>
                                The <span className="font-semibold">Public Procurement Act (Part 6)</span> outlines the official process. Then, carefully review the bidding documents for the specific tender to understand all requirements.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
