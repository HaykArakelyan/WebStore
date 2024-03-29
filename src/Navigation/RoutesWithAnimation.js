import React from 'react'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'

import {
    Routes,
    Route,
    useLocation,
} from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import UserProfile from '../pages/UserProfile/UserProfile'
import UserProducts from '../pages/UserProducts/UserProducts'


export default function RoutesWithAnimation() {
    const location = useLocation()

    return (
        <Routes location={location} key={location.key}>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/login' element={<Login />}></Route>
            <Route exact path='/register' element={<Register />}></Route>
            <Route exact path='/dashboard' element={<Dashboard />}></Route>
            <Route exact path='/user-profile' element={<UserProfile />}></Route>
            <Route exact path='/my-products' element={<UserProducts />} ></Route>
        </Routes>
    )
}
