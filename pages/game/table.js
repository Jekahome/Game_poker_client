import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'
import styles from '../../assets/table/table.module.css'
import {Card,Deck,cardSuits,cardNom} from '../../cards/deck'
import Player from '../../player/player'
import Site from '../../site'
import Round from '../../round'
import profilePic from '../../public/images/q/2h.png'
import useSWR from 'swr'
import axios from 'axios'


// Rout: /game/table

// ВАЖНО при вызове SetState вызывается функция render() заново, поэтому в ней должны быть статические данные!!!

/*const fetcher = (...args) => fetch(...args).then((res) => res.json())
//const fetcher = url => axios.get(url).then(res => res.data)
 async function Getdata(){
   const { message, error } = await useSWR('/api/user', fetcher)
   console.log("DATA:",message);
  return (
   <div>
     <h1>{message}</h1>
   </div>
 )
}*/
const CALL = 0;
const REISE = 1;
const FOLD = 2;
const ALL_IN = 3;

const ROUND_PREFLOP = 0;
const ROUND_FLOP = 1;
const ROUND_TERN = 2;
const ROUND_RIVER = 3;
const ROUND_WIN = 4;

const SMALL_BUTTON = 0;
const BIG_BUTTON = 1;
const KEY_ROUND_SINGL = true; 

