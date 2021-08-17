import React from 'react';


const LoginForm = () => {
    return (
        <React.Fragment>
            <form>
                <input type="text" value="username" />
                <input type="password" value="password" />
                <input type="submit" value="Login" />
            </form>
        </React.Fragment>
    )
}

export default LoginForm