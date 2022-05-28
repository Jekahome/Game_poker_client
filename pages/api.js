// http://localhost:3000/api
export default function handler(req, res) {
    localStorage.setItem('items',[1,2,3,4,5]);
    var items = Array.from(localStorage.getItem('items'));
    res.status(200).json(items)
    //res.status(200).json({k1:"2K",k2:"JB"})
}

// https://nextjs.org/learn/basics/api-routes/creating-api-routes