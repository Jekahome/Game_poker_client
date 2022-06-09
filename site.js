'use strict';


export default class Site{
    style = {};
  
    constructor(style={}){
        this.style = style; 
    }
    
    get style(){
        return this.style;
    }
}