import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Card,cardSuits,cardNom} from '../cards/deck'

const CALL = 0;
const BET = 1;
const REISE = 2;
const FOLD = 3;
const ALL_IN = 4;
const CHECK = 5;


export default class Player {
    #_id;
    #_name; 
    #_card1;
    #_card2;
    #_site={};
    #_money=0;
    #_activ=false;
    #_total_bet=0;
    #_show_action;
    constructor(id,name,money,site) {
      this.#_id=id;
      this.#_name=name;
      this.#_card1=null;
      this.#_card2=null;
      this.#_site=site;
      this.#_money=money;
      this.#_total_bet=0;
      this.#_show_action=null;
    }
    get id(){
       return this.#_id;
    }
    get name(){
       return this.#_name;
    }
    get action(){
      return this.#_show_action;
    }
    get site(){
      return this.#_site;
    }
    is_activ(){
       return this.#_activ;
    }
    set_activ(value){
       this.#_activ=value;
    }
    get action(){
      return this.#_show_action;
    }
    set action(action){
      // if(this.id == 1)console.log('set action',action);
      this.#_show_action=action;
    }
    player_action(obj_action){
     // if(this.id == 1)console.log('Player player_action',obj_action);
       // call fold reise bet
       // call на предыдущую ставку
       let action = FOLD;
       let max_bet = obj_action.max_bet;
       let choice = Math.round(Math.random()*1);// 3
      
      /* if(this.id == 5 || this.id == 9){
          choice=1;
       }else if(this.id==7 || this.id == 2){
          choice=3;
       }else{
          choice=0;
       }*/
      // if(this.id == 4){ choice=2;} 
     //  else {choice=0;}
     choice=0;

       switch (choice){
          case 0:{
            // for CALL / CHECK
            if(this.get_total_bet()==max_bet){
               console.log(this.get_total_bet(),'==',max_bet);
               this.action = CHECK;
               return {action:this.action,bet:this.get_total_bet()};
            }else if(this.money > max_bet-this.get_total_bet()){
               this.turn_down_money(max_bet-this.get_total_bet());
               this.action = CALL;
               return {action:this.action,bet:this.get_total_bet()};
            }else if(this.money <= max_bet-this.get_total_bet()){
               this.turn_down_money(max_bet-this.get_total_bet());
               this.action = ALL_IN;
               return {action:this.action,bet:this.get_total_bet()};
            }
          }
          break;
          case 1:{
             // for REISE x2
            if(this.money > (max_bet-this.get_total_bet())*2){
               this.turn_down_money(max_bet*2-this.get_total_bet());
               this.action = REISE;
               return {action:this.action,bet:this.get_total_bet()};
            }else if(this.money <= (max_bet*2-this.get_total_bet())){
               this.turn_down_money(this.money);
               this.action = ALL_IN;
               return {action:this.action,bet:this.get_total_bet()};
            }
          }
          break;
          case 2:{
               // for ALL_IN
               this.turn_down_money(this.money);
               this.action = ALL_IN;
               return {action:this.action,bet:this.get_total_bet()};
          }
          break;
          case 3:{
               // for FOLD
               this.action = FOLD;
               return {action:this.action,bet:0};
          }
          break;
          default:
          console.log('WTF');
       }

       
       return null;
    }
    get money(){
      return this.#_money;
    }
    change(money){
      this.#_money+=money;
      this.#_total_bet-=money;
    }
    turn_down_money(m){
       if (this.#_money < m){
          let ret = this.#_money;
          this.#_total_bet+=ret;
          this.#_money=0;
         return ret;
       }else{
         this.#_money-=m;
         this.#_total_bet+=m;
         return m;
       }
    }
    add_money(m){
      this.#_money+=m;
    }
    get_total_bet(){
       return this.#_total_bet;
    }
    reset_total_bet(){
       this.#_total_bet=0;
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
    setHand(card1,card2){
       this.#_card1=card1;
       this.#_card2=card2;
       this.#_total_bet=0;
    }
    resetHand(){
       this.#_card1=null;
       this.#_card2=null;
    }
    get card1(){
       return this.#_card1;
    }
    get card2(){
      return this.#_card2;
   }
}
 