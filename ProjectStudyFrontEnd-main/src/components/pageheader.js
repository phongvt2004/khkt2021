import React from 'react'
import { Link } from 'react-router-dom'
import { site_name } from '../api'


const PageHeader = (props) => {

    return (
        <div className="pageheader">
            <h2><i className={`fa ${props.icon?props.icon:"fa-home"}`}></i> {props.page ? props.page : "Study group"} <span>{props.subtitle ? props.subtitle : "..."}</span></h2>
            <div className="breadcrumb-wrapper">
                <span className="label">Đang ở:</span>
                <ol className="breadcrumb">
                    <li><Link to="/">{site_name}</Link></li>
                    <li className="active">{props.page ? props.page : "Study group"}</li>
                </ol>
            </div>
        </div>
    )
}

export default PageHeader