import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomePage from './routes/homepage/HomePage.jsx';
import DashBoardPage from './routes/DashBoardPage/DashBoardPage.jsx';
import ChatPage from './routes/ChatPage/ChatPage.jsx';
import RootLayout from './Layouts/rootLayout/RootLayout.jsx';
import DashBoardLayout from './Layouts/DashBoardLayout/DashBoardLayout.jsx';
import SigninPage from './routes/SignInPage/SigninPage.jsx';
import SignupPage from './routes/SignupPage/SignupPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/protectedRoute/ProtectedRoute.jsx';
import { Toaster } from 'react-hot-toast';


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/sign-in/*',
        element: <SigninPage />,
      },
      {
        path: '/sign-up/*',
        element: <SignupPage />,
      },
      {
        element: <ProtectedRoute />, 
        children: [
          {
            element: <DashBoardLayout />,
            children: [
              {
                path: '/dashboard',
                element: <DashBoardPage />,
              },
              {
                path: '/dashboard/chats/:id',
                element: <ChatPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>
);
