import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { config } from '@/config';
import SetupPage from '@/pages/setup';
import MainLayout from '@/layouts/main';
import CompactLayout from '@/layouts/compact';
import ValidatorSyncPage from '@/pages/validator/validator-sync';
import ValidatorPollingTxPage from '@/pages/validator/validator-polling-tx';
import LidoCSMRegistrationPage from '@/pages/validator/lido-csm-registration';
import ValidatorGenerateConfirmPage from '@/pages/validator/validator-generate-confirm';

import { FixedHeader } from '@/components/common';
import { TokenInfoGuard } from '@/components/auth';
import { LoadingScreen } from '@/components/loading-screen';
import WalletAuthGuard from '@/components/auth/wallet-auth-guard';

const Page404 = lazy(() => import('@/pages/404'));

const MyAccountPage = lazy(() => import('@/pages/my-account'));

const ValidatorPage = lazy(() => import('@/pages/validator'));
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
      {/* <ClusterBoundGuard>{children}</ClusterBoundGuard> */}
      {children}
    </WalletAuthGuard>
  );
}

export default function Router() {
  return useRoutes([
    {
      path: config.routes.home,
      element: <Navigate to={config.routes.clusterValidator.home} replace />,
    },
    {
      path: config.routes.clusterValidator.home,
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
              <TokenInfoGuard>
                <MyAccountPage />
              </TokenInfoGuard>
            </WalletAndInitiatorBoundGuard>
          ),
          index: true,
        },
        {
          path: config.routes.clusterValidator.status,
          element: (
            <WalletAndInitiatorBoundGuard>
              <FixedHeader />
              <TokenInfoGuard>
                <MyAccountPage />
              </TokenInfoGuard>
            </WalletAndInitiatorBoundGuard>
          ),
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
      children: [
        {
          element: (
            <WalletAuthGuard>
              <SetupPage />
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
              <TokenInfoGuard>
                <ValidatorGenerateConfirmPage />
              </TokenInfoGuard>
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
          path: config.routes.validator.validatorRegistrationNetwork,
          element: (
            <WalletAndInitiatorBoundGuard>
              <ValidatorClusterConfirmPage />
            </WalletAndInitiatorBoundGuard>
          ),
        },
        {
          path: config.routes.validator.sync,
          element: (
            <WalletAndInitiatorBoundGuard>
              <ValidatorSyncPage />
            </WalletAndInitiatorBoundGuard>
          ),
        },
        {
          path: config.routes.validator.lidoCsmRegistration,
          element: (
            <WalletAndInitiatorBoundGuard>
              <LidoCSMRegistrationPage />
            </WalletAndInitiatorBoundGuard>
          ),
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
