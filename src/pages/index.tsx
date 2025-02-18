import React from 'react'
import dynamic from 'next/dynamic'
const Home = dynamic(() => import('@/features/Home'))

function Homepage() {
  return <Home />
}

export default Homepage

export async function getStaticProps() {
  return {
    props: { title: 'home' }
  }
}
