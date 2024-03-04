import React, { useEffect } from 'react'
import styles from "./Home.module.css"
import { useMessageBox } from '../../components/Messages/MessageBox'

export default function Home({ }) {
  const { showMessage } = useMessageBox()

  useEffect(() => {
    showMessage({ msg: "This page is still under developmen", msgType: "note" })
  }, [])

  return (
    <div className={styles.container}>
      Home
    </div>
  )
}
