import { Spin, List, Avatar, Space, Button, Modal, message, Form, Radio, Select, Input, Upload, Image } from 'antd';
import { UploadOutlined, MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'

import EquationEditor from "equation-editor-react";
import MathQ from '../components/matheq';

const IconText = ({ text }) => (
    <Space>
        {text}
    </Space>
);

const AddSysQuest = (props) => {
    const [showaddquest, setShowaddquest] = useState(false)
    const [formAddQuest] = Form.useForm()
    const location = useLocation()

    const [equation, setEquation] = useState("");

    useEffect(() => {
        handleGetQuestList()
    },[])


    const [questList, setQuestList] = useState([])

    const handleGetQuestList = () => {
        axios.get(api.api_question_system, {
            params: {
                username: props.username,
                token: props.token,
            }
        }).then(res => res.data)
        .then(res => {
            console.log(res)
            setQuestList(res)
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
                                    <Modal visible={showaddquest} onCancel={() => setShowaddquest(false)}
                                        title="Thêm quest system"
                                        onOk={() => formAddQuest.submit()}
                                    >
                                        <Form form={formAddQuest} onFinish={handleAddQuestList}>
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
                                            <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: 'Chọn môn học' }]}>
                                                <Select>
                                                    {
                                                        api.list_sub.map((val) => (
                                                            <Select.Option value={val}>{val}</Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="question" label="Câu hỏi" rules={[{ required: true, message: 'Nhập câu hỏi' }]}>
                                                <Input.TextArea />
                                            </Form.Item>
                                            <Form.Item label="Image">
                                                <Upload name="logo" listType="picture" customRequest={uploadFileQuest}>
                                                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                </Upload>
                                            </Form.Item>
                                            <Form.Item name="A" label="Đáp án A" rules={[{ required: true, message: 'Nhập câu trả lời' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="B" label="Đáp án B" rules={[{ required: true, message: 'Nhập câu trả lời' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="C" label="Đáp án C" rules={[{ required: true, message: 'Nhập câu trả lời' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="D" label="Đáp án D" rules={[{ required: true, message: 'Nhập câu trả lời' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="correct" label="Đáp án đúng" rules={[{ required: true, message: 'Chọn câu trả lời' }]} initialValue="A">
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
                                        <Button onClick={() => setShowaddquest(!showaddquest)}>Thêm câu hỏi</Button>
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
                                                    extra={ item.image.length > 0 ?
                                                        <Image
                                                            height={100}
                                                            alt="logo"
                                                            src={item.image[0]}
                                                        /> : <></>
                                                    }
                                                >
                                                    <List.Item.Meta
                                                        title={item.question}
                                                        description={`Đáp án đúng: ${item.correct}`}
                                                    />
                                                </List.Item>
                                            )}
                                        />

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

export default connect(mapStateToProps, mapDispatchToProps)(AddSysQuest)