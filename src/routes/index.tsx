import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { config } from '@/config';
import NewPage from '@/pages/newpage';
import SetupPage from '@/pages/setup';
import MainLayout from '@/layouts/main';
import CompactLayout from '@/layouts/compact';
import DashboardLayout from '@/layouts/dashboard';
import ValidatorPollingTxPage from '@/pages/validator/validator-polling-tx';
import ValidatorGenerateConfirmPage from '@/pages/validator/validator-generate-confirm';

import { FixedHeader } from '@/components/common';
import { LoadingScreen } from '@/components/loading-screen';
import WalletAuthGuard from '@/components/auth/wallet-auth-guard';
import InitiatorBoundGuard from '@/components/auth/initiator-bound-guard';

const Page404 = lazy(() => import('@/pages/404'));

const MyAccountPage = lazy(() => import('@/pages/my-account'));

const ValidatorPage = lazy(() => import('@/pages/validator'));
const ValidatorEmailPage = lazy(() => import('@/pages/validator/validator-email'));
const ValidatorCreatePage = lazy(() => import('@/pages/validator/validator-create'));

const ValidatorSelectOperatorsPage = lazy(
  () => import('@/pages/validator/validator-select-operators')
);
const ValidatorSuccessPage = lazy(() => import('@/pages/validator/validator-success'));

const ValidatorClusterConfirmPage = lazy(
  () => import('@/pages/validator/validator-cluster-confirm')
);

function WalletAndInitiatorBoundGuard({ children }: { children: React.ReactNode }) {
  return (
    <WalletAuthGuard>
      <InitiatorBoundGuard>{children}</InitiatorBoundGuard>
    </WalletAuthGuard>
  );
}

export default function Router() {
  return useRoutes([
    {
      path: config.routes.home,
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
            <WalletAndInitiatorBoundGuard>
              <FixedHeader />
              <MyAccountPage />
            </WalletAndInitiatorBoundGuard>
          ),
          index: true,
        },
      ],
    },
    {
      path: config.routes.setup,
      element: (
        <MainLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ),
      children: [{ element: <SetupPage />, index: true }],
    },
    {
      path: '/testpage',
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
          element: (
            <WalletAndInitiatorBoundGuard>
              <ValidatorSelectOperatorsPage />
            </WalletAndInitiatorBoundGuard>
          ),
        },
        {
          path: config.routes.validator.validatorGenerateConfirm,
          element: (
            <WalletAndInitiatorBoundGuard>
              <ValidatorGenerateConfirmPage />
            </WalletAndInitiatorBoundGuard>
          ),
        },
        {
          path: config.routes.validator.validatorPollingTx,
          element: (
            <WalletAndInitiatorBoundGuard>
              <ValidatorPollingTxPage />
            </WalletAndInitiatorBoundGuard>
          ),
        },
        {
          path: config.routes.validator.confirm,
          element: <ValidatorClusterConfirmPage />,
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
