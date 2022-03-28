import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ height: '80px' }} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
