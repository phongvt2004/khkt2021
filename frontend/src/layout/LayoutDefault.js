import React, { useEffect } from 'react'


const Layout1 = (props) => {

    // useEffect(() => {
    //     console.log(props.isAuth)
    // },[])

    return (
        <React.Fragment>
            <div style={{
                height: '70px',
                color: 'red'
            }}>
                Header
            </div>
            <div class="container">
                {props.children}
            </div>
            <div style={{
                height: '70px',
                color: 'black'
            }}>
                Footer
            </div>
        </React.Fragment>
    )
}

export default Layout1