import { useParams } from 'react-router-dom'

const AppointmentConfirm = () => {
  const { id } = useParams()

  return <div>AppointmentConfirm: {id}</div>
}

export default AppointmentConfirm
