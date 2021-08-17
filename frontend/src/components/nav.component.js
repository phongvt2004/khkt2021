import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Nav extends Component {
    render() {
        return(
            <nav className="navbar navbar-expand navbar-light fixed-top">
            <div className="container">
            <Link className="navbar-brand" to="/">Trang chủ</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/dangnhap">Đăng nhập</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/dangky">Đăng ký</Link>
                </li>
                </ul>
            </div>
            </div>
        </nav>
 
        )
   }
}