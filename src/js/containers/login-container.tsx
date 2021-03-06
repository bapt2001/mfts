import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { LoginLayout } from '@src/components/layout/login-layout';
import LoginForm from '@src/components/login-form';

type LoginContainerProps = {} & RouteComponentProps<{}>;
type LoginContainerState = {};

class LoginContainer extends Component<LoginContainerProps, LoginContainerState> {
    constructor(props: LoginContainerProps) {
        super(props);
    }

    render() {
        return (
            <LoginLayout>
                <LoginForm match={this.props.match} history={this.props.history} />
            </LoginLayout>
        );
    }
}

export default withRouter(LoginContainer);
