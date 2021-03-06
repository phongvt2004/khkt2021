import { Spin, List, Avatar, Space, Button, Modal, message, Form, Radio, Select, Input, Upload, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'

import Latex from 'react-latex';

const IconText = ({ text }) => (
    <Space>
        {text}
    </Space>
);

const AddSysQuest = (props) => {
    const [showaddquest, setShowaddquest] = useState(false)
    const [formAddQuest] = Form.useForm()
    const location = useLocation()

    const [loadingg, setLoadingg] = useState(false)

    useEffect(() => {
        handleGetQuestList()
    }, [])


    const [questList, setQuestList] = useState([])

    const handleGetQuestList = () => {
        setLoadingg(true)
        axios.get(api.api_question_system, {
            params: {
                username: props.username,
                token: props.token,
            }
        }).then(res => res.data)
            .then(res => {
                console.log(res)
                setQuestList(res)
                setLoadingg(false)
            }).catch(console.log)
    }

    const handleAddQuestList = (e) => {
        axios.post(api.api_question_system, {
            ...e,
            image: imgQuest,
        }, {
            params: {
                username: props.username,
                token: props.token,
            }
        }).then(res => res.data)
            .then(res => {
                console.log(res)
                handleGetQuestList()
                setImgQuest("")
                setShowaddquest(false)
            }).catch(console.log)
    }

    const [imgQuest, setImgQuest] = useState("")

    const uploadFileQuest = async options => {
        const { onSuccess, onError, file, onProgress } = options;
        // console.log(file)
        const fmData = new FormData();
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            },
        };
        fmData.append("files", file);
        try {
            const res = await axios.post(
                api.api_upload_quest,
                fmData,
                config
            );
            onSuccess("Ok");
            if (res.status === 200 && res.data.length > 0) {
                setImgQuest(res.data[0])
            }
        } catch (err) {
            console.log("Eroor: ", err);
            const error = new Error("Some error");
            onError({ err });
        }
    }

    const handleDeleteQuestGroup = (id) => {

        axios.delete(api.api_question_system, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
                questionId: id,
            }
        })
            .then(res => res.data)
            .then(res => {
                if (res.success) {
                    message.success("xo?? th??nh c??ng")
                    handleGetQuestList()
                } else {
                    message.error("xo?? th???t b???i")
                }
            })
            .catch(console.log)
    }

    const [editQuest, setEditQuest] = useState(null)
    const [editform] = Form.useForm()

    useEffect(() => {
        if (editQuest) {
            editform.resetFields()
            setImgQuest(editform.image)
        }
    }, [editQuest])

    const handleUpdateQuest = (e) => {
        axios.put(api.api_question_system, {
            ...e,
        }, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
                questionId: editQuest?._id,
            }
        }).then(res => res.data)
            .then(res => {
                setEditQuest(null)
                if (res.success) {
                    message.success("update th??nh c??ng")
                    handleGetQuestList()
                } else {
                    message.error("update th???t b???i")
                }
            })
            .catch(() => setEditQuest(null))
    }


    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size='large' />
                    :
                    props.isAuthenticated ?
                        <React.Fragment>
                            <PageHeader icon="fa-user" page="Edit test" />
                            <div className="contentpanel">

                                <div className="row">
                                    <Spin spinning={false}>
                                        <Modal visible={showaddquest} onCancel={() => setShowaddquest(false)}
                                            title="Th??m quest system"
                                            onOk={() => formAddQuest.submit()}
                                        >
                                            <Form form={formAddQuest} onFinish={handleAddQuestList}>
                                                <Form.Item name="class" label="L???p" rules={[{ required: true, message: 'Nh???p kh???i, l???p' }]}>
                                                    <Select>
                                                        {
                                                            api.classes.map((val) => (
                                                                <Select.Option value={val}>L???p {val}</Select.Option>
                                                            ))
                                                        }
                                                        <Select.Option value="all">All</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name="subject" label="M??n h???c" rules={[{ required: true, message: 'Ch???n m??n h???c' }]}>
                                                    <Select>
                                                        {
                                                            api.list_sub.map((val) => (
                                                                <Select.Option value={val}>{val}</Select.Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item>
                                                    <a href="https://lnv3i.csb.app/" target="_blank">C??ng th???c to??n h???c</a>
                                                </Form.Item>
                                                <Form.Item name="question" label="C??u h???i" rules={[{ required: true, message: 'Nh???p c??u h???i' }]}>
                                                    <Input.TextArea />
                                                </Form.Item>
                                                <Form.Item label="Image">
                                                    <Upload name="logo" listType="picture" customRequest={uploadFileQuest}>
                                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                    </Upload>
                                                </Form.Item>
                                                <Form.Item name="A" label="????p ??n A" rules={[{ required: true, message: 'Nh???p c??u tr??? l???i' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="B" label="????p ??n B" rules={[{ required: true, message: 'Nh???p c??u tr??? l???i' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="C" label="????p ??n C" rules={[{ required: true, message: 'Nh???p c??u tr??? l???i' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="D" label="????p ??n D" rules={[{ required: true, message: 'Nh???p c??u tr??? l???i' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item name="correct" label="????p ??n ????ng" rules={[{ required: true, message: 'Ch???n c??u tr??? l???i' }]} initialValue="A">
                                                    <Select>
                                                        <Select.Option value="A">A</Select.Option>
                                                        <Select.Option value="B">B</Select.Option>
                                                        <Select.Option value="C">C</Select.Option>
                                                        <Select.Option value="D">D</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Form>
                                        </Modal>

                                        <div className="col-sm-3">
                                            <Button onClick={() => setShowaddquest(!showaddquest)}>Th??m c??u h???i</Button>
                                        </div>
                                        <div className="col-sm-9">
                                            <List
                                                itemLayout="vertical"
                                                size="large"
                                                pagination={{
                                                    onChange: page => {
                                                        console.log(page);
                                                    },
                                                    pageSize: 10,
                                                }}
                                                dataSource={questList}
                                                renderItem={(item, index) => (
                                                    <List.Item
                                                        key={index}
                                                        actions={[
                                                            <IconText text={`A. ${item.A}`} key="list-vertical-star-o" />,
                                                            <IconText text={`B. ${item.B}`} key="list-vertical-star-o" />,
                                                            <IconText text={`C. ${item.C}`} key="list-vertical-star-o" />,
                                                            <IconText text={`D. ${item.D}`} key="list-vertical-star-o" />,
                                                        ]}
                                                        extra={item.image.length > 0 ?
                                                            <Image
                                                                height={100}
                                                                alt="logo"
                                                                src={item.image[0]}
                                                            /> : <></>
                                                        }
                                                    >
                                                        <List.Item.Meta
                                                            title={<Latex>{`${item.question}`}</Latex>}
                                                            description={`????p ??n ????ng: ${item.correct}`}
                                                        />
                                                        <Button onClick={() => setEditQuest(item)}>S???a</Button>
                                                        <Button onClick={() => handleDeleteQuestGroup(item._id)}>Xo??</Button>
                                                    </List.Item>
                                                )}
                                            />
                                            <Modal title="S???a c??u h???i" visible={editQuest !== null} onCancel={() => setEditQuest(null)}
                                                onOk={() => editform.submit()}
                                            >
                                                <Form form={editform} onFinish={handleUpdateQuest} >
                                                    <Form.Item name="question" label="C??u h???i" initialValue={editQuest?.question}>
                                                        <Input.TextArea />
                                                    </Form.Item>
                                                    <Form.Item label="Image">
                                                        <Upload name="logo" listType="picture" customRequest={uploadFileQuest} fileList={editQuest?.image[0] !== "" ? [
                                                            {
                                                                uid: '1',
                                                                name: 'image.png',
                                                                status: 'done',
                                                                url: editQuest?.image[0],
                                                            },
                                                        ] : []}>
                                                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                    <Form.Item name="A" label="????p ??n A" initialValue={editQuest?.A}>
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="B" label="????p ??n B" initialValue={editQuest?.B}>
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="C" label="????p ??n C" initialValue={editQuest?.C}>
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="D" label="????p ??n D" initialValue={editQuest?.D}>
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item name="correct" label="????p ??n ????ng" initialValue={editQuest?.correct}>
                                                        <Select>
                                                            <Select.Option value="A">A</Select.Option>
                                                            <Select.Option value="B">B</Select.Option>
                                                            <Select.Option value="C">C</Select.Option>
                                                            <Select.Option value="D">D</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Form>
                                            </Modal>
                                        </div>
                                    </Spin>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddSysQuest)