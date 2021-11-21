import { Spin } from 'antd'
import React from 'react'


const BlankLayout = (props) => {



    return (
        <div className="signin">
            <section>
                {
                    props.loading?
                    <Spin size="large" />
                    :
                    props.children
                }
            </section>
        </div>
    )
}


export default BlankLayout