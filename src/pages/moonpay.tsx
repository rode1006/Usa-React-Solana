import dynamic from 'next/dynamic'
const Moonpay = dynamic(() => import('@/features/Home'))

function MoonpayPage() {
  return <Moonpay />
}

export default MoonpayPage

export async function getStaticProps() {
  return {
    props: { title: 'Moonpay' }
  }
}
