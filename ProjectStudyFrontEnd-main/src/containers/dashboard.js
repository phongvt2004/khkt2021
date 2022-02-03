import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'

import { Spin, Button, Row, Col, Descriptions, message, Modal, Form, Input, Select, List, Popover, Avatar } from 'antd';

import { AppstoreAddOutlined, FileSearchOutlined, UsergroupAddOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { useAppContext } from '../state';
import { Link } from 'react-router-dom';

//socket import
import io from "socket.io-client";

const DashBoard = (props) => {

    const { uinfo, igroups, wgroups } = useAppContext()

    const [ingroups, setIngroups] = igroups
    const [wtgroups, setWtgroups] = wgroups

    const [ocreateGr, setOcreateGr] = useState(false)
    const [ofindGr, setOfindGr] = useState(false)
    const [ofindFr, setOfindFr] = useState(false)
    const [formCGR] = Form.useForm();
    const [formFGR] = Form.useForm();
    const [formFFR] = Form.useForm();

    const [groupsRes, setGroupsres] = useState([])
    const [friendRes, setFriendres] = useState([])
    const [groupInfo, setGroupInfo] = useState(null)

    const [finding, setFinding] = useState(false)

    const namesArray = friendRes.map(elem => elem.username);
    const namesTraversed = [];
    let currentCountOfName = 1;
    let len = 0;

    const handleCreateGroup = (e) => {
        setFinding(true)
        axios.post(api.api_group_user,
            {
                name: e.name,
                class: e.class
            },
            {
                params: {
                    username: props.username,
                    token: props.token
                }
            }
        ).then(res => res.data)
            .then(res => {
                if ("_id" in res) {
                    message.success("Tạo nhóm thành công")
                    props.updateInfo(props.token, props.username, props.userId);
                    setIngroups(oldArray => [...oldArray, res]);
                } else {
                    message.error(res.msg)
                }
                formCGR.resetFields()
                setOcreateGr(false)
                setFinding(false)
            })
            .catch(() => {
                message.error("Tạo nhóm thất bại")
                formCGR.resetFields()
                setOcreateGr(false)
                setFinding(false)
            })
    }

    const showGroupInfo = () => {

        return (
            <Spin spinning={groupInfo === null}>
                <div>
                    <p>Số member: {groupInfo?.memberIds.length}</p>
                    <p>Môn học tốt: {groupInfo?.hasSubjects.join(", ")}</p>
                    <p>Môn học yếu: {groupInfo?.requiredSubjects.join(", ")}</p>
                </div>
            </Spin>
        )
    }

    const handleGetGroupById = (e, id) => {
        if (e) {
            console.log("groupid: ", id)
            axios.get(api.api_group_user, {
                params: {
                    username: props.username,
                    token: props.token,
                    groupId: id
                }
            }).then(res => res.data)
                .then(res => {
                    console.log("get gr: ", res)
                    setGroupInfo(res)
                })
                .catch(console.log)
        } else {
            setGroupInfo(null)
        }
    }

    const handleFindGroup = (e) => {
        setFinding(true)
        setGroupsres([])
        setFriendres([])
        axios.get(api.api_search_group, {
            params: {
                username: props.username,
                token: props.token,
                ...e
            }
        }).then(res => res.data)
            .then(res => {
                setFriendres([])
                if (typeof (res) === "object") {
                    setGroupsres(res)
                } else {
                    message.error("Không tồn tại nhóm này.")
                    setGroupsres([])
                }
                setOfindGr(false)
                setFinding(false)
                formFGR.resetFields()
            })
            .catch(() => {
                setGroupsres([])
                setFriendres([])
                setOfindGr(false)
                setFinding(false)
                formFGR.resetFields()
                message.error("Tìm nhóm thất bại")
            })
    }

    const handleFindFriend = (e) => {
        setFinding(true)
        setGroupsres([])
        setFriendres([])
        axios.get(api.api_search_users, {
            params: {
                username: props.username,
                token: props.token,
                ...e
            }
        }).then(res => res.data)
            .then(res => {
                setGroupsres([])
                console.log(res)
                if (typeof (res) === "object") {
                    setFriendres(res)
                } else {
                    setFriendres([])
                    message.error("Không tồn tại người dùng này.")
                }
                formFFR.resetFields()
                setOfindFr(false)
                setFinding(false)
            })
            .catch(() => {
                setGroupsres([])
                setFriendres([])
                setOfindFr(false)
                setFinding(false)
                formFFR.resetFields()
                message.error("Tìm bạn thất bại")
            })
    }

    const handleRequestJoinGroup = (groupId, groupName) => {
        const timenow = new Date().toLocaleString()
        axios.post(api.api_group_join, {
            groupId: groupId,
            username: props.username,
            createAt: timenow,
            userId: props.userId,
        }, {
            params: {
                username: props.username,
                token: props.token
            }
        }).then(res => res.data)
            .then(res => {
                if (typeof (res) === "object") {
                    if (res.success) {
                        setWtgroups(oldArray => [...oldArray, {
                            _id: groupId,
                            name: groupName
                        }]);
                        message.success("Đã gửi yêu cầu vào nhóm.")
                    } else {
                        message.error("Xin vào nhóm thất bại")
                    }
                } else {
                    message.error(res)
                }
            })
            .catch(() => {
                message.error("Xin vào nhóm thất bại")
            })
    }

    useEffect(() => {
        handleGetResultTest()
    }, [])

    const [dataResult, setDataResult] = useState([])

    const handleGetResultTest = () => {
        setDataResult([])
        api.list_sub.map(val => {
            axios.get(api.api_history_result, {
                params: {
                    username: props.username,
                    token: props.token,
                    subject: val
                }
            })
                .then(res => res.data)
                .then(res => {
                    if (!Array.isArray(res)) return
                    if (res.length > 0) {
                        setDataResult(old => [...old, {
                            "subject": val,
                            "points": res.map(val => val.point).slice(-10)
                        }])
                    }
                })
                .catch(console.log)
        })
    }

    const label_result = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10']

    const handleGetSuggetGroup = () => {
        setGroupsres([])
        setFriendres([])
        axios.get(api.api_search_suggest, {
            params: {
                username: props.username
            }
        })
        .then(res => res.data)
        .then(res => {
            console.log(res)
            if (typeof (res) === "object") {
                if (Array.isArray(res)) setGroupsres(res)
            } else {
                message.error(res)
            }
        })
        .catch(console.log)
    }

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size='large' />
                    :
                    props.isAuthenticated ?
                        <React.Fragment>
                            <PageHeader page="Trang chủ" subtitle="Cùng nhau học tập ..." />

                            <div className="contentpanel panel-email">

                                <div className="row">

                                    <div className="col-sm-3 col-lg-2">
                                        <h5 className="subtitle">Nhóm đã tham gia</h5>
                                        <ul className="nav nav-pills nav-stacked nav-email mb20">
                                            {
                                                ingroups.map((data, index) => (
                                                    <li className="">
                                                        <Link to={`/chat/${data._id}`}>
                                                            <span className="badge pull-right">{data.memberIds.length > 0 ? data.memberIds.length : ""}</span>
                                                            <i className="glyphicon glyphicon-folder-open"></i> {data.name}
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>

                                        <div className="mb30"></div>

                                        <h5 className="subtitle">Nhóm chờ duyệt</h5>
                                        <ul className="nav nav-pills nav-stacked nav-email mb20">
                                            {
                                                wtgroups.map((data, index) => (
                                                    <li className="">
                                                        <Link to={`/chat/${data._id}`}>
                                                            <i className="glyphicon glyphicon-folder-open"></i> {data.name}
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>

                                    </div>

                                    <div className="col-sm-9 col-lg-10">

                                        <div className="panel panel-default">
                                            <div className="panel-body" >
                                                <Modal visible={ocreateGr} title="Tạo nhóm mới"
                                                    onCancel={() => setOcreateGr(false)}
                                                    cancelText="Cancel"
                                                    okText="Tạo"
                                                    onOk={formCGR.submit}
                                                    okButtonProps={{ disabled: finding }}
                                                    cancelButtonProps={{ disabled: finding }}
                                                >
                                                    <Form form={formCGR} onFinish={handleCreateGroup}>
                                                        <Form.Item name="name" label="Tên nhóm" rules={[{ required: true, message: 'Nhập tên nhóm' }]}>
                                                            <Input placeholder="Nhập tên nhóm" />
                                                        </Form.Item>
                                                        <Form.Item name="class" label="Lớp" rules={[{ required: true, message: 'Nhập khối, lớp' }]}>
                                                            <Select>
                                                                {
                                                                    api.classes.map((val) => (
                                                                        <Select.Option value={val}>Lớp {val}</Select.Option>
                                                                    ))
                                                                }
                                                                {/* <Select.Option value="all">All</Select.Option> */}
                                                            </Select>
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>

                                                <Modal visible={ofindGr} title="Tìm nhóm"
                                                    onCancel={() => setOfindGr(false)}
                                                    cancelText="Cancel"
                                                    okText="Tìm"
                                                    onOk={formFGR.submit}
                                                    okButtonProps={{ disabled: finding }}
                                                    cancelButtonProps={{ disabled: finding }}
                                                >
                                                    <Form form={formFGR} onFinish={handleFindGroup}>
                                                        <Form.Item name="search" label="Tên nhóm" rules={[{ required: true, message: 'Nhập tên nhóm' }]}>
                                                            <Input placeholder="Nhập tên nhóm" />
                                                        </Form.Item>
                                                        <Form.Item name="class" label="Lớp">
                                                            <Select>
                                                                {
                                                                    api.classes.map((val) => (
                                                                        <Select.Option value={val}>Lớp {val}</Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                        {/* <Form.Item name="hasSubject" label="Môn học">
                                                            <Select>
                                                                {
                                                                    api.list_sub.map((val) => (
                                                                        <Select.Option value={val}>{val}</Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item> */}
                                                    </Form>
                                                </Modal>

                                                <Modal visible={ofindFr} title="Tìm bạn bè"
                                                    onCancel={() => setOfindFr(false)}
                                                    cancelText="Cancel"
                                                    okText="Tìm"
                                                    onOk={formFFR.submit}
                                                    okButtonProps={{ disabled: finding }}
                                                    cancelButtonProps={{ disabled: finding }}
                                                >
                                                    <Form form={formFFR} onFinish={handleFindFriend}>
                                                        <Form.Item name="search" label="Tìm người dùng" rules={[{ required: true, message: 'Nhập tên người dùng' }]}>
                                                            <Input placeholder="Nhập tên người dùng hoặc username" />
                                                        </Form.Item>
                                                    </Form>
                                                </Modal>
                                                <Row gutter={16}>
                                                    <Col className="gutter-row" span={6}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<AppstoreAddOutlined />} onClick={handleGetSuggetGroup} >Nhóm gợi ý</Button>
                                                    </Col>
                                                    <Col className="gutter-row" span={6}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<AppstoreAddOutlined />} onClick={() => setOcreateGr(true)} >Tạo nhóm mới</Button>
                                                    </Col>
                                                    <Col className="gutter-row" span={6}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<FileSearchOutlined />} onClick={() => setOfindGr(true)} >Tìm nhóm</Button>
                                                    </Col>
                                                    <Col className="gutter-row" span={6}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<UsergroupAddOutlined />} onClick={() => setOfindFr(true)} >Tìm bạn bè</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                        {
                                            groupsRes.length > 0 ?
                                                <div className="panel panel-default">
                                                    <div className="panel-body">
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={groupsRes}
                                                            renderItem={item => (
                                                                <List.Item>
                                                                    <List.Item.Meta
                                                                        avatar={<Avatar icon={<CommentOutlined />} />}
                                                                        title={
                                                                            <b>{item.groupName}</b>
                                                                        }
                                                                    />
                                                                    <Popover onVisibleChange={(e) => handleGetGroupById(e, item.groupId)} content={showGroupInfo} title={"Thông tin nhóm: " + item.groupName}>
                                                                        <EyeOutlined style={{ width: "50px" }} />
                                                                    </Popover>
                                                                    <Button type="primary" onClick={() => handleRequestJoinGroup(item.groupId, item.groupName)}>Xin vào</Button>
                                                                </List.Item>

                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                                :
                                                friendRes.length > 0 ?
                                                    <div className="panel panel-default">
                                                        <div className="panel-body">
                                                            <List
                                                            
                                                                itemLayout="horizontal"
                                                                dataSource={Array.from(new Set(friendRes.map(a => a.username))).map(username => {
                                                                    return friendRes.find(a => a.username === username)
                                                                })}
                                                                renderItem={item => {
                                                                    if (Array.isArray(item)) {
                                                                        return item.map((val, index) => (
                                                                            <List.Item>
                                                                                <List.Item.Meta
                                                                                    avatar={<Avatar icon={<UsergroupAddOutlined />} />}
                                                                                    title={<b>{val.fullname}</b>} description={val.username}
                                                                                />
                                                                                <Button href={`/user/${val.username}`} type="primary">Xem thêm</Button>
                                                                            </List.Item>
                                                                        ))
                                                                    } else {
                                                                        return (
                                                                            <List.Item>
                                                                                <List.Item.Meta
                                                                                    avatar={<Avatar icon={<UsergroupAddOutlined />} />}
                                                                                    title={<b>{item.fullname}</b>} description={item.username}
                                                                                />
                                                                                <Button href={`/user/${item.username}`} type="primary">Xem thêm</Button>
                                                                            </List.Item>
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    :
                                                    <Row gutter={[16, 16]}>
                                                        {
                                                            dataResult.map((val, index) => (
                                                                <Col className="gutter-row" span={24} key={`result-${index}`}>
                                                                    <div className="panel panel-default">
                                                                        <div className="panel-body">
                                                                            <Descriptions title={val.subject} bordered>
                                                                                <Descriptions.Item label="Kết quả gần đây" span={3}>{val.points.slice(-1)[0]} điểm</Descriptions.Item>
                                                                                <Descriptions.Item label="Biểu đồ kết quả" span={3}>
                                                                                    <Bar
                                                                                        data={{
                                                                                            labels: label_result.slice(0, val.points.length),
                                                                                            datasets: [
                                                                                                {
                                                                                                    label: 'Điểm',
                                                                                                    backgroundColor: 'rgba(75,192,192,1)',
                                                                                                    borderColor: 'rgba(0,0,0,1)',
                                                                                                    borderWidth: 1,
                                                                                                    data: val.points
                                                                                                }
                                                                                            ]
                                                                                        }}
                                                                                        height={150}
                                                                                        options={{ maintainAspectRatio: false }}
                                                                                    />
                                                                                </Descriptions.Item>
                                                                            </Descriptions>
                                                                        </div>
                                                                    </div>
                                                                </Col>

                                                            ))
                                                        }
                                                    </Row>
                                        }

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
        userId: state.userId,
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
        updateInfo: (token, username, userId) => dispatch(actions.getInfostatus(token, username, userId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)