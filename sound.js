export default class Sound{
    
    constructor(style={}){
        this.audio = {}; 
        this.is_init=false;
    }
    init(){
        if(!this.is_init){
            this.audio = new Audio();
        
            this.audio.volume = 1;
            this.audio.loop = false;
            this.audio.controls = false;
            this.audio.autoplay = false;
            //this.audio.currentTime = 1;   
            //this.audio.playbackRate=1;
            this.is_init=true;         
        }
    }
    play(name,currentTime=0,playbackRate=1,volume=1){
        this.init();
        //this.audio.duration 
        if(this.audio.paused || this.audio.ended){
            this.audio.src = name;  
            this.audio.currentTime=currentTime;
            this.audio.playbackRate=playbackRate;
            this.audio.volume=volume;
            this.audio.play();
        }  
    }
    pause(){
        this.audio.pause();
    }
    load(){
        this.init();
        this.audio.load();
    }
}