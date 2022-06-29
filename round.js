'use strict';

import {
    CARD_DEALT,
    ROUND_PREFLOP,
    ROUND_FLOP,
    ROUND_TERN,
    ROUND_RIVER,
    ROUND_WIN
} from './const'

export default class Round {
    #round;
    #current_index = 0;
    constructor() {
        this.#round = Array.of(CARD_DEALT, ROUND_PREFLOP, ROUND_FLOP, ROUND_TERN, ROUND_RIVER, ROUND_WIN);
    }
    next() {
        let round = this.#round[this.#current_index];
        this.#current_index++;
        if (this.#current_index >= 6) {
            this.#current_index = 0;
        }
        return this;
    }
    current() {
        return this.#round[this.#current_index];
    }
}