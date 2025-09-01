import { useEffect } from "react"

const User = () => {

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

  return (
    <div>User</div>
  )
}

export default User