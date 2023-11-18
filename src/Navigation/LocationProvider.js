import { AnimatePresence } from 'framer-motion'
import React from 'react'

export default function LocationProvider({ children }) {
    return <AnimatePresence>{children}</AnimatePresence>
}
