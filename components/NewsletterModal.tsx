
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SignUpDetails, Company } from '../types';
import { Button } from './Button';
import { INDUSTRIES, REGIONS } from '../constants';
import { CloseIcon, HeartIcon, CheckCircleIcon } from './IconComponents';
import { Spinner } from './Spinner';
import { db } from '../services/database';

const donationLink = "https://www.paypal.com/ncp/payment/DS633BX7ARY3Y";

export const NewsletterModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signUp, login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [details, setDetails] = useState<SignUpDetails>({
    companyName: '',
    companyRepresentativeName: '',
    email: '',
    industry: INDUSTRIES[0],
    region: REGIONS[0],
    password: '',
    interestedEntityIds: [],
  });
  
  const [selectedEntities, setSelectedEntities] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (isAuthModalOpen && !isLoginView && companies.length === 0) {
      db.getCompanies().then(setCompanies).catch(err => console.error("Failed to fetch companies", err));
    }
  }, [isAuthModalOpen, isLoginView, companies.length]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  const handleEntityChange = (index: number, companyId: string) => {
    const newSelection = [...selectedEntities];
    if (companyId && selectedEntities.includes(companyId)) {
      alert("You have already selected this entity.");
      return;
    }
    newSelection[index] = companyId;
    setSelectedEntities(newSelection);
    setDetails(prev => ({...prev, interestedEntityIds: newSelection.filter(Boolean)}));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        if(details.password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }
        await signUp(details);
        setSignupSuccess(true);
      }
    } catch (error) {
       if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setAuthError(null);
    setSignupSuccess(false);
    setSelectedEntities(['', '', '']);
    setDetails({
      companyName: '', companyRepresentativeName: '', email: '', password: '',
      industry: INDUSTRIES[0], region: REGIONS[0], interestedEntityIds: [],
    });
  }

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  };
  
  const handleClose = () => {
    resetForm();
    closeAuthModal();
  }

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-scale-in">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <CloseIcon className="w-6 h-6" />
        </button>

        {signupSuccess ? (
            <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Thank You for Joining!</h2>
                <p className="text-gray-600 mb-6">Your account has been created. Welcome to Bidding Insight AI.</p>
                <p className="text-gray-600 mb-4">As a non-profit, we rely on support from users like you to keep our platform running. Please consider a small donation.</p>
                <a href={donationLink} target="_blank" rel="noopener noreferrer" className="w-full">
                     <Button variant="primary" className="w-full !py-3 flex justify-center items-center mb-2">
                        <HeartIcon className="w-5 h-5 mr-2" />
                        Donate to Support Us
                    </Button>
                </a>
                <Button variant="plain" onClick={handleClose} className="w-full !py-3">Continue to Site</Button>
            </div>
        ) : (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-blue-dark mb-2 mt-4">{isLoginView ? 'Welcome Back!' : 'Join Bidding Insight!'}</h2>
                <p className="text-gray-600 mb-6">{isLoginView ? 'Let\'s get you signed in.' : 'Sign up to get tender alerts, news, and exclusive AI insights.'}</p>
                
                {authError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{authError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {isLoginView ? (
                     <>
                        <input type="email" name="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                     </>
                  ) : (
                    <>
                      <input type="text" name="companyName" placeholder="Company Name" value={details.companyName} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                      <input type="text" name="companyRepresentativeName" placeholder="Company Representative Full Name" value={details.companyRepresentativeName} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                      <input type="email" name="email" placeholder="Email Address" value={details.email} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="industry-signup" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                          <select id="industry-signup" name="industry" value={details.industry} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white">
                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="region-signup" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                          <select id="region-signup" name="region" value={details.region} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white">
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Follow up to 3 Entities (Optional)</label>
                          <div className="space-y-2">
                            {[0, 1, 2].map(index => (
                                <select key={index} value={selectedEntities[index]} onChange={(e) => handleEntityChange(index, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light bg-white">
                                    <option value="">Select an entity...</option>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            ))}
                          </div>
                      </div>

                      <input type="password" name="password" placeholder="Password (min. 6 characters)" value={details.password} onChange={handleDetailsChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light" />
                    </>
                  )}

                  <div className="pt-2">
                    <Button type="submit" variant="primary" className="w-full !py-3 flex justify-center items-center" disabled={isLoading}>
                      {isLoading ? <Spinner size="sm" /> : (isLoginView ? 'Sign In' : 'Sign Up & Unlock')}
                    </Button>
                  </div>
                </form>
                 <p className="text-center text-sm text-gray-500 mt-6">
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={toggleView} className="font-semibold text-brand-blue hover:underline" disabled={isLoading}>
                        {isLoginView ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        )}
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
