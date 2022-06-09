 /*
    Старшая карта — High card
    Пара — Pair (pair of kings)
    Две пары — Two pairs
    Тройка — Three of a kind
    Стрит — Straight (произносится как «стрейт» и происходит от слова «прямой», а не от слова «улица»)
    Флеш — Flush (произносится как «флаш», происходит от слова «краска», и никак не связано с молнией и Флешем из комиксов)
    Фулл-Хаус — Full House (тройка и пара, причем при обозначении комбинации первой называют тройку)
    Каре — Four of a kind
    Стрит флеш — Straight flush (стрит, где все карты одной масти)
    Роял флеш — Royal flush (королевский флаш — в нем складывается стрейт одной масти от десятки до туза)
*/
'use strict';

class Card{
    #_id = 0;
    #_key = "";
    #_suits=0; 
    #_nom=0;  
    
    constructor(id=0,key="",suit=0, nom=0){
        this.#_id = id;
        this.#_key = key;
        this.#_suits = suit;
        this.#_nom = nom;
    }
    get id(){
        return this.#_id;
    }
    get key(){
        return this.#_key;
    }
    get nom(){
        return this.#_nom;
    }
    get suit(){
        return this.#_suits;
    }
}
const cardSuits = {
  Spades:1,//'Spades'/*Пики*/  
  Hearts:10,//'Hearts',/*Черви*/
  Diamonds:100,//'Diamonds',/*Бубы*/
  Clubs:1000,//'Clubs',/*Трефы*/
};
const cardNom = {
  Two:1,//'Two', 
  Three:2,//'Three', 
  Four:4,//'Four', 
  Five:8,//'Five',
  Six:16,//'Six', 
  Seven:32,//'Seven',
  Eight:64,//'Eight',
  Nine:128,//'Nine',
  Ten:256,//'Ten',
  Jack:512,//'Jack',
  Queen:1024,//'Queen',
  King:2048,//'King',
  Ace:4096//'Ace'
};

class Deck{
    #raw_cards={}; 
    #cards = {};
    constructor(){
       this.#raw_cards = new Array();
       this.#cards = new Map();
       this.#load(); 
    }
    get_card(){
        if (this.#cards.size > 1) {
            let ret = null; 
            let is_fined = false;
            while(!is_fined){
                let id = Math.round(Math.random()*52+1 ); 
                if (this.#cards.has(id)==true){
                    ret = this.#cards.get(id);
                    this.#cards.delete(id);
                    is_fined=true;
                }
            }
            return ret;
        } else if (this.#cards.size == 1){
            const iter = this.#cards.keys();
            let id = iter.next().value;
            if (!this.#cards.has(id)){ 
                return null;
            }
            let ret = this.#cards.get(id);
            this.#cards.delete(id);
            this.#cards.clear();
            return ret;
        }else{ 
            return null; 
        }
     }
   
