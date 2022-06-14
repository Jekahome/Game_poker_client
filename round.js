'use strict';


export default class Round{
    #round;
    #current_index=0;
    constructor(){
        this.#round = Array.of(0,1,2,3,4); 
    }
    
    next(){
        let round = this.#round[this.#current_index];
        this.#current_index++;
        if (this.#current_index>=4){
            this.#current_index=0;
        }
        return this;
    }
    current(){
        return this.#round[this.#current_index];
    }
    
}