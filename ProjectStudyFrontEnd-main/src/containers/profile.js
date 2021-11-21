import { Spin, List, Button, Modal, message, Form, Radio, Select } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';

const Profile = (props) => {
    const sampledata = {
        gender: "male",
        fullname: "Lâm Thanh Bá Quý",
        goodAt: ['Toán', "Ngữ Văn", "Tiếng Anh"],
        badAt: ['Tin học', "Tiếng Pháp"],
        class: 12,
        email: "edquinx2@gmail.com"
    }
    const {uinfo} = useAppContext()
    const [userinfo, setUserinfo] = uinfo

    const [gudbad, setGudbad] = useState(true)
    const [showaddSub, setShowaddSub] = useState(false)
    const [addsubForm] = Form.useForm()

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
    }

    const handleAddSubject = (e) => {
        let requestAddSub = api.api_user_add_gudsub
        let dataPatch = {
            goodAt: userinfo?.goodAt,
            username: props.username
        }
        if (userinfo?.goodAt.includes(e.subject) || userinfo?.badAt.includes(e.subject))
        {
            message.error("Môn này đã được thêm.")
            return
        }
        if (e.gudorbad === "good")
        {
            requestAddSub = api.api_user_add_gudsub
            var goodAtArr = userinfo?.goodAt
            goodAtArr.push(e.subject)
            dataPatch = {
                goodAt: goodAtArr,
                username: props.username
            }
        } else {
            requestAddSub = api.api_user_add_badsub
            var badAtArr = userinfo?.badAt
            badAtArr.push(e.subject)
            dataPatch = {
                badAt: badAtArr,
                username: props.username
            }
        }
        axios.patch(requestAddSub, dataPatch, {
            params: {
                username: props.username,
                token: props.token
            }
        }).then(res => res.data)
        .then(res => {
            message.success("Thêm môn học thành công")
            setShowaddSub(false)
            if (e.gudorbad === "good")
            {
                setGudbad(true)
            } else {
                setGudbad(false)
            }
        })
        .catch(err => {
            message.error("Thêm môn học thất bại")
            setShowaddSub(false)
        })
        
    }

    const handleDelSubject = (item, gudorbad) => {
        let requestAddSub = api.api_user_add_gudsub
        let dataPatch = {
            goodAt: userinfo?.goodAt,
            username: props.username
        }
        if (gudorbad)
        {
            requestAddSub = api.api_user_add_gudsub
            var data = userinfo?.goodAt
            data = data.filter(function(v) {
                return v !== item;
            });
            dataPatch = {
                goodAt: data,
                username: props.username
            }
        } else {
            requestAddSub = api.api_user_add_badsub
            var data = userinfo?.badAt
            data = data.filter(function(v) {
                return v !== item;
            });
            dataPatch = {
                badAt: data,
                username: props.username
            }
        }
        axios.patch(requestAddSub, dataPatch, {
            params: {
                username: props.username,
                token: props.token
            }
        }).then(res => res.data)
        .then(res => {
            message.success("Xoá môn học thành công")
            handleGetUserInfo()
        })
        .catch(err => {
            message.error("Xoá môn học thất bại")
        })
    }

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size='large' />
                    :
                    props.isAuthenticated ?
                        <React.Fragment>
                            <PageHeader icon="fa-user" page="Thông tin cá nhân" />
                            <div className="contentpanel">

                                <div className="row">
                                    <div className="col-sm-3">
                                        <img src={`${process.env.PUBLIC_URL}/static/images/avatar/${userinfo?.gender}.png`} className="thumbnail img-responsive" alt="" />

                                        <div className="mb30"></div>

                                        <h5 className="subtitle">Mạng xã hội</h5>
                                        <ul className="profile-social-list">
                                            <li><i className="fa fa-twitter"></i> twitter.com/{props.username}</li>
                                        </ul>

                                        <div className="mb30"></div>
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
                                            <li className={gudbad ? "active" : ""} onClick={() => setGudbad(true)}>
                                                <a><strong>Môn học tốt</strong></a>
                                            </li>
                                            <li className={!gudbad ? "active" : ""} onClick={() => setGudbad(false)}>
                                                <a><strong>Môn học chưa tốt</strong></a>
                                            </li>
                                        </ul>


                                        <div className="tab-content">
                                            <div className="tab-pane active" id="activities">
                                                <div className="activity-list">

                                                    <List
                                                        bordered
                                                        dataSource={gudbad ? userinfo?.goodAt : userinfo?.badAt}
                                                        renderItem={item => (
                                                            <List.Item key={item}>
                                                                <List.Item.Meta
                                                                    title={<a>{item}</a>}
                                                                />
                                                                <Button onClick={() => handleDelSubject(item, gudbad)}>Xoá</Button>
                                                            </List.Item>
                                                        )}
                                                    />
                                                </div>

                                                <Modal
                                                    title="Thêm môn học"
                                                    visible={showaddSub}
                                                    onOk={addsubForm.submit}
                                                    onCancel={() => setShowaddSub(false)}

                                                >
                                                    <Form form={addsubForm} onFinish={handleAddSubject}>
                                                        <Form.Item name="gudorbad" label="Học lực" initialValue="good">
                                                            <Radio.Group>
                                                                <Radio value="good">Tốt</Radio>
                                                                <Radio value="bad">Chưa tốt</Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                        <Form.Item name="subject" label="Môn học">
                                                            <Select>
                                                                {
                                                                    api.list_sub.map((val, index) => (
                                                                        <Select.Option value={val} key={`sub-${index}`}>{val}</Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>

                                                <button className="btn btn-white btn-block" onClick={() => setShowaddSub(true)}>Thêm môn học</button>

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

export default connect(mapStateToProps, mapDispatchToProps)(Profile)