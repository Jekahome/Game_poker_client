
Запуск
npm run dev

Open: http://localhost:3000/


ReactJs
https://create-react-app.dev/docs/adding-images-fonts-and-files/

NextJs
https://nextjs.org/docs/api-reference/next/image
https://nextjs.org/learn/foundations/from-react-to-nextjs/getting-started-with-nextjs
https://nextjs.org/learn/basics/create-nextjs-app/setup
https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest/pages/api

https://ru.reactjs.org/docs/introducing-jsx.html
https://ru.reactjs.org/docs/add-react-to-a-website.html


Map
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach

WASM
https://rustwasm.github.io/docs/wasm-pack/introduction.html
https://rustwasm.github.io/wasm-bindgen/examples/fetch.html
https://github.com/ignacio-gc/wasm-gol-next
https://rustwasm.github.io/docs/book/game-of-life/setup.html
https://github.com/vercel/next.js/blob/canary/examples/with-webassembly/pages/index.js

https://ru.reactjs.org/docs/context.html

Переход на typescript:
https://nextjs.org/docs/basic-features/typescript#pages
https://ru.reactjs.org/docs/static-type-checking.html#configuring-the-typescript-compiler

DB:
https://dev-gang.ru/article/naczalo-raboty-s-postgres-v-vashem-prilozhenii-react-olh4g437dj/
https://docs.sequelizejs.com/docs/v7/getting-started/
https://qna.habr.com/q/418785
https://webformyself.com/top-5-vstroennyx-baz-dannyx-dlya-prilozhenij-javascript/

### WASM library

```
Cargo.toml


[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["console_error_panic_hook"]

[dependencies]
wasm-bindgen = { version = "0.2.80", features = ['serde-serialize'] }
js-sys = "0.3.45"
 
wasm-bindgen-futures = "0.4.30"
serde = { version = "^1.0", features = ["derive"] }
serde_derive = "^1.0"

# The `console_error_panic_hook` crate provides better debugging of panics by
# logging them with `console.error`. This is great for development, but requires
# all the `std::fmt` and `std::panicking` infrastructure, so isn't great for
# code size when deploying.
console_error_panic_hook = { version = "0.1.6", optional = true }

# `wee_alloc` is a tiny allocator for wasm that is only ~1K in code size
# compared to the default allocator's ~10K. It is slower than the default
# allocator, however.
#
# Unfortunately, `wee_alloc` requires nightly Rust when targeting wasm for now.
wee_alloc = { version = "0.4.5", optional = true }

[dev-dependencies]
wasm-bindgen-test = "0.3.13"

[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"

[package.metadata.wasm-pack.profile.release]
wasm-opt = false

```

```
WASM build

$ wasm-pack build --out-dir pkg
```

```
#[wasm_bindgen]  
#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct Card {
    pub n: N,
    pub m: M,
}

#[wasm_bindgen]
impl Card {
    // use in Js  let card  = new Card(n,m); Without constructor let card = Card.new(n,m); 
    #[wasm_bindgen(constructor)]
    pub fn new(n: N, m: M) -> Self {
        Self { n, m }
    }
    pub fn get(self)->wasm_bindgen::JsValue {
        wasm_bindgen::JsValue::from(self)   
    }
}

```

```
Use Js 

 export class Table extends React.Component {
    componentDidMount() {
        // после того, как компонент отрендерился в DOM 
        (async () => {  
            this.mod_wasm = (await import('../../pkg/poker_hands'))
        }).bind(this)();
    }
    handleChange(event){
        let card = new this.mod_wasm.Card(1,1);
       ... card.get();
    }
 }

```

## Task

1. + Где хранить данные (база данных на сервере postgres)

2. Процес игры, раунды торгов, как это должно работать?
    установить кнопку D на занятое место и перемещать

3. Обьект игрока, бота

4. Правила

5. выбор посадочного места для себя и возможность собрать свой стол игроков (Приоритет:низкий)
   альтернатива фиксированное количество ботов 9 штук и стол всегда загружается с ними.



----------------------------------------------------------------------------------

Расчет Split pot

 #![allow(unused_variables)]
 #![allow(unused_mut)]
 
fn main() {
      
  let pot = 2300;//1500;//весь пот
  let res = calc(vec![vec![1,2,3],vec![4],vec![5]],pot);// [(1, 210), (2, 836), (3, 1254)]
  // let res = calc(vec![vec![1],vec![2],vec![3],vec![4],vec![5]],pot);// [(1,500),(2,1200),(3,600)]
  //let res = calc(vec![vec![2],vec![3],vec![1],vec![4],vec![5]],pot);// [(2, 1700), (3, 600)]
  //let res = calc(vec![vec![3],vec![2],vec![2],vec![4],vec![5]],pot);// [(3, 2300)]
   println!("res={:?}",res);
}
 
fn sum_bet(bet_pot:i32,id_group:Vec<i32>,user_pot:&[(i32,i32)])->Option<i32>{
 let mut sum = 0;
    for i in user_pot.iter(){
        if !id_group.contains(&i.0){
            sum+= if bet_pot >= i.1{i.1}else{bet_pot};
        }
    }
   Some(sum)   
}
fn calc(win:Vec<Vec<i32>>,pot:i32) ->Vec<(i32,i32)>{
// не должно быть не уравненных ставок
    let mut user_pot:Vec<(i32,i32)> = vec![(1,100),(2,400),(3,600),(4,600),(5,600)];//претенденты на пот
    let mut result:Vec<(i32,i32)> = vec![];
    let mut pot = pot;

     
    for w in win.iter(){
        if pot > 1 {
            let mut v:Vec<(i32,i32,i32)> = vec![];
            let ids_group = w.iter().map(|v|*v).collect::<Vec<i32>>();// 1,2,3
            let group_sum_bet:i32 = user_pot.iter().filter(|u|{ ids_group.contains(&u.0) }).map(|u|u.1).sum::<i32>();
          
            let group_max_pot:i32 =  w.iter()
               .map(|id|{ (id,user_pot.iter().filter(|u|{&u.0==id}).map(|u|u.1).max().unwrap()) })
               .map(|(id,bet_pot)|{ sum_bet(bet_pot,ids_group.clone(),&user_pot).unwrap()})
               .max().unwrap(); 
               
            // println!("group_sum_bet={} group_max_pot={}",group_sum_bet,group_max_pot );
            let mut total_chank:i32 = 0;
            let mut res:Vec<(i32,i32)> = user_pot.iter()
                .filter(|u|{ ids_group.contains(&u.0) })
                .map(|u|{ 
                  let mut bank = (group_max_pot as f32/(group_sum_bet as f32/u.1 as f32) ) as f32;
                  total_chank+=bank as i32;
                  pot-=bank as i32;
                  //println!("{}/({}/{}) pot={} bank={}",group_max_pot,group_sum_bet,u.1, pot ,  bank ); 
                  (u.0,bank as i32 + u.1) 
                }).collect();
                
                let last:i32 = group_max_pot - total_chank;
                if last > 0 {
                    res[0].1+=last;
                }
                for i in res.into_iter(){
                    result.push(i.clone());
                }
           
            user_pot = user_pot.into_iter()
                        .filter(|u| !ids_group.contains(&u.0) && (u.1-group_sum_bet) > 0 )
                        .map(|u|{ (u.0,u.1-group_sum_bet)  })
                        .collect::<Vec<(i32,i32)>>();
            
             pot-=group_sum_bet;
          // println!("result={:?} user_pot={:?} pot={}",result, user_pot, pot);
        }
    }
    return result;
    
}


 