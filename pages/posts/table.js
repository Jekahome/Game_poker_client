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
        control:{btn1:{disabled:""},btn2:{disabled:""},btn3:{disabled:"disabled"}},
        value_range:10,max_range:100
      };// только в конструкторе можно присвоить состояние через =

     this.getControlBtn = this.getControlBtn.bind(this);
     this.getPlayers = this.getPlayers.bind(this);
     this.handleChange = this.handleChange.bind(this);

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
    
   handleChange(event){
     // console.log(event.target.value);
      this.setState({value_range: event.target.value});
   }
   getControlBtn(e){
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
    <div className="col-5">
      <div className="input-group mb-3">
     
      <input className={'form-control'}     type="range" min="0" max={this.state.max_range} step="0.1" value={this.state.value_range}  id="customRange1" aria-describedby="button-addon2" onChange={this.handleChange}></input>
      
      <button className="btn btn-outline-secondary gap-2 col-3 mx-auto" type="button" id="button-addon2">
         {this.state.value_range}
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

   getCardHand(player){
     return <div className={player.style_place}>
               <Image
                  src={this.build_url(player.getCard1().key)}
                  height={65} 
                  width={40} 
                  alt="Card 1"
                  quality={100}
               />
               <Image
                  src={this.build_url(player.getCard2().key)} 
                  height={65} 
                  width={40} 
                  alt="Card 2"
                  quality={100}      
               />
            </div>
   }

   getCardHand2(/*player*/){
      return   <React.Fragment> 
                  <div className={styles.box_card}> 
                     <Image 
                     className={styles.img} 
                     src={this.build_url('as')} 
                     height={65} width={40} 
                     quality={100} 
                     priority={true}
                     layout="raw"
                     alt=""/>
                     <Image 
                     className={styles.img} 
                     src={this.build_url('ah')} 
                     height={65} 
                     width={40} 
                     quality={100} 
                     priority={true}
                     layout="raw"
                     alt=""/>
                  </div>
                  <div className={styles.inform_tablo_l}>
                     <Image 
                     src={this.build_url('as')} 
                     className={styles.round_l} 
                     height={54} 
                     width={54} 
                     quality={100} 
                     priority={true}
                     layout="raw"
                     alt=""/>
                     <div className={styles.name_money_info}>
                        <span className={styles.name_info}>Fkgjnkjbn</span>
                        <span className={styles.money_info}>4.8$</span>
                     </div>
                  </div> 
                  <div className={styles.place1_chips}>
                    {this.getPlayerChips()}
                  </div>
               </React.Fragment> 
   }
   getPlayerChips(/*player*/){
     return <React.Fragment>
          <Image className={'rounded'} src={this.build_chips_url(800)} priority={true} layout="raw" height={40} width={40} alt=""/>
      <Image className={' rounded'} src={this.build_chips_url(90)} priority={true} layout="raw" height={40} width={40} alt=""/>
      </React.Fragment>  
   }

   getPlayers(){
      let res = [];
      this.#players.forEach( (player, key, map) => {
         res.push(<div className={styles.box_card}> {this.getCardHand(player)}</div>);
     });
     return res;
   }

   getImageChips(value){
      
         //let value = 240895;// 200000 40000 800 90 5

         if (value > 99999){
         console.log("[100000]",value-value%100000,value%100000);
         value=value%100000;
         }
         if (value > 9999){
         console.log("[10000-99999]",value-value%10000,value%10000);
         value=value%10000;
         }
         if (value > 999){
         console.log("[1000-9999]",value-value%1000,value%1000);
         value=value%1000;
         }
         if (value > 99){
         console.log("[100-999]",value-value%100,value%100);
         value=value%100;
         }
         if (value > 9){
         console.log("[10-99]",value-value%10,value%10);
         value=value%10;
         }
         if (value > 0){
         console.log("[1-9]",value);
         
         }
let size_chips = 70;
return <div className="text-center">
 
  <Image className={styles.chips+' rounded'} src={this.build_chips_url(200000)} priority={true} layout="raw" height={size_chips} width={size_chips} alt=""/>
  <Image className={styles.chips+' rounded'} src={this.build_chips_url(40000)} priority={true} layout="raw" height={size_chips} width={size_chips} alt=""/>
  <Image className={styles.chips+' rounded'} src={this.build_chips_url(800)} priority={true} layout="raw" height={size_chips} width={size_chips} alt=""/>
  <Image className={styles.chips+' rounded'} src={this.build_chips_url(90)} priority={true} layout="raw" height={size_chips} width={size_chips} alt=""/>
  <Image className={styles.chips+' rounded'} src={this.build_chips_url(5)} priority={true} layout="raw" height={size_chips} width={size_chips} alt=""/>
</div>


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

                  <div className={styles.place1}>
                     {this.getCardHand2()} 
                  </div> 

                  <div className={styles.place2}>
                     {this.getCardHand2()}  
                  </div> 

                  <div className={styles.place3}>
                     {this.getCardHand2()}   
                  </div> 

                  <div className={styles.place4}>
                     {this.getCardHand2()}  
                  </div> 

                  <div className={styles.place5}>
                     {this.getCardHand2()}   
                  </div> 

                  <div className={styles.place6}>
                     {this.getCardHand2()}   
                  </div> 

                  <div className={styles.place7}>
                     {this.getCardHand2()}  
                  </div> 

                  <div className={styles.place8}>
                     {this.getCardHand2()} 
                  </div> 

                  <div className={styles.place9}>
                     {this.getCardHand2()}   
                  </div> 

                  <div className={styles.place10}>
                     {this.getCardHand2()}   
                  </div> 

                  <div  className={styles.table_pot}>
                      <p className="text-center fw-bold fs-3">151551</p>
                  </div>

                  <div className={styles.table_cards}>
                        <div className={styles.table_cards_item}>
                           <Image className={styles.img} src={this.build_url('as')} priority={true} layout="raw" height={65} width={40} alt=""/>
                        </div>
                        <div className={styles.table_cards_item}>
                           <Image className={styles.img} src={this.build_url('as')}priority={true} layout="raw" height={65} width={40} alt=""/>
                        </div>
                        <div className={styles.table_cards_item}>
                           <Image className={styles.img} src={this.build_url('as')} priority={true} layout="raw" height={65} width={40} alt=""/>
                        </div>
                        <div className={styles.table_cards_item}>
                           <Image className={styles.img} src={this.build_url('as')} priority={true} layout="raw" height={65} width={40} alt=""/>
                        </div>
                        <div className={styles.table_cards_item}>
                           <Image className={styles.img} src={this.build_url('as')} priority={true} layout="raw" height={65} width={40} alt=""/>
                        </div>


                        <div  className={styles.total_chips}>
                        {this.getImageChips(125489)}
                        </div>

                  </div>




              </div>
              {this.getControlBtn()}
           </Layout>
   </React.Fragment>
 );
   }
}
 
 