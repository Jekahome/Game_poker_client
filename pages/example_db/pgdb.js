// https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/

import React, {useState, useEffect} from 'react';
//import * as React from 'react'
 
export default class AppDb extends React.Component {
  constructor(props) {
    super(props);
    this.getMerchant = this.getMerchant.bind(this);
    this.createMerchant = this.createMerchant.bind(this);
    this.deleteMerchant = this.deleteMerchant.bind(this);
   
    this.getMerchant();

    // Состояние хранит функцию для обновления контекста,    
    // которая будет также передана в Provider-компонент.    
    this.state = {
      merchants: "",
          
    };
  }

  getMerchant(){
    fetch('http://localhost:3001')
    .then(response => {
      return response.text();
    })
    .then(data => {
      this.setState({
        merchants: data
      });
    });
  }

  createMerchant(e){
    // e.preventDefault();
    console.info({[e.target.name]: e.target.value});
  
    let name = prompt('Enter merchant name');
    let email = prompt('Enter merchant email');
    fetch('http://localhost:3001/merchants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email}),
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      console.log(data);
      this.getMerchant();
    });
 
  }

  deleteMerchant(e){
    // e.preventDefault();
    console.info({[e.target.name]: e.target.value});
  
    let id = prompt('Enter merchant id');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      return response.text();
    })
    .then(data => {
      console.log(data);
      this.getMerchant();
    });
  }

  render() {
    // Всё состояние передаётся в качестве значения контекста   
    // Компонент Provider используется для передачи контекста (конкретно текущей UI-темы вниз по дереву) к TogglerButton. 
    // Любой компонент может использовать этот контекст и не важно, как глубоко он находится. 
    
    return (
      <React.Fragment>
      {this.state.merchants ? this.state.merchants : 'There is no merchant data available'}
      <br/>
      <button onClick={this.createMerchant}>Add merchant</button>
      <br/>
      <button onClick={this.deleteMerchant}>Delete merchant</button>
      </React.Fragment>
 );
  }
}
