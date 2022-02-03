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
                                        title="Bạn chưa xác thực mail. Vui lòng kiểm tra email và nhập mã"
                                        extra={
                                            <Form onFinish={handleConfirmMail}>
                                                <Form.Item label="Nhập mã xác thực" name="mailToken" rules={[{ required: true, message: 'Nhập tên nhóm' }]}>
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Space>
                                                        <Button type="primary" htmlType="submit">Xác thực</Button>
                                                        <Button onClick={handleLogout}>Đăng xuất</Button>
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