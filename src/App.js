import React from 'react'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

import Header from './components/Header/Header'
import LocationProvider from './Navigation/LocationProvider'
import RoutesWithAnimation from './Navigation/RoutesWithAnimation'


export default function App() {

  return (
    <Router>
      <Header />
      <LocationProvider>
        <RoutesWithAnimation />
      </LocationProvider>
    </Router >
  )
}