import * as React from 'react'
import Image from 'next/image'
import Layout from '../../components/layout'
import styles from '../../assets/table/table.module.css'
import {
    Card,
    Deck,
    cardSuits,
    cardNom
} from '../../cards/deck'
import Player from '../../player/player'
import Site from '../../site'
import Round from '../../round'
import Sound from '../../sound'
//import axios from 'axios'
import {
    YOUR_ID,
    CALL,
    BET,
    RAISE,
    FOLD,
    ALL_IN,
    CHECK,
    CARD_DEALT,
    ROUND_PREFLOP,
    ROUND_FLOP,
    ROUND_TERN,
    ROUND_RIVER,
    ROUND_WIN,
    SMALL_BUTTON,
    BIG_BUTTON
} from '../../const'

// Rout: /game/table

/*const fetcher = (...args) => fetch(...args).then((res) => res.json())
//const fetcher = url => axios.get(url).then(res => res.data)
 async function Getdata(){
   const { message, error } = await useSWR('/api/user', fetcher)
  return (
   <div>
     <h1>{message}</h1>
   </div>
 )
}*/

function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
}

var c = 0;
export async function getServerSideProps(ctx){ 
   // JSON.parse(JSON.stringify(result))  
   c++;
   //console.log('render server',c)
   return{ props:{count:c}};
}
  /*export async function getStaticProps(context) {
      c++;
      return {
        props: {count:c}, // will be passed to the page component as props
      }
 }*/
 // static async getInitialProps(ctx) {return {value:0} }   

export default class Table extends React.Component {
   static count_render=0;
   
   componentDidMount() {
      (async () => {
          this.mod_wasm = (await import('../../pkg/poker_hands'))
      }).bind(this)();
  }
  
  constructor(props) {
      super(props);
      console.log("constructor");
  
      this.state = {
          value_custom_bet: 0,
          max_range: 100,
          start_game: false,
          round: {},
          cost_bb: 2,
          cost_sb: 1,
          pots: [],
          players: {},
          queue_players: [],
          table_cards: [],
          deck: {},
          win_players: [],
          win_cards: [],
          id_win_player: null,
          win_player_index: null,
          combination_name: '',
          wait_step_game_circle: 550,
          is_cards_dealt: false,
          is_first_bet: false,
      };
      this.getControlBtn = this.getControlBtn.bind(this);
      this.getPlayers = this.getPlayers.bind(this);
      this.handleCustomBet = this.handleCustomBet.bind(this);
      this.handleChangeCustomBet = this.handleChangeCustomBet.bind(this);
      this.handleBet = this.handleBet.bind(this);
      this.handleRaise = this.handleRaise.bind(this);
      this.handleCall = this.handleCall.bind(this);
      this.handleFold = this.handleFold.bind(this);
      this.handleAllIn = this.handleAllIn.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
      this.start_game = this.start_game.bind(this);
      this.start_game_test = this.start_game_test.bind(this);
      this.preflop = this.preflop.bind(this);
      this.flop = this.flop.bind(this);
      this.tern = this.tern.bind(this);
      this.river = this.river.bind(this);
      this.win = this.win.bind(this);
      this.game_circle = this.game_circle.bind(this);
      this.get_preflop_queue_ids_player = this.get_preflop_queue_ids_player.bind(this);
      this.get_postflop_queue_ids_player = this.get_postflop_queue_ids_player.bind(this);
      this.next_site_button = this.next_site_button.bind(this);
      this.get_chank_pot = this.get_chank_pot.bind(this);
      this.build_pot = this.build_pot.bind(this);
      this.show_pot = this.show_pot.bind(this);
      this.player_action = this.player_action.bind(this);
      this.next_activ = this.next_activ.bind(this);
      this.next_activ_new_queue = this.next_activ_new_queue.bind(this);
      this.card_dealt = this.card_dealt.bind(this);
      this.get_max_bet = this.get_max_bet.bind(this);
      this.rebuild_queue = this.rebuild_queue.bind(this);
      this.set_activ = this.set_activ.bind(this);
      this.reset_action = this.reset_action.bind(this);
      this.delete_player = this.delete_player.bind(this);
      this.action_sound = this.action_sound.bind(this);
      this.chips_destruct = this.chips_destruct.bind(this);
      this.sound = new Sound();
  }
  
