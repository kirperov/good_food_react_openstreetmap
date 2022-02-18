import React from "react";
import restaurantsData from "../assets/restaurantsData.json";
import { useState, useEffect } from "react";
import style from "../assets/styles/map.module.css";
import marker from "../assets/images/cutlery.png";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import myPosition from "../assets/images/location.png";
import logo from "../assets/images/logo.png";
import L from 'leaflet';

const iconPerson = new L.Icon({
  iconUrl:myPosition,
  iconSize: new L.Point(40, 40),
  className: 'leaflet-div-icon'
});
const iconRestaurants = new L.Icon({
  iconUrl:marker,
  iconSize: new L.Point(40, 40),
  className: 'leaflet-div-icon'
});

const Map = (props) => {
  const [map, setMap] = useState(null);
  let bounds;
  if(map) {
    bounds = map.getBounds();
  }
  // Default geolocation Marseille, France
  const [geolocation, setGeolocation] = useState({ lat: 43.2965, lng: 5.3698 });
  const [restaurantsDataApiResults, setRestaurantsDataApiResults] = useState({
    data: [],
  });

  const setData = () => {
    setRestaurantsDataApiResults({data: restaurantsData.features})
  }

  window.onload = () => {
    setData();
  };

  function LocationMarker() {
    const map = useMapEvents({
      click: () => {
        map.locate()
      },
      locationfound(e) {
        setGeolocation(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      }
    })
  
    return geolocation === null ? null : (
      <Marker position={geolocation} icon={iconPerson}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  function CheckBoundsMap() {
  const map = useMapEvents({
      move: () => {
        bounds = map.getBounds();
        checkBounds();
      }
    })
    return null
  }

  useEffect(() => {
    if(props.newRestaurant !== null) {
      if(Object.keys(props.newRestaurant).length > 0) {
        restaurantsDataApiResults.data.push(props.newRestaurant)
      }
    }
   }, [props.newRestaurant]);

  useEffect(() => {
    props.mapApiCallback(restaurantsDataApiResults.data)
  }, [props.minFilterStar, props.maxFilterStar]);

  useEffect(() => {
    setData()
  }, [geolocation]);

  const checkBounds = () => {
    if (bounds) {
       let sortedListRestaurants;
       sortedListRestaurants = restaurantsDataApiResults.data.filter(
         (restaurant) =>
           bounds.contains({
             lat: restaurant.geometry.coordinates[1],
             lng: restaurant.geometry.coordinates[0],
           })
       )
      props.mapApiCallback(sortedListRestaurants)
    }
  };

  return (
      <div className={style.map}>
        <div className={style.nextRestaurantsContainer}>
          <div className={style.logo}>
            <img src={logo} alt="good food" />
          </div>
        </div>
        <MapContainer
          center={geolocation} zoom={15}
          style={{ height: "100%" }}
          whenCreated={setMap}
        >
          {restaurantsData.features.map(restaurant => (
          <Marker 
              icon={iconRestaurants}   
              key={restaurant.properties.osm_id}
              position={{lat: restaurant.geometry.coordinates[1], lng: restaurant.geometry.coordinates[0]}}>
          </Marker>
          ))}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          <CheckBoundsMap />
        </MapContainer>
      </div>
  );
};

export default React.memo(Map);
