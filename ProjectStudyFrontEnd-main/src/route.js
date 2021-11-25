import React from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "./containers/signin";
import SignUp from "./containers/signup";
import DashBoard from "./containers/dashboard";
import Profile from "./containers/profile";
import Chat from "./containers/chat";
import ChatTest from "./containers/chat-test";
import Tests from "./containers/tests";
import EditTest from "./containers/edittest";
import GroupTest from "./containers/grouptest"
import SystemTest from "./containers/systemtest"
import AddSysQuest from "./containers/addsysquest"


const BaseRouter = () => (
    <Switch>
        <Route exact path="/" component={DashBoard} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/chat" component={Chat} />
        <Route exact path="/chat/:groupid" component={Chat} />
        <Route exact path="/chat-test/:groupid" component={ChatTest} />
        <Route exact path="/add-sys-quest" component={AddSysQuest} />
        <Route exact path="/chat/:groupid/tests" component={Tests} />
        <Route exact path="/chat/:groupid/tests/edit/:testid" component={EditTest} />
        <Route exact path="/system-test" component={SystemTest} />
        <Route exact path="/group-test/:testid/:groupid" component={GroupTest} />
        <Route exact path="/system-test" component={SystemTest} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
    </Switch>
);

export default BaseRouter;