function sleep (time) {
   return new Promise((resolve) => setTimeout(resolve, time));
 }

  var c = 0;
  export async function getServerSideProps(ctx){ 
     // JSON.parse(JSON.stringify(result))  
     c++;
     console.log('render server',c)
     return{ props:{count:c}};
   }
  /*export async function getStaticProps(context) {
      c++;
      return {
        props: {count:c}, // will be passed to the page component as props
      }
 }*/
    
 export default class Table extends React.Component {
   static count_render=0;
   static count_didmount=0;
   componentDidMount() {//вызывается сразу после монтирования компонента (вставки в дерево) до render()
      Table.count_didmount++;
      console.log("componentDidMount",Table.count_didmount);
      // после того, как компонент отрендерился в DOM 
      (async () => {  
         // Dynamically load
         this.mod_wasm = (await import('../../pkg/poker_hands'))
         /*
            // Used
            let c1 = new this.mod_wasm.Card(1,100);
            let c2 = new this.mod_wasm.Card(2,100);
            let c3 = new this.mod_wasm.Card(4,100);
            let c4 = new this.mod_wasm.Card(8,100);
            let c5 = new this.mod_wasm.Card(16,100);
            let c6 = new this.mod_wasm.Card(2048,10);
            let c7 = new this.mod_wasm.Card(4096,10);
            let hand = new this.mod_wasm.Hand("flash1",c1,c2,c3,c4,c5,c6,c7);
         
            let manager = new this.mod_wasm.Menager();
            manager.add_hand(hand);
            let res = manager.calculate_wasm();
            for(var i=0; i<res.length; i++){
               console.log(res[i].key_range_group,res[i].combination);
               for (let c of res[i].get_cards()){
                  let card = c.get();
                  console.log("Card:",card.n,card.m);
               }
            }
         */

       }).bind(this)();
   }

  // static async getInitialProps(ctx) {return {value:0} }

   constructor(props) {
     super(props);
     console.log("constructor");
     
     this.state={
        control:{btn1:{disabled:""},btn2:{disabled:""},btn3:{disabled:"disabled"}},
        value_range:10,
        max_range:100,
        start_game:false,
        round:{},
        cost_bb:1,
        cost_sb:1,
        pot:0,
        players:{},
        queue_players:[],
        table_cards:[],
        deck:{},
        win_players:[], 
        win_cards:[],
        id_win_player:null,
        win_player_index:null,
        combination_name:'',
        wait_step_game_circle:2000,
        pot_history:{},
        is_cards_dealt:false,
        
     };
     this.getControlBtn = this.getControlBtn.bind(this);
     this.getPlayers = this.getPlayers.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleSet = this.handleSet.bind(this);
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
     this.build_pot_history =  this.build_pot_history.bind(this);
   }
    
   handleChange(event){
     // console.log(event.target.value);
     // this.setState({value_range: event.target.value});
     event.preventDefault();
     this.value_range = event.target.value;
     
     document.getElementById('button-addon2').innerText=this.value_range;
     document.getElementById('button-addon2').setAttribute('data-value', this.value_range);
     document.getElementById('customRange1').setAttribute('value', this.value_range);

     //------------------
     // TODO: пример расчета победителя по событию        
         let manager = new this.mod_wasm.Menager();
         this.state.players.forEach( (pl, key, map) => {
              
             let c1 = new this.mod_wasm.Card( pl.card1.nom, pl.card1.suit);
             let c2 = new this.mod_wasm.Card( pl.card2.nom, pl.card2.suit);

             let _c3 = this.state.table_cards[0];
             let c3 = new this.mod_wasm.Card( _c3.nom, _c3.suit);

             let _c4 = this.state.table_cards[1];
             let c4 = new this.mod_wasm.Card( _c4.nom, _c4.suit);

             let _c5 = this.state.table_cards[2];
             let c5 = new this.mod_wasm.Card( _c5.nom, _c5.suit);

             let _c6 = this.state.table_cards[3];
             let c6 = new this.mod_wasm.Card( _c6.nom, _c6.suit);

             let _c7 = this.state.table_cards[4];
             let c7 = new this.mod_wasm.Card( _c7.nom, _c7.suit);
            console.log(c1.show_card(),c2.show_card(),c3.show_card(),c4.show_card(),c5.show_card(),c6.show_card(),c7.show_card());
             let hand = new this.mod_wasm.Hand(String(pl.name),c1,c2,c3,c4,c5,c6,c7);
            
            // console.log("Send hand=",hand.show_hand());
             manager.add_hand(hand);
        });
         let res = manager.calculate_wasm();
         for(var i=0; i<res.length; i++){
            console.log(
               'key_hand=',res[i].get_key_hand(),
               'key_range_group=',res[i].key_range_group,
               'combination=',res[i].show_combination(),
               'cards=',res[i].show_cards());// добавить корректное отображение
           // for (let c of res[i].get_cards()){ let card = c.get(); }
         }
         
         //---------------
   }

   handleSet(event){
      event.preventDefault();
      console.log(event.target.dataset.value);
      this.setState({pot: this.state.pot+Number(event.target.dataset.value)});
   }
   start_game_test(event){

      let deck = new Deck();
      let players = new Map();
      let pot = 0;

      let s = new Site({position:1,place_chips:styles.place1_chips,place_button:styles.place1_button});
      s.set_sb();
      let p = new Player(1,"petr",20,s);
      p.setHand(deck.get_card_test('Ad'),deck.get_card_test('5d'));
      let bet = p.turn_down_money(5); 
      pot+=bet;
      players.set(p.id,p);
     {
      let s = new Site({position:2,place_chips:styles.place2_chips,place_button:styles.place2_button});
      s.set_bb();
      let p = new Player(2,"kek",20,s);
      p.setHand(deck.get_card_test('Kd'),deck.get_card_test('3c'));
      let bet = p.turn_down_money(10); 
      pot+=bet;
      players.set(p.id,p);         
     }
     {
      let s = new Site({position:3,place_chips:styles.place3_chips,place_button:styles.place3_button});
      let p = new Player(3,"ivan",20,s);
      p.setHand(deck.get_card_test('Qd'),deck.get_card_test('Qh'));
      let bet = p.turn_down_money(20); 
      pot+=bet;
      players.set(p.id,p);   
     }
     {
      let s = new Site({position:4,place_chips:styles.place4_chips,place_button:styles.place4_button});
      let p = new Player(4,"ivan4",20,s);
      p.setHand(deck.get_card_test('Qs'),deck.get_card_test('Qc'));
      let bet = p.turn_down_money(20); 
      pot+=bet;
      players.set(p.id,p);   
     }
      let queue = this.get_postflop_queue_ids_player(players);
      players.get(queue[0]).set_activ(true);

      let round = new Round();
      round.next();
      round.next();
      round.next();
      round.next();

      this.setState({
         table_cards:[
            deck.get_card_test('3s'),
            deck.get_card_test('5c'),
            deck.get_card_test('Ah'),
            deck.get_card_test('Kh'),
            deck.get_card_test('10h')
         ],
         start_game:true,
         is_cards_dealt:true,
         pot:pot,
         players:new Map(players),   
         queue_players:queue,
         deck:deck,
         round:round,
         pot_history:new Map()
      }); 

   }
   start_game(event){

      let deck = new Deck();
      let players = new Map();

      let pot = 0;
      let s = new Site({position:1,place_chips:styles.place1_chips,place_button:styles.place1_button});
      s.set_sb();
      let p = new Player(1,"petr",20,s);
      players.set(p.id,p);
     
      let b = new Site({position:2,place_chips:styles.place2_chips,place_button:styles.place2_button});
      b.set_bb();
      let p2 = new Player(2,"kek",20,b);
      players.set(p2.id,p2); 
     {
      let s = new Site({position:3,place_chips:styles.place3_chips,place_button:styles.place3_button});
      let p3 = new Player(3,"ivan",20,s);
      players.set(p3.id,p3);   
     }
    /* {
      let s = new Site({position:4,place_chips:styles.place4_chips,place_button:styles.place4_button});
    
      let p3 = new Player(4,"ivan4",20,s);
      players.set(p3.id,p3);    
     }
    {
      let s = new Site({position:5,place_chips:styles.place5_chips,place_button:styles.place5_button});
      let p3 = new Player(5,"ivan5",10,s);
      players.set(p3.id,p3);    
     }
      {
      let s = new Site({position:6,place_chips:styles.place6_chips,place_button:styles.place6_button});
      let p3 = new Player(6,"ivan6",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:7,place_chips:styles.place7_chips,place_button:styles.place7_button});
      let p3 = new Player(7,"ivan7",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:8,place_chips:styles.place8_chips,place_button:styles.place8_button});
      let p3 = new Player(8,"ivan8",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:9,place_chips:styles.place9_chips,place_button:styles.place9_button});
      let p3 = new Player(9,"ivan9",10,s);
      players.set(p3.id,p3);    
     }
     {
      let s = new Site({position:10,place_chips:styles.place10_chips,place_button:styles.place10_button});  
      let p3 = new Player(10,"ivannnnn",10,s);
      players.set(p3.id,p3);    
     }
     */
     let queue = this.get_preflop_queue_ids_player(players);
     players.get(queue[0]).set_activ(true);
      this.setState({
         start_game:true,
         is_cards_dealt:false,
         pot:pot,
         players:new Map(players),   
         queue_players:queue,
         table_cards:[],//Object.assign([], table_cards),
         deck:deck,
         round:new Round(),
         pot_history:new Map()
      }); 
  
   }

   game_circle(){
      switch(this.state.round.current()) {
         case ROUND_PREFLOP:
           this.preflop();
           break;
         case ROUND_FLOP:
            this.flop();
           break;
         case ROUND_TERN:
            this.tern();
            break;
         case ROUND_RIVER:
            this.river();
            break; 
         case ROUND_WIN:
            this.win();
            break;      
         default:
         console.log('break');
           // code block
       }    
   }
   preflop(){ 
      console.log('preflop');
      let is_cards_dealt = this.state.is_cards_dealt;
      let pot = this.state.pot;
      if (!this.state.is_cards_dealt){
         let queue = this.get_postflop_queue_ids_player(this.state.players);
         for (let i =0;i<queue.length;i++){
            this.state.players.get(queue[i]).setHand(this.state.deck.get_card(),this.state.deck.get_card());
         }
         this.state.players.forEach( (pl, key, map) => {
            if (pl.site.get_button() == SMALL_BUTTON){
                  let bet = pl.turn_down_money(this.state.cost_sb); 
                  pot+=bet;
                  this.build_pot_history(pl.id,bet);
            }else if (pl.site.get_button() == BIG_BUTTON){
               let bet = pl.turn_down_money(this.state.cost_bb); 
               pot+=bet;
               this.build_pot_history(pl.id,bet);                    
            }
         }); 
         is_cards_dealt=true;
      }

      if (this.state.queue_players.length > 0){
            console.log('preflop+');
            let current_player_id = this.state.queue_players.shift();
            let player = this.state.players.get(current_player_id);
            let bet = player.turn_down_money(1); 
            pot+=bet;
            this.build_pot_history(player.id,bet);
           
            this.state.players.forEach( (pl, key, map) => {
               if (pl.id == this.state.queue_players[0]){
                  pl.set_activ(true);
               }else{
                  pl.set_activ(false);
               }
            });

            // reset bb sb
            this.setState({
               pot:pot,
               is_cards_dealt:is_cards_dealt,
            });
         }else{
            console.log('out preflop');
            this.state.round.next();
            let queue = this.get_postflop_queue_ids_player(this.state.players);
            this.state.players.forEach( (pl, key, map) => {
            if (pl.id == queue[0] ){
               pl.set_activ(true);
            }else{
               pl.set_activ(false);
            }
            });
            this.setState({
               table_cards:[this.state.deck.get_card(),this.state.deck.get_card(),this.state.deck.get_card()], 
               queue_players:Object.assign([], queue),
            }); 
         }
   }
   flop(){
      console.log('flop');
      // сформировать новую очередь начиная с SB

      if (this.state.queue_players.length > 0){
          let current_player_id = this.state.queue_players.shift();
          let player = this.state.players.get(current_player_id);
          let bet = player.turn_down_money(1);
          this.build_pot_history(player.id,bet);
          
          this.state.players.forEach( (pl, key, map) => {
           if (pl.id == this.state.queue_players[0] ){
             pl.set_activ(true);
           }else{
              pl.set_activ(false);
           }
         });
         
         this.setState({
            pot:this.state.pot+bet,
         });
      }else{
           console.log('out flop');
           this.state.round.next();
           let queue = this.get_postflop_queue_ids_player(this.state.players);
           this.state.players.forEach( (pl, key, map) => {
              if (pl.id == queue[0] ){
                pl.set_activ(true);
              }else{
                 pl.set_activ(false);
              }
            });
           this.state.table_cards.push(this.state.deck.get_card());
           this.setState({
              queue_players:Object.assign([], queue),
           });
      }
   }
   tern(){
      console.log('tern');
      if (this.state.queue_players.length > 0){
         let current_player_id = this.state.queue_players.shift();
         let player = this.state.players.get(current_player_id);
         let bet = player.turn_down_money(1);   
         this.build_pot_history(player.id,bet);
         
         this.state.players.forEach( (pl, key, map) => {
           if (pl.id == this.state.queue_players[0] ){
             pl.set_activ(true);
           }else{
              pl.set_activ(false);
           }
         });

         this.setState({
            pot:this.state.pot+bet
         });
 
      }else{
         console.log('out tern');
         this.state.round.next();
         let queue = this.get_postflop_queue_ids_player(this.state.players);
         this.state.players.forEach( (pl, key, map) => {
            if (pl.id == queue[0] ){
               pl.set_activ(true);
            }else{
               pl.set_activ(false);
            }
         });         
         this.state.table_cards.push(this.state.deck.get_card());
         this.setState({
            queue_players:Object.assign([], queue)
         });
      }
   }
   river(){
      console.log('river');
      if (this.state.queue_players.length > 0){
          let current_player_id = this.state.queue_players.shift();
          let player = this.state.players.get(current_player_id);
          let bet = player.turn_down_money(2);   
          this.build_pot_history(player.id,bet);

          this.state.players.forEach( (pl, key, map) => {
           if (pl.id == this.state.queue_players[0] ){
             pl.set_activ(true);
           }else{
              pl.set_activ(false);
           }
         });

         this.setState({
            pot:this.state.pot+bet
         });
 
      }else{ 
         console.log('out river');
         this.state.round.next(); 
         let queue = this.get_postflop_queue_ids_player(this.state.players);
         this.state.players.forEach( (pl, key, map) => {
           pl.set_activ(false);
         });         
         this.setState({ 
            queue_players:Object.assign([], queue)
         });
      }
   }
   win(){
      console.log('win');
      if (this.state.pot > 0 ){
            let win_players = [];
            if (this.state.win_players.length==0 && this.state.table_cards.length == 5){
                  let manager = new this.mod_wasm.Menager(this.state.pot);
                  this.state.players.forEach( (pl, key, map) => {
                     let c1 = new this.mod_wasm.Card( pl.card1.nom, pl.card1.suit);
                     let c2 = new this.mod_wasm.Card( pl.card2.nom, pl.card2.suit);
                     let _c3 = this.state.table_cards[0];
                     let c3 = new this.mod_wasm.Card( _c3.nom, _c3.suit);
                     let _c4 = this.state.table_cards[1];
                     let c4 = new this.mod_wasm.Card( _c4.nom, _c4.suit);
                     let _c5 = this.state.table_cards[2];
                     let c5 = new this.mod_wasm.Card( _c5.nom, _c5.suit);
                     let _c6 = this.state.table_cards[3];
                     let c6 = new this.mod_wasm.Card( _c6.nom, _c6.suit);
                     let _c7 = this.state.table_cards[4];
                     let c7 = new this.mod_wasm.Card( _c7.nom, _c7.suit);
                     console.log(c1.show_card(),c2.show_card(),c3.show_card(),c4.show_card(),c5.show_card(),c6.show_card(),c7.show_card());
                     let hand = new this.mod_wasm.Hand(String(pl.id),pl.get_total_bet(),c1,c2,c3,c4,c5,c6,c7);
                     manager.add_hand(hand);
                  });

                  let wins = manager.calculate();
                  wins.forEach( (total, index, map) => {
                     console.log('win=',this.state.players.get(parseInt(total.get_player_id(), 10)).name, total.get_win_pot());
                     win_players.push(total);
                  });

                  this.state.players.forEach( (pl, key, map) => {
                     pl.set_activ(false);
                  });
            }else{
                win_players = this.state.win_players;
            }

             let win = win_players.shift();
             let combination_name = win.show_combination();
             
             let id_win_player = parseInt(win.get_player_id(), 10);
             this.state.players.get(id_win_player).add_money(win.get_win_pot());

             
             let key_range_group = win.key_range_group;
             let win_cards = win.show_cards();
           
             // всех победителей по очереди показывать и добавлять pot 

            this.setState({ 
              win_players:win_players,
              win_cards:win_cards,
              id_win_player:id_win_player,
              pot:this.state.pot-win.get_win_pot(),
              combination_name:combination_name,
              wait_step_game_circle:6000,
            });
      }else if(this.state.pot==0){
       /*
         sleep(2000).then(() => {   
            this.next_site_button();
            this.state.players.forEach( (pl, key, map) => {
               pl.resetHand();
               pl.reset_total_bet();
            });
            this.state.deck.new_deck();
            let queue = this.get_preflop_queue_ids_player(this.state.players);
            this.state.players.get(queue[0]).set_activ(true);
            this.state.round.next();
            this.setState({ 
              win_players:[], 
              win_cards:[],
              id_win_player:null,
              table_cards:[],
              pot:0,
              queue_players:Object.assign([], queue),
              combination_name:'',
              wait_step_game_circle:2000,
              is_cards_dealt:false,
              pot_history:new Map()
            });          
       });
       */
      }
   }
   build_pot_history(id,bet){
      // pot_history = Map(player.id,total_bet)
      if (!this.state.pot_history.has(id)){
         this.state.pot_history.set(id,bet);
      }else{
        let value = this.state.pot_history.get(id);
        this.state.pot_history.set(id,value+bet);
      }

   }

   calculate_pot(win_players){
      // 

      this.state.players.forEach( (pl, key, map) => {
        pl.get_total_bet();
       });
   }
   next_site_button(){
      this.state.players.forEach( (pl, key, map) => {
         if (pl.site.get_button() !== BIG_BUTTON ){
            pl.site.reset_button();
         }
      });
      this.state.players.forEach( (pl, key, map) => {
         if (pl.site.get_button() === BIG_BUTTON ){
            pl.site.set_sb();
         }
      });
      let first_players = false;
      let is_change = false;
      this.state.players.forEach( (pl, key, map) => {
         if (first_players && !is_change){
            pl.site.set_bb();
            is_change=true;
         }
         if (!first_players && pl.site.get_button() === SMALL_BUTTON ){
            first_players=true;
         }
      });
      if (!is_change){
         for(let player of this.state.players.values()) {
               player.site.set_bb();
               return;
         }
      }
   }
   get_postflop_queue_ids_player(players){
      // start with sb
      // построение очереди очень не еффективно!!!
      let queue_players = [];
      players.forEach( (pl, key, map) => {
         if (pl.site.get_button() === SMALL_BUTTON ){
           queue_players.push(pl.id);
         }
      });
      players.forEach( (pl, key, map) => {
         if (pl.site.get_button() === BIG_BUTTON ){
            queue_players.push(pl.id);
         }
      });

      // добавить всех кто после BB
      let first_players = false;
      players.forEach( (pl, key, map) => {
         if (first_players && pl.site.get_button() !== SMALL_BUTTON){
            queue_players.push(pl.id);
         }
         if (!first_players && pl.site.get_button() === BIG_BUTTON ){
            first_players=true;
         }
      });
      //добавить всех кто до SB
      let diff = players.size - queue_players.length;
      if (diff > 0){
         players.forEach( (pl, key, map) => {
           if (players.size > queue_players.length){
              queue_players.push(pl.id);
           }
         });
      }
     return queue_players;
   }

   get_preflop_queue_ids_player(players){
      let finish_round = false;
      let queue_players = [];

      // добавить всех кто после BB
      let first_players = false;
      let last_players = true;
      players.forEach( (pl, key, map) => {
         if (first_players && pl.site.get_button() !== SMALL_BUTTON){ 
            queue_players.push(pl.id);
         }
         if (pl.site.get_button() === BIG_BUTTON ){
            first_players=true;
         }
      });

     //добавить всех кто до SB
     let diff = players.size - queue_players.length;
     if (diff > 2){
        players.forEach( (pl, key, map) => {
          if (players.size > queue_players.length+2){
             queue_players.push(pl.id);
          }
        });
     }

      players.forEach( (pl, key, map) => {
            if (pl.site.get_button() === SMALL_BUTTON ){
              queue_players.push(pl.id);
            }
      });
      players.forEach( (pl, key, map) => {
         if (pl.site.get_button() === BIG_BUTTON ){
            queue_players.push(pl.id);
         }
      });
      return queue_players;
   }

   handleNext(e){
      if (this.state.start_game) {
         this.game_circle();
      }

      /*sleep(this.state.wait_step_game_circle).then(() => {   
         if (this.state.start_game) {
            this.game_circle();
         }
      });*/


   }

   getControlBtn(){
     return  <div className={styles.control_btn}>
          <div className="col-lg-12 text-center">
            <div className="row align-items-center">
               <div className="col-xs-4 align-self-center">
                  <div className="d-grid gap-3 d-md-block" aria-label="Basic example">
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn1.disabled} onClick={(e) => this.handleNext(e)}>CALL</button>
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn2.disabled} onClick={this.resetTimer}>FOLD</button>
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn3.disabled} onClick={this.resetTimer}>REISE</button>
                  </div>
               </div>
            </div>
         </div>
         <div className="row justify-content-md-center">
            <div className="col-3">
               <div className="input-group mb-3">
               <input className={'form-control'} type="range" min="0" max={this.state.max_range} step="1" id="customRange1" aria-describedby="button-addon2" onChange={(e) => this.handleChange(e)}></input>
               <button className="btn btn-outline-secondary gap-2 col-3 mx-auto" type="button" id="button-addon2" data-value={this.value_range} onClick={(e) => this.handleSet(e)}>
                  {this.value_range}
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
      if (player == null){
         return '';
      }

      let is_card = true;
      
      if (player.card1==null){
         is_card=false;
      }

      let activ_player = '';
      if (player.is_activ()){
         activ_player = styles.activ_player;
      }
      let win_player = '';
      if (this.state.id_win_player == player.id){
         win_player = styles.win_player;
      }

      return <React.Fragment> 
                  <div className={styles.box_card+' '+win_player}> 
                    {is_card && <React.Fragment>  
                     <Image key={player.card1.key}
                        className={styles.img} 
                        src={this.build_url(player.card1.key)} 
                        height={65} width={40} 
                        quality={100} 
                        priority={true}
                        layout="raw"
                        alt=""/>
                        <Image key={player.card2.key}
                        className={styles.img} 
                        src={this.build_url(player.card2.key)} 
                        height={65} 
                        width={40} 
                        quality={100} 
                        priority={true}
                        layout="raw"
                        alt=""/>    
                        </React.Fragment> 
                      }
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
                        <div key={String(player.money)+player.name} className={ styles.money_info}>{player.money}</div>
                     </div>
                  </div> 
                  <div className={player.site.style.place_chips+' '+styles.chips_place_all}>
                    {this.getPlayerChips(player)}
                  </div>
                  {this.getButton(player)}
                 
               </React.Fragment> 
   }
   print_action(action){
      switch (action){
         case CALL:return "CALL";
         case REISE:return "REISE";
         case FOLD:return "FOLD";
         case ALL_IN:return "ALL_IN";
         default:return '';
      }
   }
   chank_pot(total_bets){
      //  console.log('result',chank_pot([100,300,400,500]));
      let result = []; 
      const sum = total_bets.reduce((prev, cur) => prev + cur,0);
      let current_sum = 0;
      let chank_pot = 0;
      let min = 0;
      while (current_sum < sum){
           chank_pot=0;
           min = total_bets.reduce((prev, cur) => { 
                      if(prev>cur){return cur;} return prev; 
                  },total_bets[0]);
           total_bets = total_bets
                          .map((e)=>{ 
                               current_sum+=min;
                               chank_pot+=min;
                               e-=min; 
                               return e;
                          }).filter((e)=>e>0);
          result.push(chank_pot);
      }
      return result;
  }
 
   getPlayerChips(player){
      let res = [];
      this.chipsDestruct(player.money).map(
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

   chipsDestruct(value){
      let ret = new Array();

      if (value > 99999){
         ret.push(value-value%100000);
         value=value%100000;
      }
      if (value > 9999){
         ret.push(value-value%10000);
         value=value%10000;
      }
      if (value > 999){
         ret.push(value-value%1000);
         value=value%1000;
      }
      if (value > 99){
         ret.push(value-value%100);
         value=value%100;
      }
      if (value > 9){
         ret.push(value-value%10);
         value=value%10;
      }
      if (value > 0){
         ret.push(value);
      }
      return ret;
   }

   getTotalImageChips(value){
      let res = [];
      this.chipsDestruct(value).map((money)=>res.push( 
         <Image key={money} className={styles.chips_total_item+' rounded'} 
         src={this.build_chips_url(money)} 
         layout="raw" 
         height={70} 
         width={70} 
         alt=""/>));
     return <React.Fragment> <div className="text-center"> {res} </div> </React.Fragment>  
   }

   getTableCard(){
      // TODO: заменить на раздачу по этапам, карты хранить в состоянии
      let result = [];
      if (this.state.round.current() > ROUND_PREFLOP){
        // console.log("this.state.win_cards=",this.state.win_cards);
         for(var i=0; i < this.state.table_cards.length; i++){  
           // console.log("Debug table card=",this.state.table_cards[i].key);
   
            let win = '';
            if (this.state.win_cards.length >0){
               for (let y=0; y < this.state.win_cards.length; y++){
                  if (this.state.win_cards[y]==this.state.table_cards[i].key){
                    // console.log(this.state.win_cards[y],'=',this.state.table_cards[i].key)
                     win = styles.win_card;
                     break;
                  } 
               }
            }

            result.push(
                  <div key={this.state.table_cards[i].key+' '+win+' '+(Math.round(Math.random()*100))*1000/**/} className={styles.table_cards_item}>
                     <Image className={styles.img+' '+win} src={this.build_url(this.state.table_cards[i].key)} priority={true} layout="raw" height={65} width={40} alt=""/>
                  </div>
            );
         }
      }

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
       //Table.count_render++;
       //console.log('render client=',Table.count_render);
       
       /*
         // (Math.round(Math.random()*1)+3)*1000
         sleep(this.state.wait_step_game_circle).then(() => {   
            if (this.state.start_game) {
               this.game_circle();
            }
         });
       */

      return  !this.state.start_game ?  
         <Layout> 
           <div className={styles.pokertable}>
             <button className={"btn btn-secondary btn-outline-dark btn-lg "+styles.start_game_btn} type="button" onClick={this.start_game_test}>Open table {this.props.count}</button>
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

            <div  className={styles.table_pot}>
                  <p className="text-center fw-bold fs-3">{this.state.pot>0?this.state.pot:''}</p>
            </div>

            <div className={styles.table_cards}>
                  <div className={styles.divtest}>{this.getTableCard()} </div>
                  <div className={styles.combination_name}>{this.state.combination_name}</div>
                  <div  className={styles.total_chips}>
                        {this.getTotalImageChips(this.state.pot)}
                  </div>
            </div>
         </div>
         {this.getControlBtn()}
      </Layout>
 }

}
 
 