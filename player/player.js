import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {Card,cardSuits,cardNom} from '../cards/deck'

export default class Player {
    #id;
    #name; 
    #card1;
    #card2;
    style_place='';

    constructor(id,name,place) {
      this.#id=id;
      this.#name=name;
      this.#card1={};
      this.#card2={};
      this.style_place=place;

      this.gggid = this.gggid.bind(this);
    }

    get id(){
       return this.#id;
    }
    gggid(){
      return this.#id;
    }
    get name(){
       return this.#name;
    }

    build_url(card) {
      let url = "/images/q/";
      url = url.concat(card.key);
      url = url.concat(".png");
      return url;
    }
    
    setHand(card1,card2){
       this.#card1=card1;
       this.#card2=card2;
    }
    resetHand(){
       this.#card1=null;
       this.#card2=null;
    }
    getCard1(){
       return  this.#card1;
    }
    getCard2(){
      return  this.#card2;
   }
   toString(){
      return String("Hello");
   }
}
 