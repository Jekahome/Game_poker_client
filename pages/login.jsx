 
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from '../components/layout'
import * as React from 'react'
// Rout: /login

export default class App extends React.Component { 
   constructor(props) {
       super(props);
       this.state = {id:1};
       this.handleLogin = this.handleLogin.bind(this);
   }
   handleLogin(event){
    this.setState({id:Number(event.target.value)});
    sessionStorage.setItem('id', Number(event.target.value));
   }
   render(){
    return (
        <Layout><div>
            <select className="form-select form-select-lg mb-3" aria-label="Default select example"
                value={this.state.id}
                onChange={(e) => this.handleLogin(e)}
            >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="4">5</option>
          <option value="4">6</option>
          <option value="4">7</option>
          <option value="4">8</option>
          <option value="4">9</option>
          <option value="4">10</option>
        </select>
      </div>
      <h1>id:{this.state.id}</h1>
      </Layout>
    );
   }
}