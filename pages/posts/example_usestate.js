
// https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/

// React Hooks — это функции, которые добавляют переменные состояния к функциональным компонентам и инструментируют методы жизненного цикла классов.

// useState это хук, который позволяет вам иметь переменные состояния в функциональных компонентах(не в  классовых). 
/*
В то время как состояние в классе всегда является объектом, с хуками состояние может быть любого типа. 
Каждая часть состояния содержит одно значение, которое может быть объектом, массивом, логическим значением или 
любым другим типом, который вы можете себе представить.
*/
/*
Вы передаете начальное состояние этой функции, и она возвращает переменную с текущим значением состояния 
(не обязательно начальным состоянием) и другую функцию для обновления этого значения.
*/

import React,{useState , useEffect} from 'react';


 const Message = () => {
      // Инициализация только один раз, последующие рендеры будут игнорироваться
      const [messageObj, setMessage]= useState( {author: '',message: {id: 1,text: ''}});// 1-й аргумент  переменная состояния 2-й функция для изменения переменной состояния
      // Однако setMessage не обновляет сразу, а поставит в очередь и при рендере вернет последнее значение,а не из очереди
      
      // Для работы с массивами новый массив следует дополнять новыми данными
      const [messageList, setMessageList] = useState([]);

       
      // По умолчанию эффекты запускаются после каждого завершённого рендера
      // но можно назначить срабатывание по наличию изменений в каком-то обьекте
      useEffect(() => {
        return () => {
            if (messageList.length >= 3){
                setMessageList([]);
            }   
        };
      },[messageList.length]);// если messageList.length изменится эффект сработат снова

    return (
      <div>
        <input
          type="text"
          value={messageObj.message.text}
          placeholder="Enter a message"
          onChange={e => {
            // для обновления обязательно нужен новый обьект или воссоздать!
            // const messageObj = {};
            setMessage( prevState => ({
                            ...prevState,           // скопировать все остальные поля/объекты
                            message: {              // воссоздать объект, содержащий поле для обновления
                                ...prevState.message, // скопировать все поля объекта
                                text: e.target.value    // перезаписать значение поля для обновления
                            }
                        }));
 
        }}
        />
        <br/>

        <input
        type="button"
        value="Add"
        onClick={e => {
          setMessageList([
            ...messageList,
            {
              id: messageList.length + 1,
              message: messageObj.message.text 
            }
          ]);
          
        }}
      />

        <p>
          <strong>{messageObj.message.text }</strong>
        </p>

        <ul>
        {messageList.map(m => (
          <li key={m.id}>{m.message}</li>
        ))}
      </ul>

      </div>
    );
  };

  export default Message;

 
/*
const Persons = (props) =>  {
   const [nameState , setNameState] = useState(props)

   useEffect(() => {
       setNameState(props);
   }, [props])

   return (
            <div>
                <p>My name is {props.name} and my age is {props.age}</p>
                <p>My profession is {props.profession}</p>
            </div>
        )

}

export default Persons;
*/