import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'
import styles from '../../assets/table/table.module.css'
import {Card,Deck,cardSuits,cardNom} from '../../cards/deck'
import Player from '../../player/player'
import Site from '../../site'
import profilePic from '../../public/images/q/2h.png'


// Rout: /game/table

// ВАЖНО при вызове SetState вызывается функция render() заново, поэтому в ней должны быть статические данные!!!
  var c = 0;
  export async function getServerSideProps(ctx){ 
     // JSON.parse(JSON.stringify(result))  
     c++;
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
            manager.add(hand);
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


      let deck = new Deck();
      let players = new Map();
      let table_cards = [];
      table_cards.push(deck.get_card());
      table_cards.push(deck.get_card());
      table_cards.push(deck.get_card());
      table_cards.push(deck.get_card());
      table_cards.push(deck.get_card());

      let p = new Player(1,"petr",934567,new Site({position:1,place_chips:styles.place1_chips}));
      p.setHand(deck.get_card(),deck.get_card());
      players.set(p.id,p);


      let p2 = new Player(2,"kek",934567,new Site({position:2,place_chips:styles.place2_chips}));
      p2.setHand(deck.get_card(),deck.get_card());
      players.set(p2.id,p2); 
     
      let p3 = new Player(3,"ivan",934567,new Site({position:3,place_chips:styles.place3_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);     
     {
      let p3 = new Player(4,"ivan4",934567,new Site({position:4,place_chips:styles.place4_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(5,"ivan5",934567,new Site({position:5,place_chips:styles.place5_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(6,"ivan6",934567,new Site({position:6,place_chips:styles.place6_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(7,"ivan7",934567,new Site({position:7,place_chips:styles.place7_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(8,"ivan8",934567,new Site({position:8,place_chips:styles.place8_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(9,"ivan9",934567,new Site({position:9,place_chips:styles.place9_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }
     {
      let p3 = new Player(10,"ivannnnn10",934567,new Site({position:10,place_chips:styles.place10_chips}));
      p3.setHand(deck.get_card(),deck.get_card());
      players.set(p3.id,p3);    
     }

      this.setState({
         control:{btn1:{disabled:""},btn2:{disabled:""},btn3:{disabled:"disabled"}},
         value_range:10,
         max_range:100,
         pot:0,
         players:new Map(players),
         table_cards:Object.assign([], table_cards),
         deck:deck
      });
   }

  // static async getInitialProps(ctx) {return {value:0} }

   constructor(props) {
     super(props);
     console.log("constructor");
     
     this.state={is_render:true};
     this.getControlBtn = this.getControlBtn.bind(this);
     this.getPlayers = this.getPlayers.bind(this);
     this.handleChange = this.handleChange.bind(this);
     this.handleSet = this.handleSet.bind(this);
     this.load = this.load.bind(this);
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
             manager.add(hand);
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
   load(event){
      this.setState({is_render:false});
     
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
      this.state.players.forEach( (pl, key, map) => {
          if (is_find==false && (pl.site && pl.site.style.position == site)){
            player=pl;
            is_find=true;
          }
      });
      if (player==null){
         return '';
      }

      let is_card = true;
      
      /*if (player.site.style.position==1){
         is_card=false;
      }*/
      
   
      return <React.Fragment> 

                  <div key={player.card1.key+player.card2.key} className={styles.box_card}> 
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
                  <div key={player.money} className={styles.inform_tablo_l}>
                     <Image key={player.build_picture_url()}
                        src={player.build_picture_url()} 
                        className={styles.round_l} 
                        height={54} 
                        width={54} 
                        quality={100} 
                        priority={true}
                        layout="raw"
                        alt=""/>
                     <div key={player.money} className={styles.name_money_info}>
                        <div key={player.name} className={styles.name_info}>{player.name}</div>
                        <div key={player.money} className={ styles.money_info}>{player.money}</div>
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
      let result = [];
      for(var i=0; i< this.state.table_cards.length; i++){  
         //console.log("Debug table card=",this.state.table_cards[i].key);
          result.push(
               <div key={this.state.table_cards[i].key} className={styles.table_cards_item}>
                   <Image key={this.state.table_cards[i].key} className={styles.img} src={this.build_url(this.state.table_cards[i].key)} priority={true} layout="raw" height={65} width={40} alt=""/>
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
       Table.count_render++;
console.log('render=',Table.count_render,'count server=',this.props.count);
 
return  this.state.is_render ?   <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" onClick={this.load}>Load{this.props.count}</button> : <Layout>
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
 }

 /*static getDerivedStateFromProps(props, state){
    return null;
 }*/
 /*shouldComponentUpdate(nextProps) {
    console.log('shouldComponentUpdate',this.props.showNav);
    return  !(nextProps.showNav === this.props.showNav)
 }
 componentDidUpdate(){
   console.log('componentDidUpdate');
 }
 */
 componentWillUnmount(){
   console.log('componentWillUnmount',Table.count_didmount);
 }
 /*shouldComponentUpdate(){
   return false;
 }*/
}
 
 