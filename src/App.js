import React, { Component } from 'react';
import './App.css';
import app_logo from './app_logo.png';
import music from './autumn_leaves.mp3';
import firebase from './firebase.js';
import $ from 'jquery';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Autosu from './component/input-search';
import { connect } from 'react-redux'
import { updateActivity } from './actions/actionCreator'
import { bindActionCreators } from 'redux'
import background_video from './background.mp4';
import background_video2 from './DJ_Audio.mp4';
import SpotifyPlayer from 'react-spotify-player';


const size = {
    width: '100%',
    height: '50%',
  };
  const view = 'list'; // or 'coverart'
  const theme = 'black'; // or 'white'

class App extends Component {


  constructor() {
    super();
    this.state = {
      //activity: '',
      activity_src: '',
      playlists: [],
      spotify_clicked: false,
      soundcloud_clicked:false,
      NU_clicked: false
    }


    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var temp_url = ''
    for (let p in this.state.playlists) {
      if (this.state.playlists[p].activity.toUpperCase() == this.props.activity.toUpperCase()) {
        //console.log(this.state.playlists[p].activity)
        temp_url = this.state.playlists[p].activity_src;
        //console.log(temp_url);
        break;

      }
    }
    this.setState({
      activity_src: temp_url,
    });
    console.log(this.state.activity_src)
  }


  componentDidMount() {
    const playlistsRef = firebase.database().ref('playlists');
    playlistsRef.on('value', (snapshot) => {
      let playlists = snapshot.val();
      let newState = [];

      for (let p in playlists) {
        newState.push({
          id: p,
          activity: playlists[p].activity,
          activity_src: playlists[p].activity_src
        });
      }

      this.setState({
        playlists: newState,

      });

    });
  }

  handleSpotifyClick() {
    if (this.state.spotify_clicked==false) {
    document.getElementById("spotifydiv").hidden=false;
    this.setState({
      spotify_clicked: true,
    });
  }
    else {
    document.getElementById("spotifydiv").hidden=true;
    this.setState({
      spotify_clicked: false,
    });
  }
  }

   handleSoundcloudClick() {
    if (this.state.soundcloud_clicked==false) {
    document.getElementById("soundclouddiv").hidden=true;
    this.setState({
      soundcloud_clicked: true,
    });
  }
    else {
    document.getElementById("soundclouddiv").hidden=false;
    this.setState({
      soundcloud_clicked: false,
    });
  }
  }

 handleNUClick() {
    if (this.state.NU_clicked==false) {
    document.getElementById("NUdiv").hidden=false;
    this.setState({
      NU_clicked: true,
    });
  }
    else {
    document.getElementById("NUdiv").hidden=true;
    this.setState({
      NU_clicked: false,
    });
  }
  }

  render() {
    var user_requested_activity = "";
    var requested_url = "";
    for (let p in this.state.playlists) {
      if (this.state.playlists[p].activity == 'Cleaning') {
        requested_url = this.state.playlists[p].activity_src;
        break;
      }
    }


    return (
      <div className='App'>
        <div className='searchPart'>
          <video className='videoTag' autoPlay loop muted>
            <source src={background_video2} type='video/mp4' /> </video>
          <section className='add-item'>
            <form id="form" action="#" onSubmit={this.handleSubmit} >
              <div id="prefetch">
                <div style={{
                  paddingTop: 130,
                  paddingLeft: 100,
                  paddingRight: 100
                }}>
                  <Grid
                    container
                    direction="column"
                    justify="left"
                    alignItems="left"

                  >
                    <Typography align='left' color='inherit' component="h2" variant="h1" gutterBottom>
                      DJ Produ
                    </Typography>
                    <Typography align='left' color='inherit' variant="h5" gutterBottom>
                      DJ Produ saves your favorite beats all across platforms. Type your task and you are ready to go!
      </Typography>
                    <div style={{ marginTop: 20 }}>
                      <Autosu />

                    </div>
                  </Grid>
                </div>
              </div>
            </form>
          </section>

           
        </div>

        <div className="RecPart">
          <Grid
            direction="row"
            justify="flex-start"
            alignItems="center"
            style={{ textAlign: "left", padding: 20 }}
            wrap="wrap"
          >
            <img alt="spotifyicon" className="spIcon" src={require('./img/spotify.ico')} onClick={(e) => this.handleSpotifyClick(e)}/>
            <img alt="soundcloudicon" className="platformIcon" src={require('./img/soundcloud.png')} onClick={(e) => this.handleSoundcloudClick(e)} />
            <img alt="youtubeicon" className="platformIcon" src={require('./img/youtube.png')} />
            <img id="NUicon" alt="NUicon" className="platformIcon" src={require('./img/NU.png')} onClick={(e) => this.handleNUClick(e)} />
            

          </Grid>

          <div className="greyContainer">
            <div id="rec" class="w3-third w3-margin-bottom">
              <div class="w3-container w3-white">
                <iframe className="iframe" allow="encrypted-media" id="user_playlist" width="75%" height="400" scrolling="no" frameborder="no" src={this.state.activity_src}></iframe>
              </div>
            </div>

          <div hidden className="spotifydiv" id="spotifydiv">
             <SpotifyPlayer 
            uri="spotify:playlist:37i9dQZEVXbLRQDuF5jeBp"
            size={size}
            view={view}
            theme={theme}
          />
          </div>
          
          <div hidden id="NUdiv">
          <iframe width="100%" height="50%" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/315636479&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
          </div>


          </div>

        </div>
      </div>

    );
  }
}
const mapStateToProps = (state) => {
  return { activity: state.activReducer.activity }
}
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateActivity
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