  handleChangeCustomBet(event) {
      event.preventDefault();
      this.value_custom_bet = event.target.value;
  
      document.getElementById('button-addon2').innerText = this.value_custom_bet;
      document.getElementById('button-addon2').setAttribute('data-value', this.value_custom_bet);
      document.getElementById('customRange1').setAttribute('value', this.value_custom_bet);
  }
  handleCustomBet(event) {
   event.preventDefault();
   let custom_bet = Number(event.target.dataset.value);
   if (custom_bet > 0) {
       let player = this.state.players.get(YOUR_ID);
       let max_bet = this.get_max_bet(YOUR_ID);
       if (custom_bet == player.money) {
           // console.log('all-in');
           this.handleAllIn();
       } else if (!this.state.is_first_bet) {
           // bet 
           this.handleBet(null, custom_bet);
       } else if (max_bet == custom_bet + player.get_total_bet()) {
           //console.log('call');
           this.handleCall();
       } else if (max_bet * 2 <= custom_bet + player.get_total_bet()) {
           // raise 
           this.handleRaise(null, custom_bet);
       } else {
           console.error(custom_bet, 'it is forbidden to bet less');
       }
   } else {
       console.error('WTF');
   }
   return;
}

start_game_test(event) {
 
   let deck = new Deck();
   let players = new Map();
   let pot = 0;

   let s = new Site({
       position: 1,
       place_chips: styles.place1_chips,
       place_button: styles.place1_button,
       place_total_bet: styles.place1_total_bet
   });
   s.set_sb();
   let p = new Player(1, "Petr", 40, s);
   p.setHand(deck.get_card_test('As'), deck.get_card_test('Ah'));
   let bet = p.turn_down_money(20);
   pot += bet;
   players.set(p.id, p); {
       let s = new Site({
           position: 2,
           place_chips: styles.place2_chips,
           place_button: styles.place2_button,
           place_total_bet: styles.place2_total_bet
       });
       s.set_bb();
       let p = new Player(2, "Kek", 30, s);
       p.setHand(deck.get_card_test('3h'), deck.get_card_test('7h'));
       let bet = p.turn_down_money(20);
       pot += bet;
       players.set(p.id, p);
   } 
   /*{
       let s = new Site({
           position: 3,
           place_chips: styles.place3_chips,
           place_button: styles.place3_button,
           place_total_bet: styles.place3_total_bet
       });
       let p = new Player(3, "Ivan", 10, s);
       p.setHand(deck.get_card_test('8d'), deck.get_card_test('Jd'));
       let bet = p.turn_down_money(20);
       pot += bet;
       players.set(p.id, p);
   } 
   {
       let s = new Site({
           position: 4,
           place_chips: styles.place4_chips,
           place_button: styles.place4_button,
           place_total_bet: styles.place4_total_bet
       });
       let p = new Player(4, "Jack", 50, s);
       p.setHand(deck.get_card_test('9s'), deck.get_card_test('2d'));
       let bet = p.turn_down_money(50);
       pot += bet;
       players.set(p.id, p);
   }*/
   let queue = this.get_postflop_queue_ids_player(players);
   players.get(queue[0]).set_activ(true);

   let round = new Round();
   round.next();
   round.next();
   round.next();
   round.next();

   let pots = [];
   players.forEach((e) => {
       pots.push(e.get_total_bet());
   })
   pots = this.get_chank_pot(pots);
  
   this.setState({
       wait_step_game_circle: 2000,
       table_cards: [
           deck.get_card_test('7c'),
           deck.get_card_test('4h'),
           deck.get_card_test('6s'),
           deck.get_card_test('5c'),
           deck.get_card_test('8c')
       ],
       start_game: true,
       is_cards_dealt: true,
       is_first_bet: false,
       pots: pots,
       players: new Map(players),
       queue_players: queue,
       deck: deck,
       round: round
   });
}

start_game(event) {

   let deck = new Deck();
   let players = new Map();

   let pot = 0;
   let s = new Site({
       position: 1,
       place_chips: styles.place1_chips,
       place_button: styles.place1_button,
       place_total_bet: styles.place1_total_bet
   });
   s.set_sb();
   let p = new Player(1, "Petr", 40, s);
   players.set(p.id, p);

   let b = new Site({
       position: 2,
       place_chips: styles.place2_chips,
       place_button: styles.place2_button,
       place_total_bet: styles.place2_total_bet
   });
   b.set_bb();
   let p2 = new Player(2, "Kek", 10, b);
   players.set(p2.id, p2); 
   /*{
       let s = new Site({
           position: 3,
           place_chips: styles.place3_chips,
           place_button: styles.place3_button,
           place_total_bet: styles.place3_total_bet
       });
       let p3 = new Player(3, "Ivan", 10, s);
       players.set(p3.id, p3);
   }
   {
       let s = new Site({
           position: 4,
           place_chips: styles.place4_chips,
           place_button: styles.place4_button,
           place_total_bet: styles.place4_total_bet
       });

       let p3 = new Player(4, "Jack", 50, s);
       players.set(p3.id, p3);
   }*/
   /*  {
      let s = new Site({position:5,place_chips:styles.place5_chips,place_button:styles.place5_button,place_total_bet:styles.place5_total_bet});
      let p3 = new Player(5,"Harry",10,s);
      players.set(p3.id,p3);    
     }
      {
      let s = new Site({position:6,place_chips:styles.place6_chips,place_button:styles.place6_button,place_total_bet:styles.place6_total_bet});
      let p3 = new Player(6,"Jacob",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:7,place_chips:styles.place7_chips,place_button:styles.place7_button,place_total_bet:styles.place7_total_bet});
      let p3 = new Player(7,"Charley",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:8,place_chips:styles.place8_chips,place_button:styles.place8_button,place_total_bet:styles.place8_total_bet});
      let p3 = new Player(8,"Thomas",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:9,place_chips:styles.place9_chips,place_button:styles.place9_button,place_total_bet:styles.place9_total_bet});
      let p3 = new Player(9,"George",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:10,place_chips:styles.place10_chips,place_button:styles.place10_button,place_total_bet:styles.place10_total_bet});  
      let p3 = new Player(10,"Oliver",10,s);
      players.set(p3.id,p3);    
     }
     */
   let queue = this.get_postflop_queue_ids_player(players);
   
   this.setState({
       start_game: true,
       is_cards_dealt: false,
       pots: [pot],
       players: new Map(players),
       queue_players: queue,
       table_cards: [],
       deck: deck,
       round: new Round()
   });

}
game_circle(is_first_bet = false, current_player_id = null, action = null) {
   switch (this.state.round.current()) {
       case CARD_DEALT: {
           this.card_dealt(current_player_id);
           break;
       }
       case ROUND_PREFLOP:
           this.preflop(current_player_id, action);
           break;
       case ROUND_FLOP:
           this.flop(is_first_bet, current_player_id, action);
           break;
       case ROUND_TERN:
           this.tern(is_first_bet, current_player_id, action);
           break;
       case ROUND_RIVER:
           this.river(is_first_bet, current_player_id, action);
           break;
       case ROUND_WIN:
           this.win();
           break;
       default:
           console.error('WTF');
           // code block
   }
}

get_max_bet(current_player_id) {
   let max_bet = 0;
   this.state.players.forEach((p) => {
       if (p.get_total_bet() > max_bet && p.id != current_player_id) {
           max_bet = p.get_total_bet()
       }
   });
   return max_bet;
}

rebuild_queue(current_player_id) {
   let queue = this.get_postflop_queue_ids_player(this.state.players).filter((id) => {
       let p = this.state.players.get(id);
       if (p.action == FOLD || (p.action == ALL_IN && p.id != current_player_id)) {
           return false;
       }
       return true;
   });

   let queue_players = [];
   let is_find = false;
   queue.forEach((id) => {
       if (is_find == true) {
           queue_players.push(id);
       }
       if (!is_find && id == current_player_id) {
           is_find = true;
       }
   });

   is_find = true;
   queue.forEach((id) => {
       if (id == current_player_id) {
           is_find = false;
       }
       if (is_find) {
           queue_players.push(id);
       }
   });

   // rebuild
   while (this.state.queue_players.length) {
       this.state.queue_players.pop();
   }
   while (queue_players.length) {
       this.state.queue_players.push(queue_players.shift());
   }
}

set_activ() {
   this.state.players.forEach((pl, key, map) => {
       if (pl.id == this.state.queue_players[0]) {
           pl.set_activ(true);
           pl.action = null;
       } else {
           pl.set_activ(false);
       }
   });
}

next_activ() {
   let current_player_id = null;
   while (current_player_id == null && this.state.queue_players.length > 0) {
       current_player_id = this.state.queue_players.shift();
       if (this.state.players.get(current_player_id).action == FOLD ||
           this.state.players.get(current_player_id).action == ALL_IN) {
           current_player_id = null;
       }
   }

   if (current_player_id == null) return null;
   this.set_activ();

   return current_player_id;
}

next_activ_new_queue(is_reset = false) {
   let queue = this.get_postflop_queue_ids_player(this.state.players).filter((id) => {
       if (this.state.players.get(id).action == FOLD || this.state.players.get(id).action == ALL_IN) return false;
       else return true;
   });
   this.state.players.forEach((pl, key, map) => {
       if (pl.id == queue[0] && !is_reset) {
           pl.set_activ(true);
       } else {
           pl.set_activ(false);
       }
   });
   return queue;
}

action_sound(action) {
   if (action == RAISE) {
       this.sound.play('/sound/raise.mp3');
   } else if (action == ALL_IN) {
       this.sound.play('/sound/all-in.mp3');
   } else if (action == BET) {
       this.sound.play('/sound/bet.mp3');
   } else if (action == CALL) {
       // this.sound.play( '/sound/bet.mp3'); 
       //this.sound.play( '/sound/call.mp3',0,1,0.3); 
       this.sound.play('/sound/call_2.mp3');
   } else if (action == CHECK) {
       this.sound.play('/sound/check.mp3', 0, 1, 0.3);
   } else if (action == FOLD) {
       this.sound.play('/sound/fold.mp3', 0, 1, 0.2);
   }
}

player_action(current_player_id) {
   if (current_player_id == null) return null;
   let max_bet = this.get_max_bet(current_player_id);

   let obj_action = {
       max_bet: max_bet
   };
   let get_action = this.state.players.get(current_player_id).player_action(obj_action);

   if (get_action.action == RAISE || (get_action.action == ALL_IN && get_action.bet > max_bet)) {
       this.rebuild_queue(current_player_id);
   }
   return get_action.action;
}

reset_action() {
   this.state.players.forEach((pl) => {
       if (pl.action != FOLD && pl.action != ALL_IN) {
           pl.action = null;
       }
   });
}

delete_player() {
   this.state.players.forEach((pl) => {
       if (pl.money == 0) {
           this.state.players.delete(pl.id);
       }
   })
}

card_dealt(current_player_id = null) {
   if (this.state.queue_players.length > 0) {
       let id = this.state.queue_players[0];
       this.sound.play('/sound/full_table_deal.mp3');
       if (this.state.players.get(id).card1 == null) {
           this.state.players.get(id).card1 = this.state.deck.get_card();
       } else {
           this.state.players.get(id).card2 = this.state.deck.get_card();
           this.state.queue_players.shift();
       }
       this.setState({
           wait_step_game_circle: 550,
           queue_players: Object.assign([], this.state.queue_players),
       });
   } else {
       this.sound.pause();
       this.state.players.forEach((pl, key, map) => {
           if (pl.site.get_button() == SMALL_BUTTON) {
               pl.turn_down_money(this.state.cost_sb);
               this.sound.play('/sound/bet.mp3');
               pl.action = BET;
           } else if (pl.site.get_button() == BIG_BUTTON) {
               pl.turn_down_money(this.state.cost_bb);
               this.sound.play('/sound/bet.mp3');
               pl.action = BET;
           }
       });
       this.reset_action();
       this.state.round.next();
       let queue = this.get_preflop_queue_ids_player(this.state.players);
       this.state.players.get(queue[0]).set_activ(true);
       this.setState({
           wait_step_game_circle: 2000,
           is_cards_dealt: true,
           is_first_bet: true,
           pots: this.build_pot(),
           queue_players: Object.assign([], queue),
       });
   }
}
preflop(current_player_id = null, action = null) {
   //console.log('preflop');
   if (this.state.queue_players.length > 0) {
       if (current_player_id == null) {
           current_player_id = this.next_activ();
           if (current_player_id == null) {
             console.warn('unimplemented');
           }
           action = this.player_action(current_player_id);
       }
       this.action_sound(action);
       this.setState({
           pots: this.build_pot(),
       });
   } else {
        console.log('out preflop');
       this.sound.play('/sound/full_table_deal.mp3', 6.5, 1.3);
       this.reset_action();
       this.state.round.next();
       let queue = this.next_activ_new_queue();
       this.setState({
           table_cards: [
               this.state.deck.get_card(),
               this.state.deck.get_card(),
               this.state.deck.get_card()
           ],
           is_first_bet: false,
           queue_players: Object.assign([], queue),
       });

   }
}

flop(is_first_bet = false, current_player_id = null, action = null) {
   //console.log('flop');
   // start with SB
   if (this.state.queue_players.length > 0) {
       if (current_player_id == null) {
           current_player_id = this.next_activ();
           if (current_player_id == null) {
             console.warn('unimplemented');
           }
           action = this.player_action(current_player_id);
           if (action != FOLD && action != CHECK) {
               is_first_bet = true;
           }
       }
       this.action_sound(action);
       this.setState({
           is_first_bet: is_first_bet,
           pots: this.build_pot(),
       });
   } else {
       // console.log('out flop');
       this.sound.play('/sound/full_table_deal.mp3', 7.3);
       this.reset_action();
       this.state.round.next();
       let queue = this.next_activ_new_queue();
       this.state.table_cards.push(this.state.deck.get_card());
       this.setState({
           is_first_bet: false,
           queue_players: Object.assign([], queue),
       });
   }
}

tern(is_first_bet = false, current_player_id = null, action = null) {
   // console.log('tern');
   if (this.state.queue_players.length > 0) {
       if (current_player_id == null) {
           current_player_id = this.next_activ();
           if (current_player_id == null) {
            console.warn('unimplemented');
           }
           action = this.player_action(current_player_id);
           if (action != FOLD && action != CHECK) {
               is_first_bet = true;
           }
       }
       this.action_sound(action);
       this.setState({
           is_first_bet: is_first_bet,
           pots: this.build_pot()
       });
   } else {
       // console.log('out tern');
       this.sound.play('/sound/full_table_deal.mp3', 7.3);
       this.reset_action();
       this.state.round.next();
       let queue = this.next_activ_new_queue();
       this.state.table_cards.push(this.state.deck.get_card());
       this.setState({
           is_first_bet: false,
           queue_players: Object.assign([], queue)
       });
   }
}

river(is_first_bet = false, current_player_id = null, action = null) {
      //console.log('river');
      if (this.state.queue_players.length > 0) {
        if (current_player_id == null) {
           current_player_id = this.next_activ();
           if (current_player_id == null) {
             console.warn('unimplemented');
           }
           action = this.player_action(current_player_id);
           if (action != FOLD && action != CHECK) {
               is_first_bet = true;
           }
       }
       this.action_sound(action);
       this.setState({
           is_first_bet: is_first_bet,
           pots: this.build_pot(),
      });
   } else {
       //console.log('out river');
       {
           //TODO: diff max bet
           let max_bet = 0;
           let id_max_bet = null;
           this.state.players.forEach((p) => {
               if (p.get_total_bet() > max_bet) {
                   max_bet = p.get_total_bet();
                   id_max_bet = p.id;
               }
           });
           let max_bet_second = this.get_max_bet(id_max_bet);
           if (max_bet_second < max_bet) {
               let diff_max_bet = max_bet - max_bet_second;
               this.state.players.get(id_max_bet).change(diff_max_bet);
           }
       }

       this.state.round.next();
       let queue = this.next_activ_new_queue(true);
       this.reset_action();
       this.setState({
           is_first_bet: false,
           pots: this.build_pot(),
           queue_players: Object.assign([], queue)
       });
   }
}

win() {
   // console.log('win');
   if (this.state.pots.length > 0) {
       let win_players = [];
       let count_players_without_fold = 0;
       let id_win_player = null;
       this.state.players.forEach((pl, key, map) => {
         if (pl.action != FOLD) {count_players_without_fold++; id_win_player=pl.id;}
       });
       if(count_players_without_fold==0){
         console.warn('unimplemented. All players fold');
       }
       let pot = this.state.pots.reduce((prev, cur) => prev + cur, 0);
       if (count_players_without_fold > 1 && this.state.win_players.length == 0 && this.state.table_cards.length == 5) {
           let manager = new this.mod_wasm.Menager(pot);
           this.state.players.forEach((pl, key, map) => {
               if (pl.action != FOLD) {
                   let c1 = new this.mod_wasm.Card(pl.card1.nom, pl.card1.suit);
                   let c2 = new this.mod_wasm.Card(pl.card2.nom, pl.card2.suit);
                   let _c3 = this.state.table_cards[0];
                   let c3 = new this.mod_wasm.Card(_c3.nom, _c3.suit);
                   let _c4 = this.state.table_cards[1];
                   let c4 = new this.mod_wasm.Card(_c4.nom, _c4.suit);
                   let _c5 = this.state.table_cards[2];
                   let c5 = new this.mod_wasm.Card(_c5.nom, _c5.suit);
                   let _c6 = this.state.table_cards[3];
                   let c6 = new this.mod_wasm.Card(_c6.nom, _c6.suit);
                   let _c7 = this.state.table_cards[4];
                   let c7 = new this.mod_wasm.Card(_c7.nom, _c7.suit);
                   console.log(c1.show_card(), c2.show_card(), c3.show_card(), c4.show_card(), c5.show_card(), c6.show_card(), c7.show_card());
                   let hand = new this.mod_wasm.Hand(String(pl.id), pl.get_total_bet(), c1, c2, c3, c4, c5, c6, c7);
                   manager.add_hand(hand);
               }
           });

           let wins = manager.calculate();
           wins.forEach((total, index, map) => {
               console.log('win=', this.state.players.get(parseInt(total.get_player_id(), 10)).name, total.get_win_pot());
               win_players.push(total);
           });

           this.state.players.forEach((pl, key, map) => {
               pl.set_activ(false);
           });
       } else if(count_players_without_fold > 1){
           win_players = this.state.win_players;
       }

       if(count_players_without_fold==1){console.log('count_players_without_fold=',count_players_without_fold)
         this.state.players.get(id_win_player).add_money(pot);
         this.setState({
            win_players: [],
            win_cards: [],
            id_win_player: id_win_player,
            pots:[],
            combination_name: '',
            wait_step_game_circle: 6000,
         });
      }else{
         let win = win_players.shift();
         let combination_name = win.show_combination();

         id_win_player = parseInt(win.get_player_id(), 10);
         this.state.players.get(id_win_player).add_money(win.get_win_pot());

         this.sound.play('/sound/win_pot.mp3');
         //let key_range_group = win.key_range_group;
         let win_cards = win.show_cards();

         let win_pot = win.get_win_pot();
         let pots = this.state.pots.map((p) => {
            if (win_pot > 0) {
                  if (p >= win_pot) {
                     p -= win_pot;
                     win_pot = 0;
                  } else {
                     win_pot -= p;
                     p = 0;
                  }
            }
            return p;
         }).filter((p) => p > 0);

         this.setState({
            win_players: win_players,
            win_cards: win_cards,
            id_win_player: id_win_player,
            pots: pots,
            combination_name: combination_name,
            wait_step_game_circle: 6000,
         });
      }

   } else {
       this.sound.play('/sound/card-shuffle.mp3');
       sleep(2000).then(() => {
           //console.log('out win');
           this.next_site_button();
           this.delete_player();
           this.state.players.forEach((pl, key, map) => {
               pl.resetHand();
               pl.reset_total_bet();
               pl.action = null;
           });
           this.state.deck.new_deck();
           let queue = this.get_postflop_queue_ids_player(this.state.players);
           this.state.round.next();
           this.setState({
               win_players: [],
               win_cards: [],
               id_win_player: null,
               table_cards: [],
               pot: 0,
               queue_players: Object.assign([], queue),
               combination_name: '',
               wait_step_game_circle: 550,
               is_cards_dealt: false
           });
       });

   }
}

build_pot() {
   let players_bet = [];
   this.state.players.forEach((e) => {
       players_bet.push(e.get_total_bet());
   })
   return this.get_chank_pot(players_bet);
}
get_chank_pot(total_bets) {
   //  console.log('result',chank_pot([100,300,400,500]));
   let result = [];
   const sum = total_bets.reduce((prev, cur) => prev + cur, 0);
   total_bets = total_bets.filter((p) => p > 0);
   let current_sum = 0;
   let chank_pot = 0;
   let min = 0;
   while (current_sum < sum) {
       chank_pot = 0;
       min = total_bets.reduce((prev, cur) => {
           if (prev > cur) {
               return cur;
           }
           return prev;
       }, total_bets[0]);
       total_bets = total_bets
           .map((e) => {
               current_sum += min;
               chank_pot += min;
               e -= min;
               return e;
           }).filter((e) => e > 0);
       result.push(chank_pot);
   }
   return result;
}

next_site_button() {
   //console.log('next_site_button')
   this.state.players.forEach((pl, key, map) => {
       if (pl.site.get_button() !== BIG_BUTTON) {
           pl.site.reset_button();
       }
   });
   let is_find_bb = false;
   let is_set_sb = false;
   this.state.players.forEach((pl, key, map) => {
       if (pl.site.get_button() === BIG_BUTTON) {
           is_find_bb = true;
       }
       if (is_find_bb && !is_set_sb && pl.money > 0) {
           is_set_sb = true;
           pl.site.set_sb();
       }
   });
   if (!is_set_sb) {
       this.state.players.forEach((pl, key, map) => {
           if (is_find_bb && !is_set_sb && pl.money > 0) {
               is_set_sb = true;
               pl.site.set_sb();
           }
       });
   }

   
   let first_players = false;
   let is_change = false;
   this.state.players.forEach((pl, key, map) => {
       if (first_players && !is_change && pl.money > 0) {
           pl.site.set_bb();
           is_change = true;
       }
       if (!first_players && pl.site.get_button() === SMALL_BUTTON) {
           first_players = true;
       }
   });
   if (!is_change) {
       for (let player of this.state.players.values()) {
           player.site.set_bb();
           break;
       }
   }
}

get_postflop_queue_ids_player(players) {
   // start with SB
   // TODO: queuing is very inefficient!!!
   let queue_players = [];
   players.forEach((pl, key, map) => {
       if (pl.site.get_button() === SMALL_BUTTON) {
           queue_players.push(pl.id);
       }
   });
   players.forEach((pl, key, map) => {
       if (pl.site.get_button() === BIG_BUTTON) {
           queue_players.push(pl.id);
       }
   });

   // after BB
   let first_players = false;
   players.forEach((pl, key, map) => {
       if (first_players && pl.site.get_button() !== SMALL_BUTTON) {
           queue_players.push(pl.id);
       }
       if (!first_players && pl.site.get_button() === BIG_BUTTON) {
           first_players = true;
       }
   });
   // before SB
   let diff = players.size - queue_players.length;
   if (diff > 0) {
       players.forEach((pl, key, map) => {
           if (players.size > queue_players.length) {
               queue_players.push(pl.id);
           }
       });
   }
   return queue_players;
}

get_preflop_queue_ids_player(players) {
   let finish_round = false;
   let queue_players = [];

   // after BB
   let first_players = false;
   let last_players = true;
   players.forEach((pl, key, map) => {
       if (first_players && pl.site.get_button() !== SMALL_BUTTON) {
           queue_players.push(pl.id);
       }
       if (pl.site.get_button() === BIG_BUTTON) {
           first_players = true;
       }
   });

   // before SB
   let diff = players.size - queue_players.length;
   if (diff > 2) {
       players.forEach((pl, key, map) => {
           if (players.size > queue_players.length + 2) {
               queue_players.push(pl.id);
           }
       });
   }

   players.forEach((pl, key, map) => {
       if (pl.site.get_button() === SMALL_BUTTON) {
           queue_players.push(pl.id);
       }
   });
   players.forEach((pl, key, map) => {
       if (pl.site.get_button() === BIG_BUTTON) {
           queue_players.push(pl.id);
       }
   });
   return queue_players;
}

handleBet(e, custom_bet = null) {
   if (custom_bet != null) {
       this.state.players.get(YOUR_ID).turn_down_money(custom_bet);
   } else {
       this.state.players.get(YOUR_ID).turn_down_money(this.state.cost_bb);
   }

   this.state.players.get(YOUR_ID).action = BET;
   this.rebuild_queue(YOUR_ID);
   this.set_activ();
   this.game_circle(true, YOUR_ID, BET);
}

handleRaise(e, custom_bet = null) {
   let max_bet = this.get_max_bet(YOUR_ID);
   if (custom_bet != null) {
       this.state.players.get(YOUR_ID).turn_down_money(custom_bet);
   } else {
       this.state.players.get(YOUR_ID).turn_down_money(max_bet * 2 - this.state.players.get(YOUR_ID).get_total_bet());
   }
   this.state.players.get(YOUR_ID).action = RAISE;
   this.rebuild_queue(YOUR_ID);
   this.set_activ();
   this.game_circle(true, YOUR_ID, RAISE);
}

handleAllIn(e) {
   let max_bet = this.get_max_bet(YOUR_ID);
   let is_first_bet = false;
   if (this.state.players.get(YOUR_ID).money > max_bet - this.state.players.get(YOUR_ID).get_total_bet()) {
       this.state.players.get(YOUR_ID).turn_down_money(this.state.players.get(YOUR_ID).money);
       this.rebuild_queue(YOUR_ID);
       is_first_bet = true;
   } else {
       this.state.players.get(YOUR_ID).turn_down_money(this.state.players.get(YOUR_ID).money);
       this.state.queue_players.shift();
   }
   this.set_activ();
   this.state.players.get(YOUR_ID).action = ALL_IN;
   this.game_circle(is_first_bet, YOUR_ID, ALL_IN);
}

handleFold(e) {
   this.state.players.get(YOUR_ID).action = FOLD;
   this.state.queue_players.shift();
   this.set_activ();
   this.game_circle(false, YOUR_ID, FOLD);
}

handleCall(e) {
   let max_bet = this.get_max_bet(YOUR_ID);
   let action = ALL_IN;
   if (max_bet - this.state.players.get(YOUR_ID).get_total_bet() >= this.state.players.get(YOUR_ID).money) {
       this.state.players.get(YOUR_ID).action = action;
   } else {
       action = CALL;
       this.state.players.get(YOUR_ID).action = CALL;
   }
   this.state.queue_players.shift();
   this.set_activ();
   this.state.players.get(YOUR_ID).turn_down_money(max_bet - this.state.players.get(YOUR_ID).get_total_bet());
   this.game_circle(false, YOUR_ID, action);
}

handleCheck(e) {
   this.state.players.get(YOUR_ID).action = CHECK;
   this.state.queue_players.shift();
   this.set_activ();
   this.game_circle(false, YOUR_ID, CHECK);
}
   
getControlBtn(){
   let is_player = false;
   this.state.players.forEach((p)=>{if(p.is_activ() && p.id==YOUR_ID){is_player=true}});
   
   let is_count_activ_players = false;
   this.state.players.forEach((p)=>{if(p.action!=FOLD && p.action!=ALL_IN && p.money>0 && p.id!=YOUR_ID){is_count_activ_players=true;}});

   if(!is_player || !is_count_activ_players){
      sleep(this.state.wait_step_game_circle).then(() => {   
         if(this.state.start_game){this.game_circle();}
      });
      return '';
   }

   let buttons = [];
   let max_bet = this.get_max_bet(YOUR_ID); 
   let player = this.state.players.get(YOUR_ID);

   if(player.get_total_bet()==max_bet && !this.state.is_first_bet){
      // CHECK
      buttons.push(<button key='button_check' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleCheck(e)}>CHECK</button>);
      buttons.push(<button key='button_bet' className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={false} onClick={(e) => this.handleBet(e)}>BET</button>);
   }else if(player.money >= max_bet-player.get_total_bet() && this.state.is_first_bet && player.site.get_button()==BIG_BUTTON){
      // CHECK
      buttons.push(<button key='button_check' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleCheck(e)}>CHECK</button>);
   } else if(player.money >= max_bet-player.get_total_bet() && this.state.is_first_bet ){
      // CALL
      buttons.push(<button key='button_call' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleCall(e)}>CALL</button>);
   }else{
      buttons.push(<button key='button_bet' className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={false} onClick={(e) => this.handleBet(e)}>BET</button>);
   }

   buttons.push(<button key='button_fold' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleFold(e)}>FOLD</button>);

   if(this.state.players.get(YOUR_ID).money > (max_bet-player.get_total_bet())*2  && this.state.is_first_bet){
      buttons.push(<button key='button_raise' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleRaise(e)}>RAISE</button>);
      buttons.push(<button key='button_all_in' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleAllIn(e)}>ALL-IN</button>);
   }else{
      buttons.push(<button key='button_all_in' className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={(e) => this.handleAllIn(e)}>ALL-IN</button>);
   } 
   this.value_custom_bet = max_bet>0?max_bet:this.state.cost_bb;
   let min_value = Number(this.value_custom_bet)-player.get_total_bet();
   this.value_custom_bet = min_value>this.value_custom_bet?min_value:this.value_custom_bet;
   let step = this.state.cost_bb>min_value?min_value:this.state.cost_bb;

   sleep(400).then(() => {   
      document.getElementById('customRange1').setAttribute('value', this.value_custom_bet);
   });
   
   return <div className={styles.control_btn}>
         <div className="col-lg-12 text-center">
         <div className="row align-items-center">
            <div className="col-xs-4 align-self-center">
               <div className="d-grid gap-3 d-md-block" aria-label="Basic example">
                  {buttons}
               </div>
            </div>
         </div>
      </div>
      <div className="row justify-content-md-center">
         <div className="col-3">
            <div className="input-group mb-3">
            <input className={'form-control'} type="range"  min={min_value} max={player.money} step={step} id="customRange1" aria-describedby="button-addon2" onChange={(e) => this.handleChangeCustomBet(e)}></input>
            <button className="btn btn-outline-secondary gap-2 col-3 mx-auto" type="button" id="button-addon2" data-value={this.value_custom_bet}  onClick={(e) => {if(Number(this.value_custom_bet)>0)this.handleCustomBet(e);}}>
               {this.value_custom_bet}
            </button>
            </div>
         </div>
      </div>
   </div>
}

