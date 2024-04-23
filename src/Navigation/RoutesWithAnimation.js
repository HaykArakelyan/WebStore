import React from 'react'

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'

import {
    Routes,
    Route,
    useLocation,
    Navigate,
} from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import UserProfile from '../pages/UserProfile/UserProfile'
import UserProducts from '../pages/UserProducts/UserProducts'
import UserCart from '../pages/UserCart/UserCart'
import ProductPage from '../pages/Product/ProductPage'
import AboutUs from '../pages/AboutUs/AboutUs'
import ContactUs from '../pages/ContacUs/ContactUs'
import GuardedRoute from './GuardedRoute'


export default function RoutesWithAnimation() {
    const location = useLocation()

    return (
        <Routes location={location} key={location.key}>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/login' element={<Login />}></Route>
            <Route exact path='/register' element={<Register />}></Route>

            <Route element={<GuardedRoute />}>
                <Route exact path='/my-products' element={<UserProducts />} />
                <Route exact path='/user-profile' element={<UserProfile />}></Route>
                <Route exact path='/my-saves' element={< UserCart />}></Route>
                <Route exact path='/my-products' element={<UserProducts />} ></Route>
            </Route>

            <Route exact path='/dashboard' element={<Dashboard />}></Route>
            <Route exact path='/product/:id' element={<ProductPage />}></Route>
            <Route exact path='/about-us' element={<AboutUs />}></Route>
            <Route eaxct path='/contact-us' element={<ContactUs />}></Route>
        </Routes>
    )
}

