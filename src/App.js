import React from 'react'
import {
  BrowserRouter as Router,
} from 'react-router-dom'

import Header from './components/Header/Header'
import RoutesWithAnimation from './Navigation/RoutesWithAnimation'
import { MessageBoxProvider } from './components/Messages/MessageBox'

export default function App() {

  return (
    <Router>
      <MessageBoxProvider>
        <Header />
        <RoutesWithAnimation />
      </MessageBoxProvider>
    </Router>
  )
}