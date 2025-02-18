import dynamic from 'next/dynamic'
const Dashboard = dynamic(() => import('@/features/Dashboard'))

function DashboardPage() {
  return <Dashboard />
}

export default DashboardPage

export async function getStaticProps() {
  return {
    props: { title: 'Dashboard' }
  }
}
