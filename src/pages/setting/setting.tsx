import { useEffect } from "react"

const Setting = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return <div>Setting</div>
}

export default Setting
