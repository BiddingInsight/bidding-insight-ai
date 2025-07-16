
import React, { useState } from 'react';
import { useAuth, SignUpDetails } from '../hooks/useAuth';
import { Button } from './Button';
import { INDUSTRIES, REGIONS } from '../constants';
import { CloseIcon } from './IconComponents';

export const NewsletterModal: React.FC = () => {
  const { isModalOpen, closeModal, signUp } = useAuth();
  const [details, setDetails] = useState<SignUpDetails>({
    companyName: '',
    name: '',
    surname: '',
    email: '',
    industry: INDUSTRIES[0],
    region: REGIONS[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(details);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-scale-in">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Unlock Full Access</h2>
        <p className="text-gray-600 mb-6">Sign up for our newsletter to filter tenders, read news, and get exclusive insights.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Name" value={details.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
            <input type="text" name="surname" placeholder="Surname" value={details.surname} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
          </div>
          <input type="text" name="companyName" placeholder="Company Name" value={details.companyName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
          <input type="email" name="email" placeholder="Email Address" value={details.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
          <select name="industry" value={details.industry} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white">
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select name="region" value={details.region} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white">
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <Button type="submit" variant="primary" className="w-full !py-3">Sign Up & Unlock</Button>
        </form>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};
