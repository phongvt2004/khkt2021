import { Spin, Result, Button, Form, Input, Space } from 'antd'
import React, { useState } from 'react'
import HeaderBar from '../components/headerbar'
import LeftPanel from '../components/leftpanel'
import RightPanel from '../components/rightpanel'
import SignIn from '../containers/signin'
import * as api from '../api'
import axios from 'axios'
import { useHistory } from 'react-router'

// import { useAppContext } from '../state'
// import * as api from '../api';
// import axios from 'axios'

const MainLayout = (props) => {

    const [toggleleftmn, setToggleletmn] = useState(false)
    const histor = useHistory ()
    
    const handleLogout = () => {
        props.logout()
    }

    const handleConfirmMail = (e) => {
        axios.get(api.api_mail_confirm, {
            params : {
                username: props.username,
                token: props.token,
                ...e,
            }
        })
        .then(res => res.data)
        .then(res => {
            console.log(res)
            histor.go(0)
        })
        .catch(console.log)
    }

    return (
        <div className="signin" >
            <section className={toggleleftmn ? "leftpanel-collapsed" : "leftpanel-show"}>
                {
                    props.loading ?
                        <Spin size="large" />
                        :
                        props.isAuthenticated ?
                            props.info?.isConfirmMail ?
                                <React.Fragment>
                                    <LeftPanel username="Bao dep trai" colapsed={toggleleftmn} />
                                    <div className="mainpanel">
                                        <HeaderBar colapseleftmn={toggleleftmn} oncolapseleftmn={setToggleletmn} />
                                        {props.children}
                                    </div>

                                    <RightPanel />
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Result
                                        status="warning"
                                        title="B???n ch??a x??c th???c mail. Vui l??ng ki???m tra email v?? nh???p m??"
                                        extra={
                                            <Form onFinish={handleConfirmMail}>
                                                <Form.Item label="Nh???p m?? x??c th???c" name="mailToken" rules={[{ required: true, message: 'Nh???p t??n nh??m' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Space>
                                                        <Button type="primary" htmlType="submit">X??c th???c</Button>
                                                        <Button onClick={handleLogout}>????ng xu???t</Button>
                                                    </Space>
                                                </Form.Item>
                                            </Form>
                                        }
                                    />
                                </React.Fragment>
                            :
                            <SignIn />
                }

            </section>
        </div>
    )
}

export default MainLayout