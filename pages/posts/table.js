import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'
import styles from '../../assets/table/table.module.css'
import {Card,Deck,cardSuits,cardNom} from '../../cards/deck'
import Player from '../../player/player'
import Site from '../../site'
 

// Rout: /posts/table

// ВАЖНО при вызове SetState вызывается функция render() заново, поэтому в ней должны быть статические данные!!!

 export default class Table extends React.Component {
   #players;
   #_table_cards = [];

   static count_render=1;
  
   componentDidMount() {
      // после того, как компонент отрендерился в DOM 
       
      (async () => {  
         // Dynamically load
         this.mod_wasm = (await import('../../pkg/'))
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
         manager.add(hand);
         let res = manager.calculate_wasm();
         for(var i=0; i<res.length; i++){
            console.log(res[i].key_range,res[i].combination);
            for (let c of res[i].get_cards()){
               let card = c.get();
               console.log("Card:",card.n,card.m);
            }
         }
         */

       }).bind(this)();
    }

   constructor(props) {
     super(props);
     this.mod_wasm = props.mod_wasm;

     this.state = { 
        control:{btn1:{disabled:""},btn2:{disabled:""},btn3:{disabled:"disabled"}},
        value_range:10,max_range:100,
        pot:0
      };// только в конструкторе можно присвоить состояние через =
     
     this.value_range=10;
     this.getControlBtn = this.getControlBtn.bind(this);
     this.getPlayers = this.getPlayers.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleSet = this.handleSet.bind(this);
     
     this.deck = new Deck();
     this.#players = new Map();
     this.#_table_cards = [];

      let p = new Player(1,"petr",934567,new Site({position:1,place_chips:styles.place1_chips}));
      p.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p.id,p);       
     
      let p2 = new Player(2,"kek",934567,new Site({position:2,place_chips:styles.place2_chips}));
      p2.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p2.id,p2); 
     
      let p3 = new Player(3,"ivan",934567,new Site({position:3,place_chips:styles.place3_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);     
       
     {
      let p3 = new Player(4,"ivan4",934567,new Site({position:4,place_chips:styles.place4_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(5,"ivan5",934567,new Site({position:5,place_chips:styles.place5_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(6,"ivan6",934567,new Site({position:6,place_chips:styles.place6_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(7,"ivan7",934567,new Site({position:7,place_chips:styles.place7_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(8,"ivan8",934567,new Site({position:8,place_chips:styles.place8_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(9,"ivan9",934567,new Site({position:9,place_chips:styles.place9_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(10,"ivannnnn10",934567,new Site({position:10,place_chips:styles.place10_chips}));
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);    
     }
      
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

     // use this.mod_wasm
        /*
         let c1 = new this.mod_wasm.Card(1,100);
         let c2 = new this.mod_wasm.Card(2,100);
         let c3 = new this.mod_wasm.Card(4,100);
         let c4 = new this.mod_wasm.Card(8,100);
         let c5 = new this.mod_wasm.Card(16,100);
         let c6 = new this.mod_wasm.Card(2048,10);
         let c7 = new this.mod_wasm.Card(4096,10);
         let hand = new this.mod_wasm.Hand("flash1",c1,c2,c3,c4,c5,c6,c7);
      
         let manager = new this.mod_wasm.Menager();
         manager.add(hand);
         let res = manager.calculate_wasm();
         for(var i=0; i<res.length; i++){
            console.log(res[i].key_range,res[i].combination);
            for (let c of res[i].get_cards()){
               let card = c.get();
               console.log(">>>Card<<<:",card.n,card.m);
            }
         }
       */

         let manager = new this.mod_wasm.Menager();
         this.#players.forEach( (pl, key, map) => {
              
             let c1 = new this.mod_wasm.Card( pl.card1.nom, pl.card1.suit);
             let c2 = new this.mod_wasm.Card( pl.card2.nom, pl.card2.suit);

             let _c3 = this.#_table_cards[0];
             let c3 = new this.mod_wasm.Card( _c3.nom, _c3.suit);

             let _c4 = this.#_table_cards[1];
             let c4 = new this.mod_wasm.Card( _c4.nom, _c4.suit);

             let _c5 = this.#_table_cards[2];
             let c5 = new this.mod_wasm.Card( _c5.nom, _c5.suit);

             let _c6 = this.#_table_cards[3];
             let c6 = new this.mod_wasm.Card( _c6.nom, _c6.suit);

             let _c7 = this.#_table_cards[4];
             let c7 = new this.mod_wasm.Card( _c7.nom, _c7.suit);

             let hand = new this.mod_wasm.Hand(String(pl.id),c1,c2,c3,c4,c5,c6,c7);
             manager.add(hand);
        });
         let res = manager.calculate_wasm();
         for(var i=0; i<res.length; i++){
            console.log(res[i].key_range,res[i].combination);
            for (let c of res[i].get_cards()){
               let card = c.get();
               console.log(">>>Card<<<:",card.n,card.m);
            }
         }
         //---------------
   }

   handleSet(event){
      event.preventDefault();
      console.log(event.target.dataset.value);
      this.setState({pot: this.state.pot+Number(event.target.dataset.value)});
   }

   getControlBtn(){
     return  <div className={styles.control_btn}>
          <div className="col-lg-12 text-center">
            <div className="row align-items-center">
               <div className="col-xs-4 align-self-center">
                  <div className="d-grid gap-3 d-md-block" aria-label="Basic example">
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn1.disabled} onClick={this.resetTimer}>CALL</button>
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn2.disabled} onClick={this.resetTimer}>FOLD</button>
                     <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn3.disabled} onClick={this.resetTimer}>REISE</button>
                  </div>
               </div>
            </div>
         </div>
         <div className="row justify-content-md-center">
            <div className="col-3">
               <div className="input-group mb-3">
               <input className={'form-control'} type="range" min="0" max={this.state.max_range} step="1" /*value={this.value_range this.state.value_range}*/ id="customRange1" aria-describedby="button-addon2" onChange={(e) => this.handleChange(e)}></input>
               <button className="btn btn-outline-secondary gap-2 col-3 mx-auto" type="button" id="button-addon2" data-value={this.value_range} onClick={(e) => this.handleSet(e)}>
                  {this.value_range /*this.state.value_range*/}
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

   getSite(site){
      let player = null;
      let is_find=false;
      this.#players.forEach( (pl, key, map) => {
          if (is_find==false && (pl.site && pl.site.style.position == site)){
            player=pl;
            is_find=true;
          }
      });
      if (player==null){
         return '';
      }

      let is_card = true;
      if (player.site.style.position > 6){
         is_card=false;
        
      }
      return <React.Fragment> 

                  <div key={'box_card'} className={styles.box_card}> 
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
                  <div key={'inform_tablo_l'} className={styles.inform_tablo_l}>
                     <Image 
                        src={player.build_picture_url()} 
                        className={styles.round_l} 
                        height={54} 
                        width={54} 
                        quality={100} 
                        priority={true}
                        layout="raw"
                        alt=""/>
                     <div key={'name_money_info'} className={styles.name_money_info}>
                        <div key={'name_info'} className={styles.name_info}>{player.name}</div>
                        <div key={'money_info'} className={ styles.money_info}>{player.money}</div>
                     </div>
                  </div> 
                  <div className={player.site.style.place_chips}>
                    {this.getPlayerChips(player)}
                  </div>
               </React.Fragment> 
   }

   getPlayerChips(player){
      let res = [];
      this.chipsDestruct(player.money).map(
         (money)=>res.push(
                 <Image key={money} className={'rounded'} src={this.build_chips_url(money)} priority={true} layout="raw" height={40} width={40} alt=""/>
             ));
     return <React.Fragment> {res} </React.Fragment>  
   }

   getPlayers(){
      let res = [];
      this.#players.forEach( (player, key, map) => {
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

   getImageChips(value){
      let res = [];
      this.chipsDestruct(value).map((money)=>res.push( 
         <Image key={money} className={styles.chips+' rounded'} 
         src={this.build_chips_url(money)} 
         priority={true} 
         layout="raw" 
         height={70} 
         width={70} 
         alt=""/>));
     return <React.Fragment> <div className="text-center"> {res} </div> </React.Fragment>  
   }

   getTableCard(){
      // TODO: заменить на раздачу по этапам, карты хранить в состоянии
      this.#_table_cards = [];
      this.#_table_cards.push(this.deck.get_card());
      this.#_table_cards.push(this.deck.get_card());
      this.#_table_cards.push(this.deck.get_card());
      this.#_table_cards.push(this.deck.get_card());
      this.#_table_cards.push(this.deck.get_card());

      let result = [];
      for(var i=0; i<this.#_table_cards.length; i++){  
          result.push(
               <div key={'table_card'+i} className={styles.table_cards_item}>
                   <Image className={styles.img} src={this.build_url(this.#_table_cards[i].key)} priority={true} layout="raw" height={65} width={40} alt=""/>
               </div>
          );
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
console.log('count_render=',Table.count_render++);
return (
   <React.Fragment>
     
      <Layout>
         <div className={styles.pokertable}>

            <div key={'place1'} className={styles.place1}> {this.getSite(1)} </div> 
            <div key={'place2'} className={styles.place2}> {this.getSite(2)} </div> 
            <div key={'place3'} className={styles.place3}> {this.getSite(3)} </div> 
            <div key={'place4'} className={styles.place4}> {this.getSite(4)} </div> 
            <div key={'place5'} className={styles.place5}> {this.getSite(5)} </div> 
            <div key={'place6'} className={styles.place6}> {this.getSite(6)} </div> 
            <div key={'place7'} className={styles.place7}> {this.getSite(7)} </div> 
            <div key={'place8'} className={styles.place8}> {this.getSite(8)} </div> 
            <div key={'place9'} className={styles.place9}> {this.getSite(9)} </div> 
            <div key={'place10'}  className={styles.place10}> {this.getSite(10)} </div> 

            <div  className={styles.table_pot}>
                  <p className="text-center fw-bold fs-3">{this.state.pot}</p>
            </div>

            <div className={styles.table_cards}>
                   {this.getTableCard()}

                  <div  className={styles.total_chips}>
                        {this.getImageChips(this.state.pot)}
                  </div>
            </div>
            
         </div>
         {this.getControlBtn()}
      </Layout>
   </React.Fragment>
 );
   }
}
 
 