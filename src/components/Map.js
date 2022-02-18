import React from "react";
import { useState, useEffect } from "react";
import style from "../assets/styles/map.module.css";
import marker from "../assets/images/cutlery.png";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import myPosition from "../assets/images/location.png";
import logo from "../assets/images/logo.png";
import L from 'leaflet';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 
library.add(faArrowRight);
const iconPerson = new L.Icon({
  iconUrl:myPosition,
  iconSize: new L.Point(40, 40),
  className: 'leaflet-div-icon'
});
const containerStyle = {
  height: "100%",
};


const Map = (props) => {
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [countNextLimit, setCountNextLimit] = useState({count: 0});
  // Default geolocation Marseille, France
  const [geolocation, setGeolocation] = useState({ lat: 43.2965, lng: 5.3698 });
  const [service, setService] = useState();
  const [restaurantsDataApiResults, setRestaurantsDataApiResults] = useState({
    data: [],
  });

  const setData = () => {
    if(props.offlineData) {
      // setRestaurantsDataApiResults({data: restaurants})
    } else {
    }
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

  useEffect(() => {
    setData();
   }, [props.offlineData]);

  const onLoad = (autocompleted) => {
    setAutocomplete(autocompleted);
    setData();
  };
  
  useEffect(() => {
    if(props.newRestaurant !== null) {
      if(Object.keys(props.newRestaurant).length > 0) {
        restaurantsDataApiResults.data.push(props.newRestaurant)
      }
    }
   }, [props.newRestaurant]);

  useEffect(() => {
    let filteredMinMax = showMinMaxRestaurantsResults(restaurantsDataApiResults.data);
    props.mapApiCallback(filteredMinMax);

   }, [props.minFilterStar, props.maxFilterStar]);

  const onPlaceChanged = () => {
    try {
      setGeolocation({
        lat: autocomplete.getPlace().geometry.location.lat(),
        lng: autocomplete.getPlace().geometry.location.lng(),
      });
      hideMsgAddressError();
    } catch (error) {
      showMsgAddressError();
    }
  };

  useEffect(() => {
    setData()
  }, [geolocation]);

  useEffect(() => {
    let filteredMinMax = showMinMaxRestaurantsResults(restaurantsDataApiResults.data);
    props.mapApiCallback(filteredMinMax);
  }, [restaurantsDataApiResults]);

  const showMinMaxRestaurantsResults = (filteredRestorantsMap) => {
    let filteredRestaurants = [];
    filteredRestorantsMap.forEach(element => {
      if(element.rating >= props.minFilterStar && element.rating <= props.maxFilterStar) {
        filteredRestaurants.push(element);
      }
    });
    return filteredRestaurants;
  };

  const initData = () => {
      for (let n = 0; n < restaurantsDataApiResults.data.length; n++) {
          for(let j = 0; j < props.newListRestaurants.length; j++) {
            if(props.newListRestaurants[j].place_id === restaurantsDataApiResults.data[n].place_id) {
              restaurantsDataApiResults.data[n].user_ratings_total = props.newListRestaurants[j].user_ratings_total;
              restaurantsDataApiResults.data[n].reviews = props.newListRestaurants[j].reviews
              restaurantsDataApiResults.data[n].rating = props.newListRestaurants[j].rating
            }
          }
      }
      return restaurantsDataApiResults;
  }

  // const checkBounds = () => {
  //   initData();
  //   if (bounds) {
  //     let sortedListRestaurants;
  //     if(props.offlineData) {
  //       sortedListRestaurants = restaurantsDataApiResults.data.filter(
  //         (restaurant) =>
  //           bounds.contains({
  //             lat: restaurant.geometry.lat,
  //             lng: restaurant.geometry.lng,
  //           })
  //       );
  //     } else {
  //       sortedListRestaurants = restaurantsDataApiResults.data.filter(
  //         (restaurant) =>
  //           bounds.contains({
  //             lat: (restaurant.geometry.location!==undefined) ? restaurant.geometry.location.lat() : restaurant.geometry.lat,
  //             lng: (restaurant.geometry.location!==undefined) ? restaurant.geometry.location.lng() : restaurant.geometry.lng,
  //           })
  //       );
  //     }
  //     let filteredRestaurantsWithMinMax = showMinMaxRestaurantsResults(sortedListRestaurants);
  //     props.mapApiCallback(filteredRestaurantsWithMinMax)
  //   }
  // };

  const showMsgAddressError = () => {
    document.getElementById("search-msg-error").style.display = "block";
  };

  const hideMsgAddressError = () => {
    document.getElementById("search-msg-error").style.display = "none";
  };

  const options = {
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
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
          style={{ height: "100vh" }}
          whenCreated={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
  );
};

export default React.memo(Map);
