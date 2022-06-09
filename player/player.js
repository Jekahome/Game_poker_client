import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Card,cardSuits,cardNom} from '../cards/deck'

export default class Player {
    #_id;
    #_name; 
    #_card1;
    #_card2;
    #_site={};
    #_money=0;

    constructor(id,name,money,site) {
      this.#_id=id;
      this.#_name=name;
      this.#_card1={};
      this.#_card2={};
      this.#_site=site;
      this.#_money=money;
    }
    get id(){
       return this.#_id;
    }
    get name(){
       return this.#_name;
    }
    get site(){
      return this.#_site;
    }
    get money(){
      return this.#_money;
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
 