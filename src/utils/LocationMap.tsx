import { memo } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '100%'
}

const LocationMap = ({ lat, lon }: { lat: number; lon: number }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY
  })

  const center = {
    lat: lat,
    lng: lon
  }

  if (loadError) return <div>Error loading map</div>
  if (!isLoaded) return <div>Loading Map...</div>

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
      <Marker position={center} />
    </GoogleMap>
  )
}
export default memo(LocationMap)
