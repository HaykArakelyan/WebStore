import React, { useEffect, useState } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/Auth';

export default function GuardedRoute({ element, ...rest }) {

    const { isAuth } = useAuth()

    return isAuth() ? <Outlet /> : <Navigate to={'/login'} />;
}
