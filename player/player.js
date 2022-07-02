import {
    CALL,
    BET,
    RAISE,
    FOLD,
    ALL_IN,
    CHECK,
    YOUR_ID,
    BIG_BUTTON
} from '../const'

export default class Player {
    #_id;
    #_name;
    #_card1;
    #_card2;
    #_site = {};
    #_money = 0;
    #_activ = false;
    #_total_bet = 0;
    #_show_action;
    constructor(id, name, money, site) {
        this.#_id = id;
        this.#_name = name;
        this.#_card1 = null;
        this.#_card2 = null;
        this.#_site = site;
        this.#_money = money;
        this.#_total_bet = 0;
        this.#_show_action = null;
        this.s=false;
    }
    get id() {
        return this.#_id;
    }
    get name() {
        return this.#_name;
    }
    get site() {
        return this.#_site;
    }
    is_activ() {
        return this.#_activ;
    }
    set_activ(value) {
        this.#_activ = value;
    }
    get action() {
        return this.#_show_action;
    }
    set action(action) {
        this.#_show_action = action;
    }

    choice(obj_action){
        switch (obj_action.choice) {
            case 0: {
                // когда можо CHECK
                if((this.get_total_bet()==obj_action.max_bet && !obj_action.is_first_bet) ||
                (obj_action.is_first_bet && this.site.get_button()==BIG_BUTTON)
                ){return true;}

                // когда можо CALL
                if(obj_action.is_first_bet==true && 
                    (this.money >= obj_action.max_bet-this.get_total_bet())){return true;}
            } 
            break;
            case 1: {

                // когда можо RAISE 
                if(obj_action.is_first_bet && 
                    this.money > (obj_action.max_bet-this.get_total_bet())+obj_action.max_bet){return true;}
            }
            break;
            break;
            case 2: {

                // когда можо ALL-IN
                if(obj_action.is_first_bet){return true;}
            }
            break;
            break;
            case 3: {
                // когда можно FOLD
                return true;
            }
            break;
            break;
            case 4: {
                // когда можо BET 
                if(obj_action.is_first_bet==false && this.money > obj_action.cost_bb){return true;}
            }
            break;
            default:
                return false;
        }
    }

    player_action(obj_action) {
        // TODO: Replace stupid logic
        // TODO: Add logic correctness of action(когда все all-in то игрок ждет win)
        // TODO: Сюда может попасть YOUR_ID когда не осталось активных игроков(ALL-IN,FOLD)

        let max_bet = obj_action.max_bet;
        let is_first_bet = obj_action.is_first_bet;// была ли уже первая ставка
        let cost_bb = obj_action.cost_bb;

        obj_action.choice =  Math.round(Math.random() *4);
        while(!this.choice(obj_action)){
             obj_action.choice =  Math.round(Math.random() *4);
        }
        let choice = obj_action.choice;
 choice=0;
        if(YOUR_ID == this.id){
            console.warn('unimplemented');
            choice = 0;
        }
        switch (choice) {
            case 0: {
                // for CALL / CHECK
                if (this.get_total_bet() == max_bet) {
                    this.action = CHECK;
                    return {
                        action: this.action,
                        bet: this.get_total_bet()
                    };
                } else if (this.money > max_bet - this.get_total_bet()) {
                    this.turn_down_money(max_bet - this.get_total_bet());
                    this.action = CALL;
                    return {
                        action: this.action,
                        bet: this.get_total_bet()
                    };
                } else if (this.money <= max_bet - this.get_total_bet()) {
                    this.turn_down_money(max_bet - this.get_total_bet());
                    this.action = ALL_IN;
                    return {
                        action: this.action,
                        bet: this.get_total_bet()
                    };
                }
            }
            break;
            case 1: {
                // for RAISE x2
                if (this.money > (max_bet - this.get_total_bet()) + max_bet) {
                    this.turn_down_money(max_bet * 2 - this.get_total_bet());
                    this.action = RAISE;
                    return {
                        action: this.action,
                        bet: this.get_total_bet()
                    };
                } else if (this.money <= (max_bet * 2 - this.get_total_bet())) {
                    this.turn_down_money(this.money);
                    this.action = ALL_IN;
                    return {
                        action: this.action,
                        bet: this.get_total_bet()
                    };
                }
            }
            break;
            case 2: {
                // for ALL_IN
                this.turn_down_money(this.money);
                this.action = ALL_IN;
                return {
                    action: this.action,
                    bet: this.get_total_bet()
                };
            }
            break;
            case 3: {
                // for FOLD
                this.action = FOLD;
                return {
                    action: this.action,
                    bet: 0
                };
            }
            break;
            case 4:{
                 // for BET
                 this.turn_down_money(cost_bb);
                 this.action = BET;
                 return {
                    action: this.action,
                    bet: cost_bb
                };
            }
            break;
            default:
                console.log('WTF');
        }

        return null;
    }
    get money() {
        return this.#_money;
    }
    change(money) {
        this.#_money += money;
        this.#_total_bet -= money;
    }
    turn_down_money(m) {
        if (this.#_money < m) {
            let ret = this.#_money;
            this.#_total_bet += ret;
            this.#_money = 0;
            return ret;
        } else {
            this.#_money -= m;
            this.#_total_bet += m;
            return m;
        }
    }
    add_money(m) {
        this.#_money += m;
    }
    get_total_bet() {
        return this.#_total_bet;
    }
    reset_total_bet() {
        this.#_total_bet = 0;
    }
    build_url(card) {
        let url = "/images/q/";
        url = url.concat(card.key);
        url = url.concat(".png");
        return url;
    }
    build_picture_url() {
        return `/images/players/${this.#_name}.png`;
    }
    setHand(card1, card2) {
        this.#_card1 = card1;
        this.#_card2 = card2;
        this.#_total_bet = 0;
    }
    resetHand() {
        this.#_card1 = null;
        this.#_card2 = null;
    }
    set card1(card1) {
        this.#_card1 = card1;
    }
    set card2(card2) {
        this.#_card2 = card2;
    }
    get card1() {
        return this.#_card1;
    }
    get card2() {
        return this.#_card2;
    }
}