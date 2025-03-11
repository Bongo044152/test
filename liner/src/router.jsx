import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Guid } from "./APPs/matrix_mainpage.jsx";

export const router = createBrowserRouter([
    {
        path: '/',
        // element: <Navigate to="/login" />,
        element:  <Guid />,
    },
    {
        path: '*',
        element: <Navigate to="/" />,
    }
]);