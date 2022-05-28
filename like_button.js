 
// стартовый код
'use strict';


class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return React.createElement(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(React.createElement(LikeButton), domContainer);

//-------------------------------------------------
ReactDOM.render(
  "<h1>Hello, world!</h1>",
  document.getElementById('root')
);
/*
 function MyApp() {
    return "<h1>Hello, world!</h1>";
 }

 const container = document.getElementById('root');
 const root = ReactDOM.createRoot(container);
 root.render(<MyApp />);*/