    new_deck(){ 
        this.#cards.clear();
        for (let v of this.#raw_cards) {
            this.#cards.set(v.id, v);
        }
    }
    #load(){ 
        this.#raw_cards.push(new Card( 1,"2d",cardSuits.Diamonds,cardNom.Two ));
        this.#raw_cards.push(new Card( 2,"2h",cardSuits.Hearts,cardNom.Two ));
        this.#raw_cards.push(new Card( 3,"2c",cardSuits.Clubs,cardNom.Two));
        this.#raw_cards.push(new Card( 4,"2s",cardSuits.Spades,cardNom.Two ));
        this.#raw_cards.push(new Card( 5,"3d",cardSuits.Diamonds,cardNom.Three ));
        this.#raw_cards.push(new Card( 6,"3h",cardSuits.Hearts,cardNom.Three ));
        this.#raw_cards.push(new Card( 7,"3c",cardSuits.Clubs,cardNom.Three ));
        this.#raw_cards.push(new Card( 8,"3s",cardSuits.Spades,cardNom.Three ));
        this.#raw_cards.push(new Card( 9,"4d",cardSuits.Diamonds,cardNom.Four ));
        this.#raw_cards.push(new Card( 10,"4h",cardSuits.Hearts,cardNom.Four ));
        this.#raw_cards.push(new Card( 11,"4c",cardSuits.Clubs,cardNom.Four ));
        this.#raw_cards.push(new Card( 12,"4s",cardSuits.Spades,cardNom.Four ));
        this.#raw_cards.push(new Card( 13,"5d",cardSuits.Diamonds,cardNom.Five ));
        this.#raw_cards.push(new Card( 14,"5h",cardSuits.Hearts,cardNom.Five ));
        this.#raw_cards.push(new Card( 15,"5c",cardSuits.Clubs,cardNom.Five ));
        this.#raw_cards.push(new Card( 16,"5s",cardSuits.Spades,cardNom.Five ));
        this.#raw_cards.push(new Card( 17,"6d",cardSuits.Diamonds,cardNom.Six ));
        this.#raw_cards.push(new Card( 18,"6h",cardSuits.Hearts,cardNom.Six ));
        this.#raw_cards.push(new Card( 19,"6c",cardSuits.Clubs,cardNom.Six ));
        this.#raw_cards.push(new Card( 20,"6s",cardSuits.Spades,cardNom.Six ));
        this.#raw_cards.push(new Card( 21,"7d",cardSuits.Diamonds,cardNom.Seven ));
        this.#raw_cards.push(new Card( 22,"7h",cardSuits.Hearts,cardNom.Seven));
        this.#raw_cards.push(new Card( 23,"7c",cardSuits.Clubs,cardNom.Seven ));
        this.#raw_cards.push(new Card( 24,"7s",cardSuits.Spades,cardNom.Seven));
        this.#raw_cards.push(new Card( 25,"8d",cardSuits.Diamonds,cardNom.Eight));
        this.#raw_cards.push(new Card( 26,"8h",cardSuits.Hearts,cardNom.Eight ));
        this.#raw_cards.push(new Card( 27,"8c",cardSuits.Clubs,cardNom.Eight ));
        this.#raw_cards.push(new Card( 28,"8s",cardSuits.Spades,cardNom.Eight));
        this.#raw_cards.push(new Card( 29,"9d",cardSuits.Diamonds,cardNom.Nine ));
        this.#raw_cards.push(new Card( 30,"9h",cardSuits.Hearts,cardNom.Nine ));
        this.#raw_cards.push(new Card( 31,"9c",cardSuits.Clubs,cardNom.Nine ));
        this.#raw_cards.push(new Card( 32,"9s",cardSuits.Spades,cardNom.Nine ));
        this.#raw_cards.push(new Card( 33,"10d",cardSuits.Diamonds,cardNom.Ten));
        this.#raw_cards.push(new Card( 34,"10h",cardSuits.Hearts,cardNom.Ten ));
        this.#raw_cards.push(new Card( 35,"10c",cardSuits.Clubs,cardNom.Ten ));
        this.#raw_cards.push(new Card( 36,"10s",cardSuits.Spades,cardNom.Ten ));
        this.#raw_cards.push(new Card( 37,"jd",cardSuits.Diamonds,cardNom.Jack ));
        this.#raw_cards.push(new Card( 38,"jh",cardSuits.Hearts,cardNom.Jack ));
        this.#raw_cards.push(new Card( 39,"jc",cardSuits.Clubs,cardNom.Jack ));
        this.#raw_cards.push(new Card( 40,"js",cardSuits.Spades,cardNom.Jack ));
        this.#raw_cards.push(new Card( 41,"qd",cardSuits.Diamonds,cardNom.Queen ));
        this.#raw_cards.push(new Card( 42,"qh",cardSuits.Hearts,cardNom.Queen ));
        this.#raw_cards.push(new Card( 43,"qc",cardSuits.Clubs,cardNom.Queen ));
        this.#raw_cards.push(new Card( 44,"qs",cardSuits.Spades,cardNom.Queen ));
        this.#raw_cards.push(new Card( 45,"kd",cardSuits.Diamonds,cardNom.King));
        this.#raw_cards.push(new Card( 46,"kh",cardSuits.Hearts,cardNom.King ));
        this.#raw_cards.push(new Card( 47,"kc",cardSuits.Clubs,cardNom.King ));
        this.#raw_cards.push(new Card( 48,"ks",cardSuits.Spades,cardNom.King ));
        this.#raw_cards.push(new Card( 49,"ad",cardSuits.Diamonds,cardNom.Ace ));
        this.#raw_cards.push(new Card( 50,"ah",cardSuits.Hearts,cardNom.Ace ));
        this.#raw_cards.push(new Card( 51,"ac",cardSuits.Clubs,cardNom.Ace));
        this.#raw_cards.push(new Card( 52,"as",cardSuits.Spades,cardNom.Ace ));
        this.new_deck();
    }  
}
export {Card,Deck,cardSuits,cardNom};
export default Deck;

/*
 let cards = new Cards();
for (let i=0;i<51;i++){
     cards.get_card();
 }
  console.log( cards.map );  
 console.log( cards.get_card() ); 
 */