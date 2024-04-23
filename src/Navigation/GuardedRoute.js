import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/Auth';

export default function GuardedRoute({ destination, inverse = false }) {

    const { isAuth } = useAuth()

    return (
        !inverse
            ? isAuth() ? <Outlet /> : <Navigate to={destination} />
            : isAuth() ? <Navigate to={destination} /> : <Outlet />
    )
}
