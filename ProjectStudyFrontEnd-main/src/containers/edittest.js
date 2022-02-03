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
import Latex from 'react-latex';

const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        subject: "Toán",
        class: "12",
        image: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png",
        question: "baodeptrai ko",
        A: "123",
        B: "345",
        C: "678",
        D: "999",
        correct: "A",
    });
}

const IconText = ({ text }) => (
    <Space>
        {text}
    </Space>
);

const EditTest = (props) => {

    const [groupInfo, setGroupInfo] = useState(null)
    const [questList, setQuestList] = useState([])
    const [showaddquest, setShowaddquest] = useState(false)
    const [formAddQuest] = Form.useForm()
    const [imgQuest, setImgQuest] = useState("")
    const [loadingg, setLoadingg] = useState(false)
    const location = useLocation()


    // use effect là hàm thực thi khi page mới render
    useEffect(() => {
        handlegetGroupInfo()
        handlegetQuestList()
    }, [])

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

    const handlegetQuestList = () => {
        setLoadingg(true)
        axios.get(api.api_question_group_get, {
            params: {
                testId: props.match.params.testid
            }
        }).then(res => res.data)
            .then(res => {
                console.log(res)
                setQuestList(res)
                setLoadingg(false)
            })
            .catch(console.log)
    }

    const handleAddQuest2Test = (e) => {
        axios.post(api.api_question_group, {
            ...e,
            testId: props.match.params.testid,
            groupId: props.match.params.groupid,
            image: imgQuest,

        }, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
                testId: props.match.params.testid,
            }
        }).then(res => res.data)
            .then(res => {
                console.log(res)
                setShowaddquest(false)
                setImgQuest("")
                formAddQuest.resetFields();
                handlegetQuestList()
            })
            .catch(console.log)
    }

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

        axios.delete(api.api_question_group, {
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
                    message.success("xoá thành công")
                    handlegetQuestList()
                } else {
                    message.error("xoá thất bại")
                }
            })
            .catch(console.log)
    }

    const [editQuest, setEditQuest] = useState(null)
    const [editform] = Form.useForm()

    useEffect(() => {
        if(editQuest) {
            editform.resetFields()
            setImgQuest(editform.image)
        }
    }, [editQuest])

    const handleUpdateQuest = (e) => {
        axios.put(api.api_question_group, {
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
                
                message.success("update thành công")
                handlegetQuestList()
            } else {
                message.error("update thất bại")
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
                        groupInfo?.leaderId === props.userId ?
                            <React.Fragment>
                                <PageHeader icon="fa-user" page="Edit test" />
                                <div className="contentpanel">

                                    <div className="row">
                                        <Spin spinning={loadingg}>
                                            <Modal title="Thêm câu hỏi" visible={showaddquest} onCancel={() => setShowaddquest(false)}
                                                onOk={() => formAddQuest.submit()}
                                            >
                                                <Form form={formAddQuest} onFinish={handleAddQuest2Test}>
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
                                                            extra={item.image !== "" ?
                                                                <Image
                                                                    width={272}
                                                                    alt="logo"
                                                                    src={item.image}
                                                                /> : <></>
                                                            }
                                                        >
                                                            <List.Item.Meta
                                                                title={<Latex>{`${item.question}`}</Latex>}
                                                                description={`Đáp án đúng: ${item.correct}`}
                                                            />
                                                            <Button onClick={() => setEditQuest(item)}>Sửa</Button>
                                                            <Button onClick={() => handleDeleteQuestGroup(item._id)}>Xoá</Button>
                                                        </List.Item>
                                                    )}
                                                />
                                                <Modal title="Sửa câu hỏi" visible={editQuest !== null} onCancel={() => setEditQuest(null)}
                                                    onOk={() => editform.submit()}
                                                >
                                                    <Form form={editform} onFinish={handleUpdateQuest} >
                                                        <Form.Item name="question" label="Câu hỏi" initialValue={editQuest?.question}>
                                                            <Input.TextArea />
                                                        </Form.Item>
                                                        <Form.Item label="Image">
                                                            <Upload name="logo" listType="picture" customRequest={uploadFileQuest} fileList={ editQuest?.image !== "" ? [
                                                                {
                                                                    uid: '1',
                                                                    name: 'image.png',
                                                                    status: 'done',
                                                                    url: editQuest?.image,
                                                                },
                                                            ] : []}>
                                                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                            </Upload>
                                                        </Form.Item>
                                                        <Form.Item name="A" label="Đáp án A" initialValue={editQuest?.A}>
                                                            <Input />
                                                        </Form.Item>
                                                        <Form.Item name="B" label="Đáp án B" initialValue={editQuest?.B}>
                                                            <Input />
                                                        </Form.Item>
                                                        <Form.Item name="C" label="Đáp án C" initialValue={editQuest?.C}>
                                                            <Input />
                                                        </Form.Item>
                                                        <Form.Item name="D" label="Đáp án D" initialValue={editQuest?.D}>
                                                            <Input />
                                                        </Form.Item>
                                                        <Form.Item name="correct" label="Đáp án đúng" initialValue={editQuest?.correct}>
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
                            : <></>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditTest)