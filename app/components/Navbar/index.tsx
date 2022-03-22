import React from 'react'
import classes from './Navbar.module.scss'

const Navbar = () => {
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.logo}>
          be<span>meta</span>place
        </div>
      </div>
    </div>
  )
}

export default Navbar
