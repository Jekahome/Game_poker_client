import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/layout'

 
const Home = ({k}) => (
 // GRID
    <div className="row row-cols-1 row-cols-md-2 g-4">
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
          <Image className="card-img-top" src="/images/SnG.jpg"  height={150}  width={100}  alt="SnG"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/Freeroll.jpg"  height={150}  width={100}  alt="Freeroll"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/SnG.jpg"  height={150}  width={100}  alt="SnG"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card border-dark text-dark bg-warning" style={{marginRight: 12 + 'em'}}>
        <Image className="card-img-top" src="/images/Freeroll.jpg"  height={150}  width={100}  alt="Freeroll"/>
          <div className="card-body">
            <h5 className="card-title">Card title</h5>
            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          </div>
        </div>
      </div>
    </div>
  )
  
// Rout: /posts/home 
export default function _() {
    return (
      <Layout> 
        <Home k="2C"/>
      </Layout>
    )
 }