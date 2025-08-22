import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give a moment for auth state to be determined
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking auth state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-wedding text-lg text-muted-foreground">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
