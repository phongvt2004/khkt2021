import { Spin } from 'antd'
import React, { useState } from 'react'
import HeaderBar from '../components/headerbar'
import LeftPanel from '../components/leftpanel'
import RightPanel from '../components/rightpanel'
import SignIn from '../containers/signin'

// import { useAppContext } from '../state'
// import * as api from '../api';
// import axios from 'axios'

const TestLayout = (props) => {

    const [toggleleftmn, setToggleletmn] = useState(false)
    
    return (
        <div className="signin horizontal-menu" >
            <section className={toggleleftmn ? "leftpanel-collapsed" : "leftpanel-show"}>
                {
                    props.loading?
                    <Spin size="large" />
                    :
                    props.isAuthenticated ?
                    <React.Fragment>
                        <LeftPanel username="Bao dep trai" colapsed={toggleleftmn} />
                        <div className="mainpanel">
                            {/* <HeaderBar colapseleftmn={toggleleftmn} oncolapseleftmn={setToggleletmn} /> */}
                            {props.children}
                        </div>

                        <RightPanel />
                    </React.Fragment>
                    :
                    <SignIn />
                }

            </section>
        </div>
    )
}

export default TestLayout