import React, { Component } from 'react';
import firebase from 'firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';
import Message from './Message';

export class Messages extends Component {
    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messagesRef: firebase.database().ref('messages'),
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        messages: [],
        messagesLoading: true,
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
    }

    componentDidMount() {
        const { user, channel } = this.state;
        if(user && channel){
            this.addListener(channel.id);
        }
    }

    addListener = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        const loadedMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false,
            });

            this.countUniqueUsers(loadedMessages);
        });
    };

    getMessagesRef = () => {
        const { messagesRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messagesRef;
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true,
        },
        () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex) ) || ( message.user.name.match(regex))) {
                acc.push(message);
            }

            return acc;
        },[]);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        },[]);
        const plural = uniqueUsers.length > 1 ? `${uniqueUsers.length} users` : `${uniqueUsers.length} user`
        const numUniqueUsers = plural;
        this.setState({ numUniqueUsers });
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
             />
        ))
    )

    displayChannelName = channel => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
    }

    render() {
        // prettier-ignore
        const { messagesRef, user, channel, messages, numUniqueUsers, searchTerm,
             searchResults, searchLoading, privateChannel } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={this.displayChannelName(channel)}
                    numUniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    privateChannel={privateChannel} 
                />

                <Segment>
                    <Comment.Group className="messages">
                        { searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    messagesRef={messagesRef}
                    currentUser={user}
                    currentChannel={channel}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                 />
            </React.Fragment>
        )
    }
}

export default Messages
