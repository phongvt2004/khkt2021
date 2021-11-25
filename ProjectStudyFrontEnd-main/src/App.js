import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { connect } from 'react-redux';
import BaseRouter from './route';
import 'antd/dist/antd.css';
import * as actions from './store/actions/auth';
import BlankLayout from './layout/blanklayout';
import MainLayout from './layout/mainlayout';
import TestLayout from './layout/testlayout';
import { AppWrapper } from './state';


class App extends Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
    }

    render() {
        return (
            <AppWrapper>
                <Router>
                    <Switch>
                        <Route exact path="/group-test/:testid/:groupid" render={() => (
                            <TestLayout {...this.props}>
                                <BaseRouter />
                            </TestLayout>
                        )} />
                        <Route exact path="/system-test" render={() => (
                            <TestLayout {...this.props}>
                                <BaseRouter />
                            </TestLayout>
                        )} />
                        <Route exact path="/signin" render={() => (
                            <BlankLayout {...this.props}>
                                <BaseRouter />
                            </BlankLayout>
                        )} />
                        <Route exact path="/signup" render={() => (
                            <BlankLayout {...this.props}>
                                <BaseRouter />
                            </BlankLayout>
                        )} />
                        <Route path="*" render={() => (
                            <MainLayout {...this.props}>
                                <BaseRouter />
                            </MainLayout>
                        )} />
                    </Switch>
                </Router>
            </AppWrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        isAuthenticated: state.token !== null,
        loading: state.loading,
        error: state.error,
        change: state.change,
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

export default connect(mapStateToProps, mapDispatchToProps)(App);