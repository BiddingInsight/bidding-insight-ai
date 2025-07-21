
import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { NewsArticle } from '../types';
import { Spinner } from '../components/Spinner';
import { Button } from '../components/Button';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const ARTICLES_PER_PAGE = 28; // 7 rows * 4 columns

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      const newsArticles = await db.getNews();
      setArticles(newsArticles);
      setIsLoading(false);
    };
    loadNews();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-blue-dark">Procurement News</h1>
          <p className="mt-2 text-lg text-gray-600">Stay informed with the latest updates in Namibian procurement.</p>
        </div>
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-10">
              <Spinner size="lg" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700">Catching up on the news!</h3>
                <p className="text-gray-500 mt-2">No articles found at the moment, but check back soon for the latest scoop.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {currentArticles.map(article => (
                    <div key={article.id} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6 flex-grow">
                            <p className="text-sm font-semibold text-brand-blue mb-1">{article.source}</p>
                            <p className="text-xs text-gray-500 mb-2">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight">{article.title}</h2>
                            <p className="text-sm text-gray-600">{article.snippet}</p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <a href={article.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-gold hover:text-brand-gold-light transition-colors">
                                Read more &rarr;
                            </a>
                        </div>
                    </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-4">
                  <Button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} variant="plain">
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} variant="plain">
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
