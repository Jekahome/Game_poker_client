'use strict';

import {
    SMALL_BUTTON,
    BIG_BUTTON
} from './const'

export default class Site {
    style = {};
    #button = null;
    constructor(style = {}) {
        this.style = style;
    }
    get style() {
        return this.style;
    }
    set_sb() {
        this.#button = SMALL_BUTTON;
    }
    set_bb() {
        this.#button = BIG_BUTTON;
    }
    reset_button() {
        this.#button = null;
    }
    get_button() {
      return this.#button;  
    }
}