import { Spin, List, Button, Modal, message, Form, Radio, Select, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'

const Tests = (props) => {

    const [groupInfo, setGroupInfo] = useState(null)
    const [testlist, setTestlist] = useState([])
    const [showaddtest, setShowaddtest] = useState(false)
    const [formAddtest] = Form.useForm()
    const location = useLocation()

    useEffect(() => {
        handlegetGroupInfo()
        handlGetTestList()
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

    const handlGetTestList = () => {
        axios.get(api.api_group_test_all, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid
            }
        }).then(res => res.data)
            .then(res => {
                console.log(res)
                setTestlist(res)
            })
            .catch(console.log)
    }

    const handleAddNewTest = (e) => {
        axios.post(api.api_group_test, {
            ...e,
            groupId: props.match.params.groupid,
        }, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid
            }
        }).then(res => res.data)
            .then(res => {
                if (res.success) {
                    message.success("T???o b??i test m???i th??nh c??ng")
                }
                setShowaddtest(false)
                handlGetTestList()
            })
            .catch(console.log)
    }

    const handleDeleteTest = (id) => {
        axios.delete(api.api_group_test, {
            params: {
                username: props.username,
                token: props.token,
                groupId: props.match.params.groupid,
                testId: id
            }
        }).then(res => res.data)
        .then(res => {
            handlGetTestList()
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
                        groupInfo?.leaderId === props.userId ?
                            <React.Fragment>
                                <PageHeader icon="fa-user" page="Qu???n l?? b??i test" />
                                <div className="contentpanel">
                                    <Modal visible={showaddtest} onCancel={() => setShowaddtest(false)}
                                        onOk={() => formAddtest.submit()}
                                    >
                                        <Form form={formAddtest} onFinish={handleAddNewTest}>
                                            <Form.Item name="class" label="L???p" rules={[{ required: true, message: 'Nh???p kh???i, l???p' }]}>
                                                <Select>
                                                    {
                                                        api.classes.map((val) => (
                                                            <Select.Option value={val}>L???p {val}</Select.Option>
                                                        ))
                                                    }
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="time" label="Th???i gian (ph??t)" rules={[{ required: true, message: 'Nh???p th???i gian l??m b??i' }]}>
                                                <Input type="number" />
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
                                        </Form>
                                    </Modal>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <Button type="dashed" onClick={() => setShowaddtest(!showaddtest)}>T???o b??i test</Button>
                                        </div>
                                        <div className="col-sm-9">
                                            <List size="large"
                                                dataSource={testlist}
                                                bordered
                                                renderItem={item => (
                                                    <List.Item
                                                        actions={[<Link to={location.pathname + `/edit/${item._id}`} key="list-loadmore-edit">s???a</Link>, <Button onClick={() => handleDeleteTest(item._id)} key="list-loadmore-more">xo??</Button>]}
                                                    >
                                                        <List.Item.Meta
                                                            title={<b>{item.subject}</b>}
                                                            description={item.createdAt}
                                                        />
                                                    </List.Item>
                                                )}
                                            />

                                        </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(Tests)