build_url(key) {
   return `/images/q/${key}.png`;
}
build_chips_url(key) {
   return `/images/chips/${key}.png`;
}
build_button_url(key) {
   return `/images/button/${key}.png`;
}

getSite(site){
   let player = null;
   let is_find = false;
   this.state.players.forEach( (pl, key, map) => {
         if (is_find == false && (pl.site && pl.site.style.position == site)){
         player = pl;
         is_find = true;
         }
   });
   if (player == null){ return ''; }

   let is_card = true;
   if (player.card1==null){ is_card=false; }
   let activ_player = '';
   if (player.is_activ()){ activ_player = styles.activ_player; }

   let win_player_card1 = '';
   let win_player_card2 = '';
   if (this.state.id_win_player == player.id){
      activ_player = styles.win_player; 
      if (this.state.win_cards.includes(player.card1.key)){
         win_player_card1 = styles.win_player_card1;
      }
      if (this.state.win_cards.includes(player.card2.key)){
         win_player_card2 = styles.win_player_card2;
      }  
   }

   let cards = [];
   if(player.card1!=null){
      cards.push( 
      <Image key={player.card1.key}
               className={styles.img+' '+win_player_card1} 
               src={this.build_url(player.card1.key)} 
               height={65} width={40} 
               quality={100} 
               priority={true}
               layout="raw"
               alt=""/>);
         if(player.card2!=null){
            cards.push( 
            <Image key={player.card2.key}
                     className={styles.img +' '+win_player_card2} 
                     src={this.build_url(player.card2.key)} 
                     height={65} 
                     width={40} 
                     quality={100} 
                     priority={true}
                     layout="raw"
                     alt=""/>);  
         }
   }

   return <React.Fragment> 
            <div className={styles.box_card}> 
               {is_card && <React.Fragment> {cards} </React.Fragment>}
            </div>
            <div className={styles.show_action}>
               {this.print_action(player.action)}
            </div>
            <div className={styles.inform_tablo_l}>
               <Image key={player.build_picture_url()}
                        src={player.build_picture_url()} 
                        className={styles.round_l+' '+activ_player} 
                        height={54} 
                        width={54} 
                        quality={100} 
                        priority={true}
                        layout="raw"
                        alt=""/>
               <div className={styles.name_money_info}>
                  <div key={player.name} className={styles.name_info}>{player.name}</div>
                  <div key={String(player.money)+player.name} className={styles.money_info}>{player.money}</div>
               </div>
            </div> 
            <div className={player.site.style.place_chips+' '+styles.chips_place_all}>
               {this.getPlayerChips(player)}
            </div>
            {this.getButton(player)}
            <div className={player.site.style.place_total_bet}>{player.get_total_bet()>0?player.get_total_bet():''}</div>
            
         </React.Fragment> 
}

