
### Client use

NextJS 

React 

WASM Rust

Bootstrap

### Primary goals

1. Implement a client to be able to develop individual decision-making logic for bots. 

2. Train bots using artificial intelligence


### Run game

```
npm run dev

Open: http://localhost:3000/
```


### ReactJs

https://create-react-app.dev/docs/adding-images-fonts-and-files/


### NextJs

https://nextjs.org/docs/api-reference/next/image

https://nextjs.org/learn/foundations/from-react-to-nextjs/getting-started-with-nextjs

https://nextjs.org/learn/basics/create-nextjs-app/setup

https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest/pages/api

https://ru.reactjs.org/docs/introducing-jsx.html

https://ru.reactjs.org/docs/add-react-to-a-website.html

### Audio API JS

https://lenguajejs.com/javascript/multimedia/api-multimedia-nativa/

https://zvukipro.com/1917-zvuki-igry-v-poker.html


### Js format

https://beautifier.io/

### Map

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach


### WASM

https://rustwasm.github.io/docs/wasm-pack/introduction.html

https://rustwasm.github.io/wasm-bindgen/examples/fetch.html

https://github.com/ignacio-gc/wasm-gol-next

https://rustwasm.github.io/docs/book/game-of-life/setup.html

https://github.com/vercel/next.js/blob/canary/examples/with-webassembly/pages/index.js

https://ru.reactjs.org/docs/context.html

### Go to typescript:

https://nextjs.org/docs/basic-features/typescript#pages

https://ru.reactjs.org/docs/static-type-checking.html#configuring-the-typescript-compiler

### DB:

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

1. + DB Storage (Rust server Postgres client)

2. Develop custom modules for bot behavior based on shared data

 


 

 