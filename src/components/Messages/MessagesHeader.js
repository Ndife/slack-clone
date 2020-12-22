import React, { Component } from 'react';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';

export class MessagesHeader extends Component {
    render() {
        // prettier-ignore
        const { channelName, numUniqueUsers, handleSearchChange, searchLoading, privateChannel } = this.props;

        return (
            <Segment clearing>
                {/* Channel Title */}
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {!privateChannel &&<Icon name={"star outline"} color="black" />}
                    </span>
                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm" 
                        placeholder="Search Messages"
                        onChange={handleSearchChange}
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader
