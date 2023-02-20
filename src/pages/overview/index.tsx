import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/strapi';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Planning() {
  const {
    isLoading,
    error,
    data: result,
  } = useQuery(['projects'], getProjects);
  if (isLoading) return <p>Loading...</p>;

  const fakeAddressLatLng = [
    { lat: 55.50997, lng: 9.768 },
    { lat: 55.52097, lng: 9.768 },
    { lat: 55.50197, lng: 9.738 },
    { lat: 55.53297, lng: 9.798 },
    { lat: 55.53297, lng: 9.898 },
    { lat: 55.53297, lng: 9.798 },
  ];

  return (
    <>
      <Map
        mapboxAccessToken={
          'pk.eyJ1IjoiZ3VsZGJlayIsImEiOiJjbGUyeDgzdWcwM2F1M3ZwbXBxODU4cjdnIn0.gGVj-wQGmVzzNTwqFSiOTA'
        }
        initialViewState={{
          longitude: 9.768,
          latitude: 55.50997,
          zoom: 12,
        }}
        style={{ width: '100%', height: 650 }}
        mapStyle="mapbox://styles/mapbox/light-v10"
      >
        {!isLoading &&
          result.data.map((project, index) => (
            <>
              <Marker
                longitude={fakeAddressLatLng[index]?.lng}
                latitude={fakeAddressLatLng[index]?.lat}
                key={index}
              >
                <div className="p-5 bg-white rounded-sm ">
                  <p className="font-bold">{project.attributes.name}</p>
                  <div className="mt-1 text-red-900 font-bold text-lg">
                    <img
                      src={`https://fakeface.rest/face/view/asdfd?gender=male`}
                      className="w-8 h-8 rounded-3xl inline-block mr-2"
                    />
                    Mads
                  </div>
                  <div className="mt-1 text-green-900 font-bold text-lg">
                    <img
                      src={`https://fakeface.rest/face/view/fdsa?gender=male`}
                      className="w-8 h-8 rounded-3xl inline-block mr-2"
                    />
                    Jørgen
                  </div>
                  <div className="mt-1 text-green-900 font-bold text-lg">
                    <img
                      src={`https://fakeface.rest/face/view/asdf?gender=male`}
                      className="w-8 h-8 rounded-3xl inline-block mr-2"
                    />
                    Erik
                  </div>
                </div>
              </Marker>
            </>
          ))}
      </Map>
    </>
  );
}
