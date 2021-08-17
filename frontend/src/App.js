import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from './store/actions/auth'
import Layout1 from './layout/LayoutDefault';
import RouteMain from './route/routemain';


class App extends React.Component {

    // moi lan vao site se chay cai nay dau tien
    componentDidMount() {
        this.props.onTryAutoSignIn() // check auth
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="*" render={() => (
                        <Layout1 {...this.props}>
                            <RouteMain />
                        </Layout1>
                    )} />
                </Switch>
            </BrowserRouter>
        )
    }
}

// lay state tu reducer gan' vao props
const mapStateToProps = (state) => {
    return {
        token: state.token,
        isAuth: state.token !== null && state.token !== "",
        loading: state.loading,
        error: state.error
    }
}

// gan' dispatch vao props
const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignIn: () => dispatch(actions.authCheckState())
    }
}

// dung` connect de ket noi
export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default App