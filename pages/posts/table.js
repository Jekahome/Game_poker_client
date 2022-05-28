import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'
import styles from '../../assets/table/table.module.css'
import {Card,Deck,cardSuits,cardNom} from '../../cards/deck'
import Player from '../../player/player'
// Rout: /posts/table

// ВАЖНО при вызове SetState вызывается функция render() заново, поэтому в ней должны быть статические данные!!!


// В производстве запускается getStaticProps только на этапе сборки
// запускать только на стороне сервера и никогда не запускать на стороне клиента.
export async function getServerSideProps() {

   // Get external data from the file system, API, DB, etc.
   const data = {k1:"2K",k2:"JB"};
 
   // The value of the `props` key will be
   //  passed to the `Home` component
   return {
     props: {data}
   }
   // const res = await fetch('..')
   // return res.json()
 }

 export default class Table extends React.Component {
   #players;

   constructor(props) {
     super(props);
     this.state = {
        control:{btn1:{disabled:""},btn2:{disabled:""},btn3:{disabled:"disabled"}}};// только в конструкторе можно присвоить состояние через =

     this.getControlBtn = this.getControlBtn.bind(this);
     this.getPlayers = this.getPlayers.bind(this);

     this.deck = new Deck();
     this.#players = new Map();

     
      let p = new Player(1,"petr",styles.test_tablo);
      p.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p.id,p);       
     /*
      let p2 = new Player(2,"kek",styles.place2);
      p2.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p2.id,p2); 
     
      let p3 = new Player(3,"ivan",styles.place6);
      p3.setHand(this.deck.get_card(),this.deck.get_card());
      this.#players.set(p3.id,p3);  */     
       
   }
    
   getControlBtn(e){
     return <div className="col-lg-12 text-center">
         <div className="row align-items-center">
            <div className="col-xs-4 align-self-center">
               <div className="d-grid gap-3 d-md-block" aria-label="Basic example">
                  <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn1.disabled} onClick={this.resetTimer}>Confirm</button>
                  <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn2.disabled} onClick={this.resetTimer}>Middle Button</button>
                  <button className="btn btn-secondary btn-outline-dark btn-lg" type="button" disabled={this.state.control.btn3.disabled} onClick={this.resetTimer}>Decline</button>
               </div>
            </div>
            
         </div>
      </div>
   }

   build_url(key) {
      return `/images/q/${key}.png`;
   }

   getCardHand(player){
     return <div className={player.style_place}>
               <Image
                  src={this.build_url(player.getCard1().key)}
                  height={75} 
                  width={45} 
                  alt="Card 1"
                  quality={100}
               />
               <Image
                  src={this.build_url(player.getCard2().key)} 
                  height={75} 
                  width={45} 
                  alt="Card 2"
                  quality={100}      
               />
            </div>
   }

   getPlayers(){
      let res = [];
      this.#players.forEach( (player, key, map) => {
         res.push(<div className={styles.box_card}> {this.getCardHand(player)}</div>);
     });
     return res;
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
  /*
     return (
       <React.Fragment>
               <Layout>
                  <div className={styles.pokertable}>
                    {this.getPlayers()}
                  </div>
                  {this.getControlBtn()}
               </Layout>
       </React.Fragment>
     );
*/

return (
   <React.Fragment>
           <Layout>
              <div className={styles.pokertable}>

             <div className={styles.tablo_player}>
              <div className={styles.box_card}> 
                  <div className={styles.test_tablo}>
                     <Image
                        src={this.build_url('as')}
                        height={75} 
                        width={45} 
                        alt="Card 1"
                        quality={100}
                     />
                     <Image
                        src={this.build_url('ac')} 
                        height={75} 
                        width={45} 
                        alt="Card 2"
                        quality={100}      
                     />
                  </div>
              </div>
              <div className={styles.test_tablo}></div>
             </div>



              </div>
              {this.getControlBtn()}
           </Layout>
   </React.Fragment>
 );
   }
}
 
 