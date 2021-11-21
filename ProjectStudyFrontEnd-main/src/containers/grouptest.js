import { Spin, List, Button, Modal, message, Form, Radio, Select, Typography, Checkbox } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'

const GroupTest = (props) => {

    const location = useLocation()
    const [testlist, setTestlist] = useState([])
    const [answer, setAnswer] = useState([])
    const [index, setIndex] = useState(0)
    const [value, setValue] = useState('');

    const [result, setResult] = useState({ userChoice: "", answer: "" })


    useEffect(() => {
        handleDoTest("6194c83fbaa26ae73d1de91b") // props.match.params.testid
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
                console.log(res)
                setTestlist(res)
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

    const handleSetAnswer = (qid, ans) => {
        const clone_ans = answer
        clone_ans[qid] = ans
        setAnswer(clone_ans)
        setValue(ans)
        console.log(value)
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

    return (
        <React.Fragment>
            {
                props.loading ?
                    <Spin size='large' />
                    :
                    props.isAuthenticated ?
                        <React.Fragment>
                            <PageHeader icon="fa-user" page="Làm test" />
                            <div className="contentpanel">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <Typography.Title level={2}>
                                            {
                                                testlist[index]?.question
                                            }
                                        </Typography.Title>
                                    </div>
                                    <div class="modal-body">
                                        <Radio.Group onChange={(e) => handleSetAnswer(testlist[index]?._id, e.target.value)} defaultValue={value} value={answer[testlist[index]?._id]}>
                                            <Radio checked={answer[testlist[index]?._id] === "A"} value="A">A. {testlist[index]?.A}</Radio>
                                            <Radio checked={answer[testlist[index]?._id] === "B"} value="B">B. {testlist[index]?.B}</Radio>
                                            <Radio checked={answer[testlist[index]?._id] === "C"} value="C">C. {testlist[index]?.C}</Radio>
                                            <Radio checked={answer[testlist[index]?._id] === "D"} value="D">D. {testlist[index]?.D}</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>
                                <Button type="primary" shape="round" onClick={() => increaseIndex(index)} size="large">
                                    Câu kế tiếp
                                </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupTest)