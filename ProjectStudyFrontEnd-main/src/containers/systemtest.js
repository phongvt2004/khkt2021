import { Spin, List, Button, Modal, message, Form, Radio, Select, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import * as api from '../api';
import * as actions from '../store/actions/auth';
import PageHeader from '../components/pageheader'
import { useAppContext } from '../state';
import { Link, useLocation } from 'react-router-dom'

const SystemTest = (props) => {

    const location = useLocation()

    useEffect(() => {
    }, [])

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
                                    
                                    <div className="row">
                                        

                                        <div className="col-sm-3">
                                            <button className="btn btn-primary">Câu 1</button>
                                        </div>
                                        <div className="col-sm-9">
                                            <Input placeholder="trả lời" />

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

export default connect(mapStateToProps, mapDispatchToProps)(SystemTest)