import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { UserBankData } from 'src/sections/user/view/user-bank-details';
import { ProfilePage } from '../sections/user/view/user-profile';
// ----------------------------------------------------------------------
import { ProtectedRoute } from './protect-router';

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const DashboardUser = lazy(() => import('src/sections/dashboardUser'));
export const ContactDetails = lazy(() => import('src/sections/contact/view/contact-view'));
export const TransactionPage = lazy(() => import('src/sections/transaction/view/transaction'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// function isTokenExpired() {
//   const tokenIssueTime = localStorage.getItem('tokenIssueTime');
//   const expiryTime = 3600 * 1000 * 8; // 8 hours in milliseconds
//   return tokenIssueTime && Date.now() - parseInt(tokenIssueTime, 10) > expiryTime;
// }

// function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const token = localStorage.getItem('jwt');
//   const tokenExpired = isTokenExpired();

//   if (!token || tokenExpired) {
//     localStorage.removeItem('jwt'); // Clean up if expired
//     localStorage.removeItem('tokenIssueTime');
//     return <Navigate to="/sign-in" />;
//   }

//   return children;
// }

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            {/* <ProtectedRoute> */}
            <Outlet />
            {/* </ProtectedRoute> */}
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <DashboardUser />, index: true },
        {
          path: 'user',
          element: (
            <ProtectedRoute allowedRoles={['1']}>
              <UserPage />
            </ProtectedRoute>
          ),
        },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'transaction', element: <TransactionPage /> },
        { path: 'contact', element: <ContactDetails /> },
        {
          path: 'bank-record',
          element: (
            <ProtectedRoute allowedRoles={['1']}>
              <UserBankData />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '403',
      element: <Page404 />, // Add a 403 route
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
