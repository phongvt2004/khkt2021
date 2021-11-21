import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site_name } from '../api'

import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
import { useAppContext } from '../state';

const LeftPanel = (props) => {
    const [navcurrent, setNavcurrent] = useState("")
    const location = useLocation()

    const handleLogout = () => {
        props.logout()
    }

    const { igroups, wgroups } = useAppContext()

    const [ingroups, setIngroups] = igroups
    
    // useEffect(() => {
    //     console.log(location)
    // },[])

    return (
        <div className="leftpanel">
            <div className="logopanel">
                <h1><span>[</span> <Link to="/">{site_name}</Link> <span>]</span></h1>
            </div>

            <div className="leftpanelinner">


                <div className="visible-xs hidden-sm hidden-md hidden-lg">
                    <div className="media userlogged">
                        <img alt="" src={`${process.env.PUBLIC_URL}/static/images/photos/loggeduser.png`} className="media-object" />
                        <div className="media-body">
                            <h4>{props.username ? props.username : "Loading ..."}</h4>
                        </div>
                    </div>

                    <h5 className="sidebartitle actitle">Account</h5>
                    <ul className="nav nav-pills nav-stacked nav-bracket mb30">
                        <li><Link to="/profile"><i className="glyphicon glyphicon-user"></i> Thông tin tài khoản</Link></li>
                        <li><Link to="/settings"><i className="glyphicon glyphicon-cog"></i> Cài đặt</Link></li>
                        <li><Link to="/FAQ"><i className="glyphicon glyphicon-question-sign"></i> FAQ</Link></li>
                        <li><a onClick={handleLogout}><i className="glyphicon glyphicon-log-out"></i> Đăng xuất</a></li>
                    </ul>
                </div>

                <h5 className="sidebartitle">Menu</h5>
                <ul className="nav nav-pills nav-stacked nav-bracket">
                    <li className={ location.pathname === "/" ? "active" : ""}>
                        <Link to="/">
                            <i className="fa fa-home"></i> <span>Trang chủ</span>
                        </Link>
                    </li>

                    {/* <li className={ location.pathname === "/chat" ? "active" : ""}>
                        <Link to="/chat">
                            <i className="fa fa-envelope-o"></i> <span>Tìm nhóm</span>
                        </Link>
                    </li> */}
                    
                    <li className={navcurrent === "sample" ? "nav-parent nav-hover" : "nav-parent nav-active"}>
                        <a onClick={() => navcurrent === "sample" ? setNavcurrent("") : setNavcurrent("sample") }>
                            <i className="fa fa-laptop"></i> <span>Danh sách nhóm</span>
                        </a>
                        <ul className="children" style={{ display: navcurrent === "sample" ? "block" : "none"}}>
                            {
                                ingroups.map((data,index) => (
                                    <li className={ location.pathname === `/chat/${data._id}` ? "active" : ""}><Link to={`/chat/${data._id}`}><i className="fa fa-caret-right"></i> {data.name}</Link></li>
                                ))
                            }
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token,
        isAuthenticated: state.token !== null,
        loading: state.loading,
        error: state.error,
        change: state.change,
        username: state.username
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout()),
        updateChange: () => dispatch(actions.updateChange()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel)