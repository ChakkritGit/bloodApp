import { useParams } from 'react-router-dom'

const AppointmentSearch = () => {
  const { id } = useParams()

  return <div>AppointmentSearch: {id}</div>
}

export default AppointmentSearch
