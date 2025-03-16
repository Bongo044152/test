import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Index } from "./APPs/index.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        // element: <Navigate to="/login" />,
        element:  <Index />,
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    }
]);