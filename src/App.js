import React from 'react'
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import './App.css';

import ColorPanel from './components/ColorPanel/ColorPanel';
import Messages from './components/Messages/Messages';
import MetaPanel from './components/MetaPanel/MetaPanel';
import SidePanel from './components/SidePanel/SidePanel';

function App({ currentUser, currentChannel, isPrivateChannel }) {
  return (
    <div>
      <Grid columns="equal" className="app" style={{background: "#eee"}}>
        <ColorPanel />
        <SidePanel
          key={currentUser && currentUser.id} 
          currentUser={currentUser} 
        />
        
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            currentUser={currentUser}
            isPrivateChannel={isPrivateChannel}
           />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(App);
