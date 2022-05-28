 
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { useState } from 'react'
import Layout from '../components/layout'
import 'bootstrap/dist/css/bootstrap.min.css';

// Хук useState[0=>value,1=>func upd]

 

export default function HomePage() {
  const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton']

  const [likes, setLikes] = useState(0)

  function handleClick() {
    setLikes(likes + 1)
  }

  return (
    <Layout>
        
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />

        <div>
      
            <ul>
              {names.map(name => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <button onClick={handleClick}>Like ({likes})</button>
        </div>

    </Layout>
  )
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