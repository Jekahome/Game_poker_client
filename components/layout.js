import styles from './layout.module.css'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css';

  function LinkHome(){
    return  <Link href="/posts/home">
              <a className="nav-link">Home</a>
            </Link>      
  }
  
  function LinkTable(param=""){
    
        if(param == "game") {
            return <Link href="/posts/table">
            <a  className="nav-link active" aria-current="page">Table</a>
            </Link>
        }else{
            return <Link href="/posts/table">
            <a  className="nav-link">Table</a>
            </Link>
        }        
  }
  
  function LinkExamapleState(){
    return  <Link href="/posts/example_state">
              <a  className="nav-link">State</a>
            </Link>
         
  }
  function LinkExamapleContext(){
    return  <Link href="/posts/example_context">
              <a  className="nav-link">Context</a>
            </Link>
          
  }
  function LinkExamapleDb(){
    return <Link href="/example_db/pgdb">
              <a  className="nav-link">PgDB</a>
            </Link>
          
  }
  function LinkExamapleUseState(){
    return  <Link href="/posts/example_usestate">
              <a  className="nav-link">Hook useState</a>
            </Link>      
  }

  
export default function Layout({children}) {
    //return <html lang="en"><div className="container">{children}</div></html> 
    return <div className="container">
                <div className={styles.layout}>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                        <LinkHome/>
                        </li>
                        <li className="nav-item">
                        <LinkTable/>
                        </li>
                        <li className="nav-item">
                        <LinkExamapleState/>
                        </li>
                        <li className="nav-item">
                        <LinkExamapleContext/>
                        </li>
                        <li className="nav-item">
                        <LinkExamapleUseState/>
                        </li>
                        <li className="nav-item">
                        <LinkExamapleDb/>
                        </li>
                    </ul> 
                  
                   {children}   
                </div>
          </div> 
}

 
