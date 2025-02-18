import dynamic from 'next/dynamic'
import Comingsoon from '../features/ComingSoon/index'
const ComingSoon = dynamic(() => import('@/features/Dashboard'))

function ComingSoonPage() {
  return <Comingsoon />
}

export default ComingSoonPage

export async function getStaticProps() {
  return {
    props: { title: 'ComingSoon' }
  }
}
