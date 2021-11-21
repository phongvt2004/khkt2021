import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site_name } from '../api'
import * as api from '../api';
import Footer from '../components/footer'

import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

import { Button, Form, Input, Select, Spin, message } from 'antd'

const SignUp = (props) => {

    const [regForm] = Form.useForm()

    useEffect(() => {
        if (props.error) {
            message.error(props.error?.msg)
            props.resetError()
        }
    }, [props.error]);

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size="large" />
                    :
                    !props.isAuthenticated ?
                        <div className="signuppanel">

                            <div className="row">

                                <div className="col-md-6">

                                    <div className="signup-info">
                                        <div className="logopanel">
                                            <h1><span>[</span> {site_name} <span>]</span></h1>
                                        </div>

                                        <div className="mb20"></div>

                                        <h5><strong>{site_name}!</strong></h5>
                                        <p>Trang web hỗ trợ tìm nhóm và giúp đỡ ôn tập, học tập.</p>
                                        <div className="mb20"></div>

                                        <div className="feat-list">
                                            <i className="fa fa-wrench"></i>
                                            <h4 className="text-success">Đăng ký dễ dàng</h4>
                                        </div>

                                        <div className="feat-list">
                                            <i className="fa fa-compress"></i>
                                            <h4 className="text-success">Đông đảo thành viên sử dụng</h4>
                                        </div>

                                        <div className="feat-list mb20">
                                            <i className="fa fa-search-plus"></i>
                                            <h4 className="text-success">Hỗ trợ nhanh chóng</h4>
                                        </div>

                                        <h4 className="mb20">và nhiều hơn nữa...</h4>

                                    </div>

                                </div>

                                <div className="col-md-6">

                                    <Form form={regForm} layout="vertical" onFinish={(e) => props.authSignup(e.fullname, e.username, e.email, e.password, e.confirmPassword, e.gender, e.class, [], [])}>

                                        <h3 className="nomargin">Đăng ký</h3>
                                        <p className="mt5 mb20">Đã có tài khoản? <Link to="/signin"><strong>Đăng nhập</strong></Link></p>

                                        <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true, message: 'Missing full name' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name="username" label="Tài khoản" rules={[{ required: true, message: 'Missing username' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Missing password' }]}>
                                            <Input type="password" />
                                        </Form.Item>
                                        {/* confirmPassword */}
                                        <Form.Item name="confirmPassword" label="Xác thực mật khẩu" rules={[{ required: true, message: 'Missing confirm password' }]}>
                                            <Input type="password" />
                                        </Form.Item>

                                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Missing email' }]}>
                                            <Input />
                                        </Form.Item>

                                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Missing gender' }]}>
                                            <Select placeholder="Choose your gender">
                                                <Select.Option value="male">Nam</Select.Option>
                                                <Select.Option value="female">Nữ</Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item name="class" label="Lớp" rules={[{ required: true, message: 'Missing Grade' }]}>
                                            <Select>
                                            {
                                                api.classes.map((val) => (
                                                    <Select.Option value={val}>Lớp {val}</Select.Option>
                                                ))
                                            }
                                            </Select>
                                        </Form.Item>

                                        <Form.Item >
                                            <Button type="primary" htmlType="submit">Đăng ký</Button>
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
        authSignup: (fullname, username, email, password, confirmPassword, gender, classs, goodAt = [], badAt = []) => dispatch(actions.authSignup(fullname, username, email, password, confirmPassword, gender, classs, goodAt = [], badAt = [])),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)