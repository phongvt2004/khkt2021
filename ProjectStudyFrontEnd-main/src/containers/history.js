import { Spin, Button, Result, Radio, Typography, Row, Col, Popconfirm, Image, Form, Select, List } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { Link, useLocation } from 'react-router-dom'
import Latext from 'react-latex';

const HistoryTest = (props) => {

    const location = useLocation()
    const [isLoad, setIsLoad] = useState(false)
    const [subject, setSubject] = useState("")
    const [hisResult, setHisResult] = useState([])
    const [currentIDHis, setCurrentIDHis] = useState("")
    const [tempTest, setTempTest] = useState([])
    const [hisTest, setHisTest] = useState([])

    useEffect(() => {
        // setSubject(api.list_sub[0])
    }, [])

    useEffect(() => {
        handleGetHistoryTestBySubbject(subject)
    }, [subject])

    const handleGetHistoryTestBySubbject = (sub) => {
        setIsLoad(true)
        setCurrentIDHis("")
        setTempTest([])
        setHisTest([])
        axios.get(api.api_history_result, {
            params: {
                username: props.username,
                token: props.token,
                subject: sub,
            }
        }).then(res => res.data)
            .then(res => {
                console.log("get result: ", res)
                setHisResult(res)
                setIsLoad(false)
            })
            .catch(console.log)
    }

    useEffect(() => {
        if (currentIDHis !== "") handleGetHistoryTestByID(currentIDHis)
    }, [currentIDHis])

    const handleGetHistoryTestByID = (id) => {
        setIsLoad(true)
        setTempTest([])
        axios.get(api.api_history_test, {
            params: {
                username: props.username,
                token: props.token,
                historyId: id,
            }
        }).then(res => res.data)
            .then(res => {
                setTempTest(res.test)
                setIsLoad(false)
            })
            .catch(console.log)
    }

    useEffect(() => {
        if (tempTest.length > 0) {
            handleGetDetailByTempTest()
        }
    }, [tempTest])

    const handleGetDetailByTempTest = () => {
        setHisTest([])
        tempTest.map(val => {
            axios.get(api.api_question_detail, {
                params: {
                    questionId: val.questionId
                }
            }).then(res => res.data)
                .then(res => {
                    setHisTest(
                        old => [...old, {
                            ...res,
                            answer: val.answer
                        }])
                })
                .catch(console.log)
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
                            <PageHeader icon="fa-user" page="Lịch sử làm bài" />
                            <div className="contentpanel">

                                <div className="row">
                                    <div className="col-sm-3">
                                        {
                                            api.list_sub.map((val, index) => (
                                                <Button type="dashed" style={{ width: "100%" }} key={`sub1-${index}`} onClick={() => setSubject(val)} >{val}</Button>
                                            ))
                                        }
                                    </div>
                                    <div className="col-sm-9">
                                        <Spin spinning={isLoad}>
                                            <ul className="nav nav-tabs nav-justified nav-profile">
                                                <li className="active">
                                                    <a><strong>Lịch sử làm bài môn: {subject}</strong></a>
                                                </li>
                                            </ul>

                                            <div className="tab-content">
                                                <div className="tab-pane active" id="activities">
                                                    <div className="activity-list">
                                                        {
                                                            currentIDHis === "" ?
                                                                <List
                                                                    bordered
                                                                    dataSource={hisResult}
                                                                    renderItem={item => (
                                                                        <List.Item key={item}>
                                                                            <List.Item.Meta
                                                                                title={<a>{item.subject}</a>}
                                                                                description={<b>Điểm: {item.point}</b>}
                                                                            />
                                                                            <Button onClick={() => setCurrentIDHis(item._id)} >Xem bài</Button>
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                                :
                                                                <List
                                                                    bordered
                                                                    dataSource={hisTest}
                                                                    pagination={{
                                                                        pageSize: 5,
                                                                    }}
                                                                    renderItem={item => (
                                                                        <List.Item key={item}
                                                                            extra={
                                                                                <Image src={item.image[0]} />
                                                                            }
                                                                        >
                                                                            <List.Item.Meta
                                                                                title={<Latext>{`${item.question}`}</Latext>}
                                                                                description={
                                                                                    <Row>
                                                                                        <Col span={12}><b>Đáp án: {item.correct}</b></Col>
                                                                                        <Col span={12}><b>Bạn chọn: {item.answer}</b></Col>
                                                                                        <Col span={12}>A. <Latext>{`${item.A}`}</Latext></Col>
                                                                                        <Col span={12}>B. <Latext>{`${item.B}`}</Latext></Col>
                                                                                        <Col span={12}>C. <Latext>{`${item.C}`}</Latext></Col>
                                                                                        <Col span={12}>D. <Latext>{`${item.D}`}</Latext></Col>
                                                                                    </Row>
                                                                                }
                                                                            />
                                                                        </List.Item>
                                                                    )}
                                                                />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Spin>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryTest)