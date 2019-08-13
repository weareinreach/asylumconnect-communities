import Link from 'next/link'
import Header from '../components/header'

import landingStyles from '../styles/landingStyles'

function Index() {
  return (
    <main>
      <Header />
      <section>
        <Link href='/about'>
          <a className='test'>Go to About Me</a>
        </Link>
      </section>
      <style jsx>{landingStyles}</style>
    </main>
  )
}

export default Index
