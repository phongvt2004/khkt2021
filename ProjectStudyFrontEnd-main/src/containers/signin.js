import React, { useEffect } from 'react'
import Footer from '../components/footer'
import { Link } from 'react-router-dom'
import { site_name } from '../api'
import { Button, Form, Input, Spin, message } from 'antd'
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const SignIn = (props) => {

    useEffect(() => {
        if (props.error)
        {
            message.error(props.error?.msg)
            props.resetError();
        }
    }, [props.error])

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size="large" />
                    :
                    !props.isAuthenticated ?
                    <div className="signinpanel">
                        <div className="row">

                            <div className="col-md-7">

                                <div className="signin-info">
                                    <div className="logopanel">
                                        <h1><span>[</span> {site_name} <span>]</span></h1>
                                    </div>

                                    <div className="mb20"></div>

                                    <h5><strong>Chào mừng đến với {site_name}</strong></h5>
                                    <ul>
                                        <li><i className="fa fa-arrow-circle-o-right mr5"></i> Hỗ trợ học nhóm</li>
                                    </ul>
                                    <div className="mb20"></div>
                                    <strong>Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link></strong>
                                </div>

                            </div>

                            <div className="col-md-5">

                                <Form onFinish={e => props.onAuth(e.username, e.password)}>
                                    <h4 className="nomargin">Đăng nhập</h4>
                                    <p className="mt5 mb20">Đăng nhập để sử dụng {site_name}.</p>
                                    <Form.Item name="username">
                                        <Input type="text" className="form-control uname" placeholder="Username" />
                                    </Form.Item>
                                    <Form.Item name="password">
                                        <Input type="password" className="form-control pword" placeholder="Password" />
                                    </Form.Item>
                                    <Link to="/forgot-pass"><small>Quên mật khẩu?</small></Link>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" className="btn btn-success btn-block">Đăng nhập</Button>
                                    </Form.Item>
                                </Form>
                            </div>

                        </div>

                        <Footer />

                    </div>
                    :
                    props.history.push("/")
            }
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token,
        isAuthenticated: state.token !== null,
        loading: state.loading,
        error: state.error,
        change: state.change,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        logout: () => dispatch(actions.logout()),
        updateChange: () => dispatch(actions.updateChange()),
        resetError: () => dispatch(actions.errReset()),
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
        authSignup: (fullname, username, email, password, gender, classs, goodAt = [], badAt = []) => dispatch(actions.authSignup(fullname, username, email, password, gender, classs, goodAt = [], badAt = [])),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)