 
//import { LowSync, JSONFileSync } from 'lowdb'

import * as React from 'react'
import Link from 'next/link'

class Examplelowdb extends React.Component {
    constructor(props) {
      super(props);
      this.state = {items: [1, 2, 3, 4, 5]}; 
      this.addItem = this.addItem.bind(this);
    }
    
    componentDidMount() {
        // после того, как компонент отрендерился в DOM  
    }
    
    componentWillUnmount() {
        // когда DOM-узел, созданный компонентом, удаляется  
    }
 
    addItem(e){
        // e.preventDefault();
        console.info({[e.target.name]: e.target.value});
        let temp = this.state.items;
        temp.push(temp.length+1);
      
        this.setState({
            items: temp
        });
    }

    render() { 
      return (
        <React.Fragment>
          <NumberList numbers={this.state.items}/>
          <button onClick={this.addItem}> Add </button>
        </React.Fragment>
      );
    }
}

function ListItem(props) {
    // Правильно! Не нужно определять здесь ключ:
    return (<li>{props.value}</li>);
}
  
function NumberList(props) {
    const numbers = props.numbers;// const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((number,index)=>{
        console.log("+",number);
       // Правильно! Ключ нужно определять внутри массива:
       return <ListItem key={number.toString()} value={number} />
      }
    );
    return (
      <ul>
       {listItems}
      </ul>
    );
}
 
 

export default Examplelowdb;
 

 
/*
https://github.com/typicode/lowdb

npm install lowdb
*/