'use strict';

export default class Site {
    style = {};
    #button_sb = null;
    #button_bb = null;
    constructor(style = {}) {
        this.style = style;
    }

    get style() {
        return this.style;
    }
    set_sb(sb = 0) {
        this.#button_sb = sb;
        this.#button_bb = null;
    }
    set_bb(bb = 1) {
        this.#button_bb = bb;
        this.#button_sb = null;
    }
    reset_button() {
        this.#button_bb = null;
        this.#button_sb = null;
    }
    get_button() {
        if (this.#button_sb != null) {
            return this.#button_sb;
        } else if (this.#button_bb != null) {
            return this.#button_bb;
        }
        return null;
    }
}