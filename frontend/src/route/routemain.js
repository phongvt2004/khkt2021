import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from '../containers/login';


const RouteMain = () => {
    return (
        <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/test" render={() => (
                <h1>Bao deptrai</h1>
            )} />
        </Switch>
    )
}

export default RouteMain;