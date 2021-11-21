import React from 'react'
import { Link } from 'react-router-dom'
import { site_name } from '../api'

const Footer = (props) => {

    return (
        <div className="signup-footer">
            <div className="pull-left">
                &copy; {new Date().getFullYear()}. All Rights Reserved.
            </div>
            <div className="pull-right">
                Created By: <Link to="/" >{site_name}</Link>
            </div>
        </div>
    )
}

export default Footer