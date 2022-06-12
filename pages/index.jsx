 
import Head from 'next/head'
import Script from 'next/script'
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

// Хук useState[0=>value,1=>func upd]

 
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/layout'

import styles from '../assets/table/table.module.css'
import * as React from 'react'

const Home = () => (
 // GRID
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
          <Image className="card-img-top" src="/images/SnG.jpg"  height={150}  width={100}  alt="SnG"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/Freeroll.jpg"  height={150}  width={100}  alt="Freeroll"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/SnG.jpg"  height={150}  width={100}  alt="SnG"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/Freeroll.jpg"  height={150}  width={100}  alt="Freeroll"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
    </div>
  )
  
// Rout: /
 
 export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
   // console.log("render",this.state.value,this.props.value);
      return <Layout><Home/></Layout>
  }
 }

/*
Елемент:

const element = (
  <h1 className="greeting">
    Привет, мир!
  </h1>
);

Эквивалентно

const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Привет, мир!'
);


-------------------------------------------------------------
Компонент:
(Компонент никогда не должен что-то записывать в свои пропсы)
(Состояние state контролируется и доступно только конкретному компоненту)

function Welcome(props) {
  return <h1>Привет, {props.name}</h1>;
}
или
class Welcome extends React.Component {
  render() {
    return <h1>Привет, {this.props.name}</h1>;
  }
}

Елемент:
const element = <Welcome name="Алиса" />;

Встраивание в DOM:
ReactDOM.render(element, document.getElementById('root'));
*/