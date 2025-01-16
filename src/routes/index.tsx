import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { config } from '@/config';
import NewPage from '@/pages/newpage';
import MainLayout from '@/layouts/main';
import NewHomePage from '@/pages/newhome';
import CompactLayout from '@/layouts/compact';
import DashboardLayout from '@/layouts/dashboard';

import { LoadingScreen } from '@/components/loading-screen';
import WalletAuthGuard from '@/components/auth/wallet-auth-guard';

const Page404 = lazy(() => import('@/pages/404'));

const MyAccountPage = lazy(() => import('@/pages/my-account'));

const ValidatorPage = lazy(() => import('@/pages/validator'));
const ValidatorEmailPage = lazy(() => import('@/pages/validator/validator-email'));
const ValidatorCreatePage = lazy(() => import('@/pages/validator/validator-create'));

const ValidatorSelectOperatorsPage = lazy(
  () => import('@/pages/validator/validator-select-operators')
);
const ValidatorSuccessPage = lazy(() => import('@/pages/validator/validator-success'));
const ValidatorSlashWarningPage = lazy(() => import('@/pages/validator/validator-slash-warning'));
const ValidatorConfirmPage = lazy(() => import('@/pages/validator/validator-confirm'));

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ),
      children: [{ element: <NewHomePage />, index: true }],
    },
    {
      path: '/newpage',
      element: (
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [{ element: <NewPage />, index: true }],
    },

    {
      path: 'dashboard',
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ),
      children: [
        {
          element: (
            <WalletAuthGuard>
              <MyAccountPage />
            </WalletAuthGuard>
          ),
          index: true,
        },
      ],
    },

    {
      path: config.routes.validator.home,
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ),
      children: [
        { element: <ValidatorPage />, index: true },
        { path: config.routes.validator.email, element: <ValidatorEmailPage /> },
        { path: config.routes.validator.create, element: <ValidatorCreatePage /> },
        { path: config.routes.validator.depositValidator, element: <ValidatorCreatePage /> },

        {
          path: config.routes.validator.selectOperators,
          element: <ValidatorSelectOperatorsPage />,
        },
        {
          path: config.routes.validator.slashingWarning,
          element: <ValidatorSlashWarningPage />,
        },
        {
          path: config.routes.validator.confirm,
          element: <ValidatorConfirmPage />,
        },
        { path: config.routes.validator.success, element: <ValidatorSuccessPage /> },
      ],
    },

    {
      element: (
        <CompactLayout>
          <Outlet />
        </CompactLayout>
      ),
      children: [{ path: '404', element: <Page404 /> }],
    },

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
