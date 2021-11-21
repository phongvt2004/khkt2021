import React from 'react'
import { useAppContext } from '../state'

const RightPanel = (props) => {

    return (
        <div className="rightpanel">
            <ul className="nav nav-tabs nav-justified">
                <li className="active"><a href="#rp-alluser" data-toggle="tab"><i className="fa fa-users"></i></a></li>
                <li><a href="#rp-favorites" data-toggle="tab"><i className="fa fa-heart"></i></a></li>
                <li><a href="#rp-history" data-toggle="tab"><i className="fa fa-clock-o"></i></a></li>
                <li><a href="#rp-settings" data-toggle="tab"><i className="fa fa-gear"></i></a></li>
            </ul>

            <div className="tab-content">
                <div className="tab-pane active" id="rp-alluser">
                    <h5 className="sidebartitle">Online Users</h5>
                    <ul className="chatuserlist">
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/userprofile.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Eileen Sideways</strong>
                                    <small>Los Angeles, CA</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user1.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <span className="pull-right badge badge-danger">2</span>
                                    <strong>Zaham Sindilmaca</strong>
                                    <small>San Francisco, CA</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user2.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Nusja Nawancali</strong>
                                    <small>Bangkok, Thailand</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user3.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Renov Leongal</strong>
                                    <small>Cebu City, Philippines</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user4.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Weno Carasbong</strong>
                                    <small>Tokyo, Japan</small>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div className="mb30"></div>

                    <h5 className="sidebartitle">Offline Users</h5>
                    <ul className="chatuserlist">
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user5.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Eileen Sideways</strong>
                                    <small>Los Angeles, CA</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user2.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Zaham Sindilmaca</strong>
                                    <small>San Francisco, CA</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user3.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Nusja Nawancali</strong>
                                    <small>Bangkok, Thailand</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user4.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Renov Leongal</strong>
                                    <small>Cebu City, Philippines</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user5.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Weno Carasbong</strong>
                                    <small>Tokyo, Japan</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user4.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Renov Leongal</strong>
                                    <small>Cebu City, Philippines</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user5.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Weno Carasbong</strong>
                                    <small>Tokyo, Japan</small>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane" id="rp-favorites">
                    <h5 className="sidebartitle">Favorites</h5>
                    <ul className="chatuserlist">
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user2.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Eileen Sideways</strong>
                                    <small>Los Angeles, CA</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user1.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Zaham Sindilmaca</strong>
                                    <small>San Francisco, CA</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user3.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Nusja Nawancali</strong>
                                    <small>Bangkok, Thailand</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user4.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Renov Leongal</strong>
                                    <small>Cebu City, Philippines</small>
                                </div>
                            </div>
                        </li>
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user5.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Weno Carasbong</strong>
                                    <small>Tokyo, Japan</small>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane" id="rp-history">
                    <h5 className="sidebartitle">History</h5>
                    <ul className="chatuserlist">
                        <li className="online">
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user4.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Eileen Sideways</strong>
                                    <small>Hi hello, ctc?... would you mind if I go to your...</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user2.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Zaham Sindilmaca</strong>
                                    <small>This is to inform you that your product that we...</small>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="media">
                                <a href="#" className="pull-left media-thumb">
                                    <img alt="" src="images/photos/user3.png" className="media-object" />
                                </a>
                                <div className="media-body">
                                    <strong>Nusja Nawancali</strong>
                                    <small>Are you willing to have a long term relat...</small>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="tab-pane pane-settings" id="rp-settings">

                    <h5 className="sidebartitle mb20">Settings</h5>
                    <div className="form-group">
                        <label className="col-xs-8 control-label">Show Offline Users</label>
                        <div className="col-xs-4 control-label">
                            <div className="toggle toggle-success"></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-8 control-label">Enable History</label>
                        <div className="col-xs-4 control-label">
                            <div className="toggle toggle-success"></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-8 control-label">Show Full Name</label>
                        <div className="col-xs-4 control-label">
                            <div className="toggle-chat1 toggle-success"></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-8 control-label">Show Location</label>
                        <div className="col-xs-4 control-label">
                            <div className="toggle toggle-success"></div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default RightPanel