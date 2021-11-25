import { Spin, Avatar, Button, Tooltip, Popconfirm, message, Badge, Input, Image, Divider, Upload, Typography, Modal, Select, Form, Row, Col } from 'antd';
import { UserOutlined, DeleteOutlined, UsergroupAddOutlined, UploadOutlined, StarOutlined, LinkOutlined } from '@ant-design/icons';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'
import io from "socket.io-client";


const { TextArea } = Input;

const Chat = (props) => {

    const [imin, setImin] = useState(false)
    const { uinfo, igroups, wgroups, notisocket } = useAppContext()

    const [userinfo, setUserinfo] = uinfo
    const [ingroups, setIngroups] = igroups
    const [wtgroups, setWtgroups] = wgroups

    const [dropmenu, setDropmenu] = useState("")

    const [current, setCurrent] = useState(null)

    const [groupInfo, setGroupInfo] = useState(null)

    const location = useLocation()

    const handleSetmenu = (menu) => {
        if (dropmenu == menu) {
            setDropmenu("")
        }
        else {
            setDropmenu(menu)
        }
    }

    useEffect(() => {
        // console.log(location)
        handlegetGroupInfo()
        const abc = ingroups.find(data => data._id === props.match.params.groupid)
        if (abc === undefined) {
            // alert("Bạn chưa được duyệt vào nhóm")
            // props.history.push("/")
            setImin(false)
        }
        else {
            setImin(true)
        }
        setCurrent(ingroups.find(data => data._id === props.match.params.groupid))
        console.log("cureetn: ",ingroups.find(data => data._id === props.match.params.groupid))
    }, [ingroups, props.match.params.groupid])

    const handlegetGroupInfo = () => {
        axios.get(api.api_group_user, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid
            }
        }).then(res => res.data)
        .then(res => {
            setGroupInfo(res)
        })
        .catch(console.log)
    }

    const handlDeleteGroup = () => {
        axios.delete(api.api_group_user, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid
            }
        }).then(res => res.data)
            .then(res => {
                if (typeof (res) === "object") {
                    if (res.success) {
                        props.history.push("/")
                        message.success("Xoá nhóm thành công.")
                    } else {
                        message.error("Xoá nhóm thất bại.")
                    }
                } else {
                    message.error(res)
                }
            }).catch(() => {
                message.error("Có lỗi xảy ra trong quá trình xoá group.")
            })
    }

    //socket stuffs
    const [socket, setSocket] = useState(null);
    const [socketnoti, setSocketnoti] = notisocket

    const [socketConnected, setSocketConnected] = useState(0);
    const [messag, setMessag] = useState("")
    const [data, setData] = useState([])
    const [pload, setPload] = useState(1)

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        if (imin) {
            setSocket(io(api.socket_chat))
            handleGetAllChat()
            handlGetTestList()
        }
    }, [imin]);

    const handleGetAllChat = () => {
        axios.get(api.api_chat, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
                load: pload
            }
        }).then(res => res.data)
            .then(res => {
                //console.log(res)
                res.reverse()
                setData(res)
                scrollToBottom();
            })
            .catch(console.log)
    }


    useEffect(() => {
        if (!socket) return;

        socket.on('connect', () => {
            setSocketConnected(1);
        });
        socket.on('disconnect', () => {
            setSocketConnected(0);
        });
        socket.on('connnected', (data1) => {
            if (data1) {
                setSocketConnected(2)
            } else {
                setSocketConnected(0)
            }
        });
        socket.emit('join chat room', props.match.params.groupid)

        socket.on('outputChatMessage', (data1) => {
            setData(oldArray => [...oldArray, data1])
            scrollToBottom()
        });


    }, [socket]);

    const [msgfiles, setMsgfiles] = useState([])

    const handleSendMsg = () => {
        if (socketConnected == 2) {
            socket.emit('inputChatMessage', {
                groupId: props.match.params.groupid,
                sender: props.username,
                message: messag,
                type: "text",
                time: new Date().toString()
            })
            setMessag("")
            // console.log(msgfiles)
            msgfiles.map(e => {
                socket.emit('inputChatMessage', {
                    groupId: props.match.params.groupid,
                    sender: props.username,
                    message: e.fileURL,
                    type: e.type,
                    time: new Date().toString()
                })
            })
            setMsgfiles([])
            setFileList([])
        }
    }

    const handleAcceptToGroup = (uid) => {
        axios.post(api.api_member, {
            groupId: props.match.params.groupid,
            username: uid,
        }, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
            }
        }).then(res => res.data)
            .then(res => {
                if (res?.success)
                {
                    message.success("Duyệt vào nhóm thành công")
                }
            }).catch(console.log)
    }

    const handleDenyToGroup = (uid) => { 
        axios.patch(api.api_group_deny, {
            groupId: props.match.params.groupid,
            username: uid,
        }, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
            }
        }).then(res => res.data)
            .then(res => {
                if (res?.success)
                {
                    message.success("Đã từ chối nhóm")
                }
            }).catch(console.log)
    }


    // test request

    const [showChooseTest, setShowChooseTest] = useState("")
    const [testlist, setTestlist] = useState([])
    const [picktest] = Form.useForm()

    const handlGetTestList = () => {
        axios.get(api.api_group_test_all, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid
            }
        }).then(res => res.data)
            .then(res => {
                // console.log(res)
                setTestlist(res)
            })
            .catch(console.log)
    }

    const handleSetTargetTest = (username) => {
        if (showChooseTest === username)
        {
            setShowChooseTest("")
        } else {
            setShowChooseTest(username)
        }
    }

    const handleSendTestRequest = (e) => {
        const sdata = {
            groupId: props.match.params.groupid, 
            username: showChooseTest, 
            testId: e.testId,
            createAt: new Date().toString(),
        }
        // console.log(sdata)
        socketnoti.emit('require do test', sdata)
        message.success("Đã gửi yêu cầu làm bài test")
        setShowChooseTest("")
    }

    //end socket stuffs

    const [fileList, setFileList] = useState([])

    const props_upload = {
        // action: api.api_upload_chat,

        onChange({ file, fileList }) {
            setFileList(fileList)
        },
        showUploadList: {
            showDownloadIcon: true,
            downloadIcon: 'download ',
            showRemoveIcon: true,
            removeIcon: <StarOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
        },
        fileList: fileList,
    };



    const uploadFile = async options => {
        const { onSuccess, onError, file, onProgress } = options;
        // console.log(file)
        const fmData = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            },
        };
        fmData.append("files", file);
        fmData.append("groupId", props.match.params.groupid);
        fmData.append("username", props.username);
        try {
            const res = await axios.post(
                api.api_upload_chat,
                fmData,
                config
            );
            onSuccess("Ok");
            if (res.status === 200 && res.data.length > 0) {
                // console.log(res)
                setMsgfiles(old => [...old, res.data[0]])
            }
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
                            <PageHeader page="Nhóm học" subtitle={current?.name} />
                            <div className="contentpanel panel-email">

                                <div className="row">
                                    <div className="col-sm-12 col-lg-12">

                                        <div className="panel panel-default">
                                            <div className="panel-body">

                                                <div className="pull-right">
                                                    
                                                    {
                                                        groupInfo?.leaderId === props.userId ?
                                                        <React.Fragment>
                                                            <div className="btn-group mr10">
                                                                <Tooltip title="Xoá group">
                                                                    <Popconfirm placement="bottom" title={"Bạn có chắc chắn xoá group ?"} onConfirm={handlDeleteGroup} okText="Yes" cancelText="No">
                                                                        <Button size="small" icon={<DeleteOutlined />} />
                                                                    </Popconfirm>
                                                                </Tooltip>
                                                            </div>
                                                            <div className="btn-group mr10">
                                                                <div className={dropmenu === "userrequest" ? "btn-group nomargin open" : "btn-group nomargin"}>
                                                                    <Badge count={current?.joinRequest.length}>
                                                                        <button onClick={() => handleSetmenu("userrequest")} data-toggle="dropdown" className="btn btn-sm btn-white dropdown-toggle tooltips" type="button" title="Move to Folder">
                                                                            <UsergroupAddOutlined />
                                                                            <span className="caret"></span>
                                                                        </button>
                                                                    </Badge>
                                                                    <Modal visible={showChooseTest}
                                                                        onCancel={() => setShowChooseTest("")}
                                                                        onOk={() => picktest.submit()}
                                                                        title="Gửi yêu cầu làm test"
                                                                    >
                                                                        <Form form={picktest} onFinish={handleSendTestRequest} >
                                                                            <Form.Item label="Chọn bài test" name="testId" initialValue="">
                                                                                <Select>
                                                                                    {
                                                                                        testlist.map(val => (
                                                                                            <Select.Option value={val._id}>{val.subject}</Select.Option>
                                                                                        ))
                                                                                    }
                                                                                </Select>
                                                                            </Form.Item>
                                                                        </Form>
                                                                    </Modal>

                                                                    <ul className="dropdown-menu" style={{ minWidth: `${250}px`, "left": "-152px", maxHeight: "500px", overflowY: "auto" }}>
                                                                        {
                                                                            current?.joinRequest.map((val) => (
                                                                                <li style={{ paddingLeft: "10px" }}>
                                                                                    <UserOutlined className="glyphicon glyphicon-tag mr5" /> {val.username} 
                                                                                    <Row>
                                                                                        <Col span={24}>
                                                                                            {
                                                                                                val.results !== "" ?
                                                                                                "Kết quả test: " + val.results.point
                                                                                                :
                                                                                                ""
                                                                                            }
                                                                                        </Col>
                                                                                        <Col span={8}><Button onClick={() => handleAcceptToGroup(val.username)}>OK</Button></Col>
                                                                                        <Col span={8}><Button onClick={() => handleDenyToGroup(val.username)}>Deny</Button></Col>
                                                                                        <Col span={8}><Button onClick={() => handleSetTargetTest(val.username)}>Test</Button></Col>
                                                                                    </Row>
                                                                                    <Divider />
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="btn-group mr10">
                                                                <Link to={location.pathname + "/tests"} className="btn btn-sm btn-white dropdown-toggle tooltips" type="button" title="Move to Folder">
                                                                    QL Test
                                                                </Link>
                                                            </div>
                                                        </React.Fragment>
                                                        : <></>
                                                    }
                                                    

                                                    

                                                </div>

                                                <div className="btn-group mr10">
                                                    {/* <button className="btn btn-sm btn-white tooltips" type="button" data-toggle="tooltip" title="Read Next Email"><i className="glyphicon glyphicon-chevron-right"></i></button> */}
                                                    <div className="btn tooltips">
                                                        <b>Status:</b> {socketConnected === 0 ? <Badge status="default" /> : socketConnected === 1 ? <Badge size="default" status="success" /> : socketConnected === 2 ? <Badge status="default" status="processing" /> : <Badge status="default" />}
                                                    </div>

                                                </div>

                                                {/* messages */}
                                                <div style={{ height: "48vh", overflowY: "auto" }} id="msges">
                                                    {
                                                        data.map((val) => (
                                                            <div className="read-panel">
                                                                <div className="media">
                                                                    <a className="pull-left">
                                                                        {
                                                                            JSON.parse(val.sender).avatar === "" ?
                                                                                <Avatar size={40} icon={<UserOutlined />} style={{ marginRight: "5px" }} />
                                                                                :
                                                                                <Avatar size={40} src={<Image src={JSON.parse(val.sender).avatar} />} style={{ marginRight: "5px" }} />
                                                                        }
                                                                    </a>
                                                                    <div className="media-body">
                                                                        <span className="media-meta pull-right">{val.time}</span>
                                                                        <h4 className="text-primary">{JSON.parse(val.sender).fullname}</h4>
                                                                    </div>
                                                                </div>

                                                                <h4 className="email-subject" onLoad={scrollToBottom} style={{ lineBreak: "anywhere" }}>{
                                                                    val.type === "image" ?
                                                                        <Image src={val.message} width="200px" />
                                                                    :
                                                                    val.type === "file" ?
                                                                        <Typography.Link href={val.message} target="_blank">
                                                                            <LinkOutlined /> {val.message.split("/")[val.message.split("/").length - 1].split("-")[val.message.split("/")[val.message.split("/").length - 1].split("-").length - 1]}
                                                                        </Typography.Link>
                                                                    :
                                                                    val.type === "video" ?
                                                                        <video width="400" controls onLoad={scrollToBottom}>
                                                                            <source src={val.message} />
                                                                        </video>
                                                                    :
                                                                        val.message
                                                                }</h4>
                                                            </div>
                                                        ))
                                                    }
                                                    <div ref={messagesEndRef} />
                                                </div>

                                                {/* send message */}
                                                <div className="read-panel">
                                                    <div className="media">
                                                        <a className="pull-left">
                                                            <Avatar size={26} icon={<UserOutlined />} style={{ marginRight: "5px" }} />
                                                        </a>
                                                        <div className="media-body">
                                                            <Input.TextArea value={messag} rows={2} onChange={(e) => setMessag(e.target.value)} onKeyUp={(e) => {
                                                                if (e.key == "Enter") {
                                                                    handleSendMsg()
                                                                }
                                                            }} />
                                                            <Divider />
                                                            <Button className="mr5" type="primary" onClick={handleSendMsg}>Gửi</Button>

                                                            <Upload {...props_upload} multiple customRequest={uploadFile}>
                                                                <Button icon={<UploadOutlined />}>Upload</Button>
                                                            </Upload>
                                                        </div>
                                                    </div>
                                                </div>

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
        info: state.info,
        userId: state.userId,
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat)