import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Card,cardSuits,cardNom} from '../cards/deck'

const CALL = 0;
const REISE = 1;
const FOLD = 2;
const ALL_IN = 3;

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
      this.#_show_action=CALL;
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
    get money(){
      return this.#_money;
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
 