// http://localhost:3000/api

import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic
  res.json({ message: 'Hello Everyone!' })
}

/*export default function handler(req, res) {
   // localStorage.setItem('items',[1,2,3,4,5]);
    localStorage.setItem('items',"IVANOV");
    var items = Array.from(localStorage.getItem('items'));
    res.status(200).json(items)
    //res.status(200).json({k1:"2K",k2:"JB"})
}*/


/*export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}*/

// https://nextjs.org/learn/basics/api-routes/creating-api-routes

/*
https://nextjs.org/docs/basic-features/environment-variables

export async function getStaticProps() {
    const db = await myDB.connect({
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
    })
    // ...
  }*/