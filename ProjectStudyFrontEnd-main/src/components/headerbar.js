import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { Avatar } from 'antd';
import { UserOutlined, QuestionOutlined } from '@ant-design/icons';

import { useAppContext } from '../state'
import * as api from '../api';
import axios from 'axios'

import io from "socket.io-client";

import { Button, notification } from 'antd';

const HeaderBar = (props) => {
    const [usermenu, setUsermenu] = useState(false)

    const [openning, setOpenning] = useState("")

    const handleChangeOpen = (tab) => {
        if (openning === tab) {
            setOpenning("")
        } else {
            setOpenning(tab)
        }
    }

    const handleLogout = () => {
        props.logout()
    }

    const { uinfo, igroups, wgroups, notisocket } = useAppContext()

    const [userinfo, setUserinfo] = uinfo
    const [ingroups, setIngroups] = igroups
    const [wtgroups, setWtgroups] = wgroups
    const [socketnoti, setSocketnoti] = notisocket



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

    useEffect(() => {
        if (props.info !== null && ingroups.length === 0) {
            setIngroups([])
            const info1 = props.info
            info1.inGroups.map((idg) => {
                axios.get(api.api_group_user, {
                    params: {
                        username: props.username,
                        token: props.token,
                        groupId: idg
                    }
                })
                    .then(res => res.data)
                    .then(res => {
                        if (res) {
                            setIngroups(oldArray => [...oldArray, res])
                        }
                    })
                    .catch(console.log)
            })
        }
        if (props.info !== null && wtgroups.length === 0) {
            const info2 = props.info
            setWtgroups([])
            info2.waitGroups.map((idg) => {
                setWtgroups(oldArray => [...oldArray, {
                    _id: idg.groupId,
                    name: idg.groupName
                }]);
            })
        }
    }, [props.info])

    useEffect(() => {
        handleGetUserInfo()
        handleGetAllNotifies()

    }, []);

    const [notifies, setNotifies] = useState([])

    const handleGetAllNotifies = () => {
        axios.get(api.api_notify, {
            params: {
                username: props.username,
                token: props.token,
                userId: props.userId
            }
        }).then(res => res.data)
            .then(res => {
                res.reverse()
                setNotifies(res)
                console.log("noties: ", res)
            })
            .catch(console.log)
    }

    const handleReadNotify = (id) => {
        axios.patch(api.api_notify_read, {}, {
            params: {
                notifyId: id
            }
        }).then(res => res.data)
        .then(res => {
            console.log(res)
            handleGetAllNotifies()
        })
        .catch(console.log)
    }

    useEffect(() => {
        if (socketnoti === null && props.userId !== null) {
            setSocketnoti(io(api.socket_noti))
        }
    }, []);


    useEffect(() => {
        if (!socketnoti) return;

        socketnoti.emit('user connect', props?.userId)

        socketnoti.on('require do test', (data) => {
            console.log(data)
            notification.open({
                message: 'Yêu cầu làm test',
                description: 'Bạn có một yêu cầu làm test',
                duration: 5,
                placement: "bottomRight"
            })
            handleGetAllNotifies()
        })

        socketnoti.on('done test', (data) => {
            console.log(data)
            notification.open({
                message: 'Phê duyệt nhóm',
                description: 'Có người đã hoàn thành bài test, hãy kiểm tra từ thông báo',
                duration: 5,
                placement: "bottomRight"
            })
            handleGetAllNotifies()
        })

    }, [socketnoti]);

    return (
        <div className="headerbar">

            <a className="menutoggle" onClick={() => props.oncolapseleftmn(!props.colapseleftmn)}><i className="fa fa-bars"></i></a>

            <form className="searchform">
                <input type="text" className="form-control" name="keyword" placeholder="Tìm kiếm..." />
            </form>

            <div className="header-right">
                <ul className="headermenu">

                    <li>
                        <div className={openning === "mail" ? "btn-group open" : "btn-group"} >
                            <button onClick={() => handleChangeOpen("mail")} className="btn btn-default dropdown-toggle tp-icon" data-toggle="dropdown">
                                <i className="glyphicon glyphicon-envelope"></i>
                                {
                                    notifies.filter(res => res.isRead === false && res.type === "require do test").length > 0 ?
                                        <span className="badge">{notifies.filter(res => res.isRead === false && res.type === "require do test").length}</span>
                                        : <></>
                                }

                            </button>
                            <div className="dropdown-menu dropdown-menu-head pull-right">
                                <h5 className="title">Thông báo bài test</h5>
                                <ul className="dropdown-list gen-list">
                                    {
                                        notifies.filter(res => res.type === "require do test").map(val => (
                                            <li className="new">
                                                <Link to={`/group-test/${val.testId}/${val.groupId}`}>
                                                    <span className="thumb">
                                                        <Avatar icon={<QuestionOutlined />} />
                                                    </span>
                                                    <span className="desc">
                                                        <span className="name">Từ nhóm: {val.groupName} { val.isRead ? "" : <span className="badge badge-success">mới</span> }</span>
                                                        <span className="msg">{val.createAt.slice(0, 24)}</span>
                                                    </span>
                                                </Link>
                                            </li>
                                        ))
                                    }

                                </ul>
                            </div>
                        </div>
                    </li>

                    <li>
                        <div className={openning === "all" ? "btn-group open" : "btn-group"}>
                            <button onClick={() => handleChangeOpen("all")} className="btn btn-default dropdown-toggle tp-icon" data-toggle="dropdown">
                                <i className="glyphicon glyphicon-globe"></i>
                                {
                                    notifies.filter(res => res.isRead === false && res.type === "done test").length > 0 ?
                                        <span className="badge">{notifies.filter(res => res.isRead === false && res.type === "done test").length}</span>
                                        : <></>
                                }
                            </button>
                            <div className="dropdown-menu dropdown-menu-head pull-right">
                                <h5 className="title">Thông báo</h5>
                                <ul className="dropdown-list gen-list" style={{ maxHeight: "500px", overflowX: "auto" }}>
                                    {
                                        notifies.filter(res => res.type === "done test").map(val => (
                                            <li className="new">
                                                <Link to={`/chat/${val.groupId}`} onClick={() => handleReadNotify(val._id)}>
                                                    <span className="thumb">
                                                        <Avatar icon={<QuestionOutlined />} />
                                                    </span>
                                                    <span className="desc">
                                                        <span className="name">Có người hoàn thành bài test trong nhóm: {val.groupName} { val.isRead ? "" : <span className="badge badge-success">mới</span> }</span>
                                                        <span className="msg">{val.createAt.slice(0, 24)}</span>
                                                    </span>
                                                </Link>
                                            </li>
                                        ))
                                    }

                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>

                        <div className={usermenu ? "btn-group open" : "btn-group"}>
                            <button type="button" className="btn btn-default dropdown-toggle" onClick={() => setUsermenu(!usermenu)}>
                                <Avatar size={26} icon={<UserOutlined />} style={{ marginRight: "5px" }} />
                                {props.username ? props.username : "Loading ..."}
                                <span className="caret"></span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-usermenu pull-right">
                                <li><Link to="/profile"><i className="glyphicon glyphicon-user"></i> Thông tin tài khoản</Link></li>
                                <li><Link to="/settings"><i className="glyphicon glyphicon-cog"></i> Cài đặt</Link></li>
                                <li><Link to="/FAQ"><i className="glyphicon glyphicon-question-sign"></i> FAQ</Link></li>
                                <li><a onClick={handleLogout}><i className="glyphicon glyphicon-log-out"></i> Đăng xuất</a></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button id="chatview" className="btn btn-default tp-icon chat-icon">
                            <i className="glyphicon glyphicon-comment"></i>
                        </button>
                    </li>
                </ul>
            </div>

        </div>
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
        info: state.info,
        userId: state.userId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        updateChange: () => dispatch(actions.updateChange()),
        updateInfo: (token, username, userId) => dispatch(actions.getInfostatus(token, username, userId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)