import React from 'react'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

import Header from './components/Header/Header'
import RoutesWithAnimation from './Navigation/RoutesWithAnimation'
import { MessageBoxProvider } from './components/Messages/MessageBox'
import { AuthProvider } from './auth/Auth'

export default function App() {

  return (
    <Router>
      <AuthProvider>
        <MessageBoxProvider>
          <Header />
          <RoutesWithAnimation />
        </MessageBoxProvider>
      </AuthProvider>
    </Router>
  )
}