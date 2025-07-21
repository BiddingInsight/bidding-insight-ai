import React, { useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NewsletterModal } from './components/NewsletterModal';
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { DebarmentPage } from './pages/DebarmentPage';
import { ProcurementActPage } from './pages/ProcurementActPage';
import { ProcurementPlansPage } from './pages/ProcurementPlansPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { CancelledTendersPage } from './pages/CancelledTendersPage';

const { HashRouter, Routes, Route, useLocation, Navigate } = ReactRouterDOM;

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAuthenticated, openAuthModal } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            openAuthModal();
        }
    }, [isAuthenticated, location, openAuthModal]);

    return isAuthenticated ? children : <HomePage />; // Redirect to home if not signed up
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isAdmin } = useAuth();
    if(!isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const AppContent: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                 <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/procurement-act" element={<ProcurementActPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
                    <Route path="/debarment" element={<ProtectedRoute><DebarmentPage /></ProtectedRoute>} />
                    <Route path="/cancelled-tenders" element={<ProtectedRoute><CancelledTendersPage /></ProtectedRoute>} />
                    <Route path="/procurement-plans" element={<ProtectedRoute><ProcurementPlansPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPage /></AdminRoute></ProtectedRoute>} />
                </Routes>
            </main>
            <Footer />
            <NewsletterModal />
        </div>
    );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;