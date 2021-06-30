import Link from 'next/link'

export default function Header() {
  return (
    <h2 className="">
      <Link href="/">
        <a className="">Блог</a>
      </Link>
    </h2>
  )
}
