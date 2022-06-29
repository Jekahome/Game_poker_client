import styles from './layout.module.css'
import Link from 'next/link'
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

  function LinkHome(){
    return  <Link href="/">
              <a className="nav-link">Home</a>
            </Link>      
  }
  
  function LinkTable(){
        return <Link href="/game/table" prefetch={false}>
          <a className="nav-link">Table</a>
        </Link>      
  }
  
  function LinkExamapleState(){
    return  <Link href="/game/example_state">
              <a className="nav-link">State</a>
            </Link>
         
  }
  function LinkExamapleContext(){
    return  <Link href="/game/example_context">
              <a className="nav-link">Context</a>
            </Link>
          
  }
  function LinkExamapleDb(){
    return <Link href="/example_db/pgdb">
              <a className="nav-link">PgDB</a>
            </Link>
          
  }
  function LinkExamapleUseState(){
    return  <Link href="/game/example_usestate">
              <a className="nav-link">Hook useState</a>
            </Link>      
  }
  function LinkExamapleMusic(){
    return  <Link href="/music">
              <a className="nav-link">Music</a>
            </Link>      
  }
  
export default function Layout({children}) {
    //return <html lang="en"><div className="container">{children}</div></html> 
    return <div className="container-fluid">
                <Head>
                  <link rel="shortcut icon" href="/static/favicon.ico" />
                </Head>
                <div className={styles.layout}>
                    <ul className="nav justify-content-center">
                        <li key={1} className="nav-item">
                          <LinkHome/>
                        </li>
                        <li key={2} className="nav-item">
                          <LinkTable/>
                        </li>
                        <li key={3} className="nav-item">
                          <LinkExamapleState/>
                        </li>
                        <li key={4} className="nav-item">
                           <LinkExamapleContext/>
                        </li>
                        <li key={5} className="nav-item">
                           <LinkExamapleUseState/>
                        </li>
                        <li key={6} className="nav-item">
                           <LinkExamapleDb/>
                        </li>
                        <li key={7} className="nav-item">
                          <LinkExamapleMusic/>
                        </li>
                    </ul> 
                  
                   {children}   
                </div>
          </div> 
}

 
