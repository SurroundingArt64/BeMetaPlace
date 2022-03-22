import React from 'react'
import classes from './Footer.module.scss'

const Footer = () => {
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.logo}>
          be<span>meta</span>place
        </div>
        <p>&copy; Copyright 2022, All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
