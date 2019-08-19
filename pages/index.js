import Link from 'next/link'
import Header from '../components/header'

import landingStyles from '../styles/landingStyles'

function handleClick () {
  fetch('/api/auth')
    .then(data => data.json()) 
    .then(json => console.log(json))
    .catch(err => console.error(err))
}

export default () => (
  <main>
    <Header />
    <section>
      <Link href='/about'>
        <a className='test'>Go to About Me</a>
      </Link>
    </section>
    <section>
      <button onClick={() => handleClick()}>
        Auth Test
      </button>
    </section>
    <style jsx>{landingStyles}</style>
  </main>
)

