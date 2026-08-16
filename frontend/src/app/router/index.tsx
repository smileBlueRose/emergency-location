import { createBrowserRouter } from 'react-router-dom';
import { OperatorPage } from '../../pages/operator/OperatorPage';
import { UserPage } from '../../pages/user/UserPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserPage />,
  },
  {
    path: '/operator',
    element: <OperatorPage />,
  },
]);