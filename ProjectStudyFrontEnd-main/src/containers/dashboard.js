import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'

import { Spin, Button, Row, Col, Descriptions, message, Modal, Form, Input, Select, List, Skeleton, Avatar } from 'antd';

import { AppstoreAddOutlined, FileSearchOutlined, UsergroupAddOutlined, CommentOutlined } from '@ant-design/icons';
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

    const [finding, setFinding] = useState(false)

    //socket stuffs
    // const [socket, setSocket] = useState(null);
    // const [socketConnected, setSocketConnected] = useState(false);

    // useEffect(() => {
    //     setSocket(io(api.socket_chat))
    // }, []);

    // useEffect(() => {
    //     if (!socket) return;

    //     socket.on('connect', () => {
    //         setSocketConnected(socket.connected);
    //     });
    //     socket.on('disconnect', () => {
    //         setSocketConnected(socket.connected);
    //     });

    // }, [socket]);

    // const handleSocketConnection = () => {
    //     if (socketConnected)
    //         socket.disconnect();
    //     else {
    //         socket.connect();
    //     }
    // }
    // <div>
    //     <div>
    //         <b>Connection status:</b> {socketConnected ? 'Connected' : 'Disconnected'}
    //     </div>
    //     <input
    //         type="button"
    //         style={{ marginTop: 10 }}
    //         value={socketConnected ? 'Disconnect' : 'Connect'}
    //         onClick={handleSocketConnection} />
    // </div>

    //end socket stuffs



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

    const handleFindGroup = (e) => {
        setFinding(true)
        axios.get(api.api_search_group, {
            params: {
                username: props.username,
                token: props.token,
                ...e
            }
        }).then(res => res.data)
            .then(res => {
                setFriendres([])
                if (typeof(res) === "object") {
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
            if (typeof(res) === "object") {
                if (res.success)
                {
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
                                            <div className="panel-body">
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
                                                                <Select.Option value="all">All</Select.Option>
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
                                                        <Form.Item name="class" label="Lớp" rules={[{ required: true, message: 'Chọn khối, lớp' }]} initialValue="all">
                                                            <Select>
                                                                {
                                                                    api.classes.map((val) => (
                                                                        <Select.Option value={val}>Lớp {val}</Select.Option>
                                                                    ))
                                                                }
                                                                <Select.Option value="all">All</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item name="hasSubject" label="Môn học">
                                                            <Select>
                                                                {
                                                                    api.list_sub.map((val) => (
                                                                        <Select.Option value={val}>{val}</Select.Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
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
                                                    <Col className="gutter-row" span={8}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<AppstoreAddOutlined />} onClick={() => setOcreateGr(true)} >Tạo nhóm mới</Button>
                                                    </Col>
                                                    <Col className="gutter-row" span={8}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<FileSearchOutlined />} onClick={() => setOfindGr(true)} >Tìm nhóm</Button>
                                                    </Col>
                                                    <Col className="gutter-row" span={8}>
                                                        <Button style={{ width: "100%", height: "50px", fontSize: "18px" }} icon={<UsergroupAddOutlined />} onClick={() => setOfindFr(true)} >Tìm bạn bè</Button>
                                                    </Col>
                                                </Row>
                                                <div className="mb30"></div>
                                                {
                                                    groupsRes.length > 0 ?
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={groupsRes}
                                                            renderItem={item => (
                                                                <List.Item>
                                                                    <List.Item.Meta
                                                                        avatar={<Avatar icon={<CommentOutlined />} />}
                                                                        title={<b>{item.groupName}</b>}
                                                                    />
                                                                    <Button type="primary" onClick={() => handleRequestJoinGroup(item.groupId, item.groupName)}>Xin vào</Button>
                                                                </List.Item>
                                                            )}
                                                        />
                                                        :
                                                        friendRes.length > 0 ?
                                                            <List
                                                                itemLayout="horizontal"
                                                                dataSource={friendRes}
                                                                renderItem={item => (
                                                                    <List.Item>
                                                                        <List.Item.Meta
                                                                            avatar={<Avatar icon={<UsergroupAddOutlined />} />}
                                                                            title={<b>{item.fullname}</b>} description={item.username}
                                                                        />
                                                                        <Button type="primary">Xem thêm</Button>
                                                                    </List.Item>
                                                                )}
                                                            />
                                                            :
                                                            <Row gutter={[16, 16]}>
                                                                <Col className="gutter-row" span={24}>
                                                                    <Descriptions title="Toán" bordered>
                                                                        <Descriptions.Item label="Kết quả gần đây">9 điểm</Descriptions.Item>
                                                                        <Descriptions.Item label="Thời gian làm bài" span={2}>20 phút</Descriptions.Item>
                                                                        <Descriptions.Item label="Biểu đồ kết quả" span={3}>
                                                                            <Bar
                                                                                data={{
                                                                                    labels: ['T1', 'T2', 'T3', 'T4', 'T5'],
                                                                                    datasets: [
                                                                                        {
                                                                                            label: 'Điểm',
                                                                                            backgroundColor: 'rgba(75,192,192,1)',
                                                                                            borderColor: 'rgba(0,0,0,1)',
                                                                                            borderWidth: 1,
                                                                                            data: [9, 8, 10, 8, 9]
                                                                                        }
                                                                                    ]
                                                                                }}
                                                                                height={150}
                                                                                options={{ maintainAspectRatio: false }}
                                                                            />
                                                                        </Descriptions.Item>
                                                                    </Descriptions>
                                                                </Col>
                                                            </Row>
                                                }

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