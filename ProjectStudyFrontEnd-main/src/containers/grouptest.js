import { Spin, Button, Result, Radio, Typography, Row, Col, Popconfirm, Image } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../state';

const GroupTest = (props) => {

    const location = useLocation()

    const { notisocket } = useAppContext()

    const [socketnoti, setSocketnoti] = notisocket

    const [testlist, setTestlist] = useState([])
    const [answer, setAnswer] = useState([])
    const [index, setIndex] = useState(0)
    const [value, setValue] = useState('');
    const [result, setResult] = useState(-1)


    useEffect(() => {
        handleDoTest(props.match.params.testid) // props.match.params.testid
    }, [])


    // get question list
    const handleDoTest = (id) => {
        axios.get(api.api_group_do_test, {
            params: {
                username: props.username,
                token: props.token,
                testId: id
            }
        }).then(res => res.data)
            .then(res => {
                setTestlist(res)
                const test_data = []
                res.map(val => {
                    test_data.push({
                        questionId: val._id,
                        answer: ""
                    })
                })
                setAnswer(test_data)
            }).catch(console.log)
    }

    const increaseIndex = () => {
        if (index >= testlist.length - 1) {
            setIndex(0)
        } else {
            setIndex(index + 1)
        }
        setValue('')
        console.log(answer)
    }

    const decreaseIndex = () => {
        if (index <= 0) {
            setIndex(0)
        } else {
            setIndex(index - 1)
        }
        setValue('')
    }

    const handleSetAnswer = (qid, ans) => {
        const clone_ans = answer
        for (var i = 0; i < clone_ans.length; i++) {
            if (clone_ans[i].questionId === qid) {
                clone_ans[i].answer = ans
            }
        }
        setValue(ans);
        setAnswer(clone_ans)
    }

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };


    // get Test info
    const handleGetTestInfo = (id) => {
        axios.get(api.api_group_test, {
            params: {
                username: props.username,
                token: props.token,
                testId: id
            }
        })
    }

    // nop bai
    const handleGetResult = () => {

        axios.post(api.api_group_test_result, {
            test: answer,
            testId: props.match.params.testid,
        }).then(res => res.data)
            .then(res => {
                setResult(res)
                const sdata = {
                    username: props.username, 
                    groupId:props.match.params.groupid, 
                    point: res, 
                    testId: props.match.params.testid, 
                    createAt: new Date().toString(),
                }
                // console.log(sdata)
                socketnoti?.emit('done test', sdata)
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
                        result < 0 ?
                            <React.Fragment>
                                <PageHeader icon="fa-user" page="Làm test" />
                                <div className="contentpanel">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <Typography.Title level={3}>
                                                {
                                                    testlist[index]?.question
                                                }
                                            </Typography.Title>
                                            {
                                                testlist[index]?.image !== "" ?
                                                    <Image src={testlist[index]?.image} height="400px" />
                                                    :
                                                    ""
                                            }
                                        </div>
                                        <div class="modal-body">
                                            <Radio.Group onChange={(e) => handleSetAnswer(testlist[index]?._id, e.target.value)} defaultValue={value} value={answer.find(x => x.questionId === testlist[index]?._id)?.answer}>
                                                <Row>
                                                    <Col span={12}><Radio checked={answer.find(x => x.questionId === testlist[index]?._id)?.answer === "A"} value="A">A. {testlist[index]?.A}</Radio></Col>
                                                    <Col span={12}><Radio checked={answer.find(x => x.questionId === testlist[index]?._id)?.answer === "B"} value="B">B. {testlist[index]?.B}</Radio></Col>
                                                    <Col span={12}><Radio checked={answer.find(x => x.questionId === testlist[index]?._id)?.answer === "C"} value="C">C. {testlist[index]?.C}</Radio></Col>
                                                    <Col span={12}><Radio checked={answer.find(x => x.questionId === testlist[index]?._id)?.answer === "D"} value="D">D. {testlist[index]?.D}</Radio></Col>
                                                </Row>

                                            </Radio.Group>
                                        </div>
                                    </div>
                                    <Row style={{ marginTop: "50px" }}>
                                        <Col span={8} style={{ textAlign: "center" }}>
                                            <Button type="primary" shape="round" onClick={() => decreaseIndex(index)} size="large">
                                                Câu kế trước
                                            </Button>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "center" }}>
                                            <Popconfirm
                                                title="Bạn có muốn nộp bài ?"
                                                onConfirm={handleGetResult}
                                            >
                                                <Button type="primary" shape="round" size="large">
                                                    Nộp bài
                                                </Button>
                                            </Popconfirm>
                                        </Col>
                                        <Col span={8} style={{ textAlign: "center" }}>
                                            <Button type="primary" shape="round" onClick={() => increaseIndex(index)} size="large">
                                                Câu kế tiếp
                                            </Button>
                                        </Col>
                                    </Row>

                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Result
                                    status="success"
                                    title="Hoàn thành bài kiểm tra"
                                    subTitle={`Bạn đã hoàn thành bài kiểm tra với: ${result} điểm.`}
                                    extra={[
                                        <Link to="/">
                                            <Button type="primary" key="console">
                                                Về Trang chủ
                                            </Button>
                                        </Link>,
                                    ]}
                                />
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupTest)