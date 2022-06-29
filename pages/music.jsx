import * as React from 'react'
import Sound from '../sound'
 
 

class Music extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        play: false
      }
      this.init_audio = this.init_audio.bind(this);
      this.togglePlay = this.togglePlay.bind(this);
    }
    componentDidMount() {
      //this.audio.addEventListener('ended', () => this.setState({ play: false }));
    }
    
    componentWillUnmount() {
      //this.audio.removeEventListener('ended', () => this.setState({ play: false }));  
    }
  
    togglePlay = () => {
      this.setState({ play: !this.state.play }, () => {
        this.state.play ? this.sound.play( '/sound/1.mp3') : this.sound.play( '/sound/1.mp3') /*this.sound.pause()*/;
      });
    }
  
    init_audio(event){
     // this.audio = new Audio( '/sound/1.mp3');
      this.sound = new Sound();
    }
    render() {
      console.log( process.env.PUBLIC_URL, process.env.NEXT_PUBLIC_PUBLIC_URL)
      return (
        <div>
          <button onClick={this.init_audio}>Init</button>
          <button onClick={this.togglePlay}>{this.state.play ? 'Pause' : 'Play'}</button>
         
        </div>
      );
    }
  }
  
  export default Music;

  
/*
  import { useState, useEffect } from "react";
  const useAudio = url => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
  
    const toggle = () => setPlaying(!playing);
  
    useEffect(() => {
        playing ? audio.play() : audio.pause();
      },
      [playing]
    );
  
    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }, []);
  
    return [playing, toggle];
  };
  
  const Player = ({ url }) => {
    const [playing, toggle] = useAudio(url);
  
    return (
      <div>
        <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
      </div>
    );
  };
  
  export default Player;
  */