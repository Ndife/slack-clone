import React, { Component } from "react";
import firebase from "firebase";
import { Dropdown, Grid, Header, Icon, Image } from "semantic-ui-react";

export class UserPanel extends Component {

    state = {
        user: this.props.currentUser
    };

    componentWillReceiveProps(nextProps) {
        this.setState({ user: nextProps.currentUser})
    }

    handleSignout = () => { 
        firebase
        .auth()
        .signOut()
        .then(() => console.log("signed Out!"));
    }

    dropdownOptions = () => [
        {
            key: 'User',
            text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true,
        },
        {
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            key: "signout",
            text: <span onClick={this.handleSignout}>Sign Out</span>
        }
    ];
    

    render() {
        const { user } = this.state;
        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{padding: "1.2em", margin:0}}>
                        {/* App Header  */}
                        <Header inverted as="h2">
                            <Icon name="code" />
                            <Header.Content>UcChat</Header.Content>
                        </Header>
                    </Grid.Row>

                    <Header inverted as="h4" style={{ padding:"0.25em"}}>
                        <Dropdown
                            trigger={
                                <span>
                                    <Image src={user.photoURL} placed="right" avatar/>
                                    {user.displayName}</span>
                            }
                            options={this.dropdownOptions()} 
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}


export default UserPanel;