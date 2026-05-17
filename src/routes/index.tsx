import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLoader } from '@/components/common/LoadingSpinner';
import { NotFoundPage } from '@/components/common/EmptyState';

// Lazy loaded layouts
const RootLayout = lazy(() => import('@/layouts/RootLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));
const PublicLayout = lazy(() => import('@/layouts/PublicLayout'));

// Lazy loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Budget = lazy(() => import('@/pages/Budget'));
const TripCreate = lazy(() => import('@/pages/TripCreate'));
const TripDetails = lazy(() => import('@/pages/TripDetails'));
const Trips = lazy(() => import('@/pages/Trips'));
const Assistant = lazy(() => import('@/pages/Assistant'));
const Analytics = lazy(() => import('@/pages/Analytics'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <PublicLayout />
      </SuspenseWrapper>
    ),
    children: [
      { index: true, element: <Landing /> },
    ],
  },
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <AuthLayout />
      </SuspenseWrapper>
    ),
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      </SuspenseWrapper>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Navigate to="/profile" replace /> },
      { path: 'budget', element: <Budget /> },
      { path: 'trips', element: <Trips /> },
      { path: 'trips/create', element: <TripCreate /> },
      { path: 'trips/:tripId', element: <TripDetails /> },
      { path: 'assistant', element: <Assistant /> },
      { path: 'analytics', element: <Analytics /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
