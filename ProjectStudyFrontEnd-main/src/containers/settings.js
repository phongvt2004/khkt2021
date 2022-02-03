import { Spin, Button, message, Form, Radio, Input, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';

const Settings = (props) => {
    const sampledata = {
        gender: "male",
        fullname: "Lâm Thanh Bá Quý",
        goodAt: ['Toán', "Ngữ Văn", "Tiếng Anh"],
        badAt: ['Tin học', "Tiếng Pháp"],
        class: 12,
        email: "edquinx2@gmail.com"
    }
    const { uinfo } = useAppContext()
    const [userinfo, setUserinfo] = uinfo

    const [loadding, setLoadding] = useState(false)


    useEffect(() => {
        handleGetUserInfo()
    }, [])

    const handleGetUserInfo = () => {
        axios.get(api.api_user_info, {
            params: {
                username: props.username,
                token: props.token
            }
        }).then(res => res.data)
            .then(res => {
                setUserinfo(res)
            })
            .catch(console.log)
    }

    const handleUpdateUserInfo = (e) => {
        const datapost = {}
        if (e.fullname !== undefined)
        {
            datapost.fullname = e.fullname
        }

        if (e.email !== undefined)
        {
            datapost.email = e.email
        }

        if (e.gender !== undefined)
        {
            datapost.gender = e.gender
        }

        if (e.class !== undefined)
        {
            datapost.class = e.class
        }

        if (imgAva !== "")
        {
            datapost.avatar = imgAva
        }
        setLoadding(true)
        axios.put(api.api_user_info, {
            ...datapost,
        }, {
            params: {
                username: props.username,
                token: props.token
            }
        }).then(res => res.data)
        .then(res => {
            console.log("check pro5", res)
            if (res.success)
            {
                message.success("Update thông tin thành công")
                handleGetUserInfo()
            }
            setLoadding(false)
        })
        .catch(console.log)
    }

    const [imgAva, setImgAva] = useState("")

    const uploadImgAvatar = async options => {
        const { onSuccess, onError, file, onProgress } = options;
        const fmData = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            },
        };
        fmData.append("avatar", file);
        try {
            const res = await axios.post(
                api.api_upload_avatar,
                fmData,
                config
            );
            onSuccess("Ok");
            setImgAva(res.data)
        } catch (err) {
            console.log("Eroor: ", err);
            const error = new Error("Some error");
            onError({ err });
        }
    }

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size='large' />
                    :
                    props.isAuthenticated ?
                        <React.Fragment>
                            <PageHeader icon="fa-user" page="Cài đặt thông tin" />
                            <div className="contentpanel">

                                <div className="row">
                                    <div className="col-sm-3">
                                        {
                                            userinfo?.avatar !== "" ?
                                                <img src={userinfo?.avatar} className="thumbnail img-responsive" alt="" />
                                                :
                                                <img src={`${process.env.PUBLIC_URL}/static/images/avatar/${userinfo?.gender}.png`} className="thumbnail img-responsive" alt="" />
                                        }
                                    </div>
                                    <div className="col-sm-9">

                                        <div className="profile-header">
                                            <h2 className="profile-name">{userinfo?.fullname}</h2>
                                            <div className="profile-location">
                                                Lớp: {userinfo?.class}
                                            </div>
                                            <div className="profile-position">
                                                Email: {userinfo?.email}
                                            </div>

                                            <div className="mb20"></div>

                                            {/* <button className="btn btn-success mr5"><i className="fa fa-user"></i> Theo dõi</button> */}
                                        </div>


                                        <ul className="nav nav-tabs nav-justified nav-profile">
                                            <li className="active">
                                                <a><strong>Chỉnh sửa thông tin cá nhân</strong></a>
                                            </li>
                                        </ul>


                                        <div className="tab-content">
                                            <div className="tab-pane active" id="activities">
                                                <div className="activity-list">
                                                    <Spin spinning={loadding}>
                                                    <Form onFinish={handleUpdateUserInfo}>
                                                        <Form.Item labelCol={{ span: 4 }} name="fullname" label="Họ và tên">
                                                            <Input />
                                                        </Form.Item>

                                                        <Form.Item labelCol={{ span: 4 }} name="email" label="Email">
                                                            <Input />
                                                        </Form.Item>

                                                        <Form.Item labelCol={{ span: 4 }} name="gender" label="Giới tính" >
                                                            <Radio.Group>
                                                                <Radio value="male">Nam</Radio>
                                                                <Radio value="female">Nữ</Radio>
                                                            </Radio.Group>
                                                        </Form.Item>

                                                        <Form.Item labelCol={{ span: 4 }} name="class" label="Lớp" >
                                                            <Select>
                                                                {
                                                                    api.classes.map((val) => (
                                                                        <Select.Option value={val}>Lớp {val}</Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item labelCol={{ span: 4 }} label="Avatar">
                                                            <Upload name="logo" listType="picture" customRequest={uploadImgAvatar}>
                                                                <Button icon={<UploadOutlined />}>Bấm vào để upload</Button>
                                                            </Upload>
                                                        </Form.Item>

                                                        <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                                                            <Button htmlType="submit">Cập nhật</Button>
                                                        </Form.Item>
                                                    </Form>
                                                    </Spin>
                                                </div>
                                                {/* <button className="btn btn-white btn-block">.</button> */}

                                            </div>


                                        </div>
                                    </div>

                                </div>
                            </div>
                        </React.Fragment>
                        :
                        props.history.push("/signin")
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
        username: state.username,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState()),
        logout: () => dispatch(actions.logout()),
        updateChange: () => dispatch(actions.updateChange()),
        onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
        authSignup: (fullname, username, email, password, gender, classs, goodAt = [], badAt = []) => dispatch(actions.authSignup(fullname, username, email, password, gender, classs, goodAt = [], badAt = [])),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)