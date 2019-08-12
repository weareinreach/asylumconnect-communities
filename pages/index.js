import Link from "next/link"
import Header from "../components/header"

function Index() {
  return (
    <main>
      <Header />
      <section>
        <Link href="/about">
          <a className='test'>Go to About Me</a>
        </Link>
      </section>
      <style jsx>{`
        .test {
          text-decoration: none;
        }
      `}</style>
    </main>
  )
}

export default Index
