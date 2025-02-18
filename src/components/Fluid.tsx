import { useEffect, useState } from 'react'

const Fluid = () => {
  const [init, setInit] = useState(false)
  useEffect(() => {
    if (init === false) {
      const event = new CustomEvent('fluidCreated', {
        bubbles: true,
        detail: {}
      })
      setTimeout(() => {
        document.dispatchEvent(event)
      }, 2000)
    }
    setInit(true)
  })

  return (
    <div id="rn-bg">
      <canvas id="fluid" width="1920px" height="919px" />
      <div className="rn-gradient-circle" />
      <div className="rn-gradient-circle theme-pink" />
    </div>
  )
}

export default Fluid