print_action(action){
   switch (action){
      case CALL:return "CALL";
      case BET:return 'BET';
      case RAISE:return "RAISE";
      case FOLD:return "FOLD";
      case CHECK:return "CHECK";
      case ALL_IN:return "ALL_IN";
      default:return '';
   }
}

getPlayerChips(player){
   let res = [];
   this.chips_destruct(player.money).map(
      (money)=>res.push(
               <Image key={String(money)+player.name} className={'rounded '+ styles.chips_player_item_all} src={this.build_chips_url(money)} layout="raw" height={55} width={40} alt=""/>
      ));
   return <React.Fragment> {res} </React.Fragment>  
}

getButton(player){
   let button =  player.site.get_button();
   if (button == null) {
      return <></>
   }else if (button == SMALL_BUTTON){
      return  <Image key={'button'} className={'rounded '+player.site.style.place_button} src={this.build_button_url('SB')} priority={true} layout="raw" height={25} width={25} alt=""/>
   }else if (button == BIG_BUTTON){
      return  <Image key={'button'} className={'rounded '+player.site.style.place_button} src={this.build_button_url('BB')} priority={true} layout="raw" height={25} width={25} alt=""/>
   }
}

getPlayers(){
   let res = [];
   this.state.players.forEach( (player, key, map) => {
      res.push(<div className={styles.box_card}> {this.getCardHand(player)}</div>);
   });
   return res;
}

