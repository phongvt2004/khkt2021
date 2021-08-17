import React, { Component } from "react";

export default class Register extends Component {
    render() {
        return (
            <form>
                <h3>Đăng ký</h3>
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" className="form-control" placeholder="Tên đăng nhập"/>
                </div>
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input type="text" className="form-control" placeholder="Họ và tên"/>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="text" className="form-control" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" className="form-control" placeholder="Mật khẩu"/>
                </div>
 
            </form>
        )
    }
}