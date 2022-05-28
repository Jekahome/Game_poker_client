
import * as React from 'react'

// <Your Context obj>.Provider - Для проброса данных в глубь иерархии компонентов не прибегая к использованию props
// <Your Context obj>.Consumer - Это обработчик изменения проброшенных данных

const themes = {
    light: {
      foreground: '#000000',
      background: '#eeeeee',
    },
    dark: {
      foreground: '#ffffff',
      background: '#222222',
    },
};
  
const GlobalContext = React.createContext({ theme: themes.dark,  toggleTheme: () => {}});

function TogglerButton() {
    // TogglerButton получает из контекста  
    // не только значение UI-темы, но и функцию toggleTheme.  
    return (
      <GlobalContext.Consumer>
        {({theme, toggleTheme}) => (       
            <button
                onClick={toggleTheme}
                style={{backgroundColor: theme.background}}>
                Toggle Theme 
          </button>
        )}
      </GlobalContext.Consumer>
    );
}
 
class App extends React.Component {
    constructor(props) {
      super(props);
  
      this.toggleTheme = () => { 
          this.setState(state => ({ theme: state.theme === themes.dark ? themes.light: themes.dark}));
      };
  
      // Состояние хранит функцию для обновления контекста,    
      // которая будет также передана в Provider-компонент.    
      this.state = {
        theme: themes.light,
        toggleTheme: this.toggleTheme    
      };
    }
  
    render() {
      // Всё состояние передаётся в качестве значения контекста   
      // Компонент Provider используется для передачи контекста (конкретно текущей UI-темы вниз по дереву) к TogglerButton. 
      // Любой компонент может использовать этот контекст и не важно, как глубоко он находится. 
      return (
        <GlobalContext.Provider value={this.state}>        
            <React.Fragment>
                <TogglerButton />
            </React.Fragment>
        </GlobalContext.Provider>
      );
    }
}
  

export default App;