chips_destruct(value) { 
   let ret = new Array();

   if (value > 99999) {
         ret.push(value - value % 100000);
         value = value % 100000;
   }
   if (value > 9999) {
         ret.push(value - value % 10000);
         value = value % 10000;
   }
   if (value > 999) {
         ret.push(value - value % 1000);
         value = value % 1000;
   }
   if (value > 99) {
         ret.push(value - value % 100);
         value = value % 100;
   }
   if (value > 9) {
         ret.push(value - value % 10);
         value = value % 10;
   }
   if (value > 0) {
         ret.push(value);
   }
   return ret;
}

getTotalImageChips(value){ 
   let res = [];
   this.chips_destruct(value).map((money)=>res.push( 
      <Image key={money} className={styles.chips_total_item+' rounded'} 
         src={this.build_chips_url(money)} 
         layout="raw" 
         height={70} 
         width={70} 
         alt=""/>
      ));
   return <React.Fragment> <div className="text-center"> {res} </div> </React.Fragment>  
}

getTableCard(){
   let result = [];
   if (this.state.round.current() > ROUND_PREFLOP){
      for(var i=0; i < this.state.table_cards.length; i++){  
         let win = '';
         if (this.state.win_cards.length >0){
            for (let y=0; y < this.state.win_cards.length; y++){
               if (this.state.win_cards[y]==this.state.table_cards[i].key){
                  win = styles.win_card;
                  break;
               } 
            }
         }
         result.push(
               <div key={this.state.table_cards[i].key+' '+win+' '+(Math.round(Math.random()*100))*1000} className={styles.table_cards_item}>
                  <Image className={styles.img+' '+win} src={this.build_url(this.state.table_cards[i].key)} priority={true} layout="raw" height={65} width={40} alt=""/>
               </div>
         );
      }
   }
   return result;
}

