'use strict';

const CARD_DEALT = 0;
const ROUND_PREFLOP = 1;
const ROUND_FLOP = 2;
const ROUND_TERN = 3;
const ROUND_RIVER = 4;
const ROUND_WIN = 5;

export default class Round{
    #round;
    #current_index=0;
    constructor(){
        this.#round = Array.of(CARD_DEALT,ROUND_PREFLOP,ROUND_FLOP,ROUND_TERN,ROUND_RIVER,ROUND_WIN); 
    }
    next(){
        let round = this.#round[this.#current_index];
        this.#current_index++;
        if (this.#current_index>=6){
            this.#current_index=0;
        }
        return this;
    }
    current(){
        return this.#round[this.#current_index];
    }
    
}