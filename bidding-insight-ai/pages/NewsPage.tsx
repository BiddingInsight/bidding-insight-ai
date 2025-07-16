
import React from 'react';
import { MOCK_NEWS_ARTICLES } from '../services/mockData';

export const NewsPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blue-dark">Procurement News</h1>
          <p className="mt-2 text-lg text-gray-600">Stay informed with the latest updates in Namibian procurement.</p>
        </div>
        <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
                {MOCK_NEWS_ARTICLES.map(article => (
                    <div key={article.id} className="p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-brand-blue">{article.source}</p>
                            <p className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{article.title}</h2>
                        <p className="text-gray-600 mb-4">{article.snippet}</p>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-gold hover:text-brand-gold-light transition-colors">
                            Read more &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