show_pot() {
   let total_pot = this.state.pots.reduce((prev, cur) => prev + cur, 0);
   if (total_pot == 0) {
         return '';
   }
   if (this.state.pots.length == 1) {
         return total_pot
   };
   let result = total_pot + '(';
   for (let i = 0; i < this.state.pots.length; i++) {
         result += this.state.pots[i];
         if (i != this.state.pots.length - 1) result += ' ';
   }
   result += ')';
   return result;
}

render() {
/*
      // Рендер елементов в зависимости от состояния
      const isLoggedIn = this.state.isLoggedIn;
      if (isLoggedIn) {
      ...

      еще вариант с JSX
      { this.state.isLoggedIn && 
         <h1>Привет, мир!</h1>
      } 

      еще тернарный
      {isLoggedIn ? <Component/> : <Component/>}

*/
   
   return  !this.state.start_game ?  
      <Layout> 
         <div className={styles.pokertable}>
            <button className={"btn btn-secondary btn-outline-dark btn-lg "+styles.start_game_btn} type="button" onClick={this.start_game}>Open table {this.props.count}</button>
         </div>
      </Layout> : 
      <Layout>
      <div className={styles.pokertable}>
         <div className={styles.place1}> {this.getSite(1)} </div> 
         <div className={styles.place2}> {this.getSite(2)} </div> 
         <div className={styles.place3}> {this.getSite(3)} </div> 
         <div className={styles.place4}> {this.getSite(4)} </div> 
         <div className={styles.place5}> {this.getSite(5)} </div> 
         <div className={styles.place6}> {this.getSite(6)} </div> 
         <div className={styles.place7}> {this.getSite(7)} </div> 
         <div className={styles.place8}> {this.getSite(8)} </div> 
         <div className={styles.place9}> {this.getSite(9)} </div> 
         <div className={styles.place10}> {this.getSite(10)} </div> 

         <div className={styles.table_pot}>
               <p className="text-center fw-bold fs-3">{this.show_pot()}</p>
         </div>

         <div className={styles.table_cards}>
               <div className={styles.divtest}>{this.getTableCard()} </div>
               <div className={styles.combination_name}>{this.state.combination_name}</div>
               <div className={styles.total_chips}>
                     {this.getTotalImageChips(this.state.pots.reduce((prev, cur) => prev + cur,0))}
               </div>
         </div>
      </div>
      {this.getControlBtn()}
   </Layout>
}
}
 
 