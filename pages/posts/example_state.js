import * as React from 'react'
import Link from 'next/link'

class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};// только в конструкторе можно присвоить состояние через =

      this.resetTimer = this.resetTimer.bind(this);
    }
    
    componentDidMount() {
        // после того, как компонент отрендерился в DOM 
        this.timerID = setInterval(
          () => this.tick(),
          1000
        );
      }
    
    componentWillUnmount() {
        // когда DOM-узел, созданный компонентом, удаляется
         clearInterval(this.timerID);
    }

    tick() {
        // изменение состояния
        //(setState обновляет только указаные поля состояния)
        this.setState({
            date: new Date()
        });
        /*
        this.setState((state, props) => ({
          counter: state.counter + props.increment
        }));
        или
        this.setState(function(state, props) {
            return {
                counter: state.counter + props.increment
            };
        });
        */
    }

    resetTimer(e){
        // e.preventDefault();
        console.info({[e.target.name]: e.target.value});
      
        this.setState({
            date: new Date(2018, 11, 24, 10, 33, 30, 0)
        });
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

      return (
        <React.Fragment>
         {true && 
            <h1>Привет, мир!</h1>
         } 
          <h2>Сейчас {this.state.date.toLocaleTimeString()}.</h2>
          <button onClick={this.resetTimer}>
           Сброс
          </button>
          <Home title="Home"/>
        </React.Fragment>
      );
    }
}

  
function Home(props){
    // Не отображать элемент
    if (props.warn) {
        return null;
    }

    return <p className="title">
            Go to {' '}
            <Link href="/">
              <a>{props.title}</a>
            </Link>
          </p>
  }

/*
  // Список
  function ListItem(props) {
    // Правильно! Не нужно определять здесь ключ:
    return <li>{props.value}</li>;
  }
  
  function NumberList(props) {
    const numbers = props.numbers;// const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map((number,index)) =>
      // Правильно! Ключ нужно определять внутри массива:
      return <ListItem key={number.toString()} value={number} />
    );
    return (
      <ul>
        {listItems}
      </ul>
    );
  }
*/

export default Clock;
 