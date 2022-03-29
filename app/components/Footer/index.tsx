import React from 'react'
import classes from './Footer.module.scss'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <div className={classes.logo}>
                    be<span>meta</span>place
                </div>
                <p>&copy; Copyright {year}, All Rights Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
