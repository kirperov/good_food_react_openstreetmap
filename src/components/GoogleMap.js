import React from "react";
import { useRef, useState, useEffect } from "react";
import style from "../assets/styles/map.module.css";
import { restaurants } from '../assets/restaurants';
import marker from "../assets/images/cutlery.png";
import myPosition from "../assets/images/location.png";
import logo from "../assets/images/logo.png";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  GoogleMap,
  LoadScript,
  MarkerClusterer,
  Marker,
  Autocomplete
} from "@react-google-maps/api";
 
library.add(faArrowRight);
const containerStyle = {
  height: "100%",
};
const libraries = ["places"];
let getNextPage;
const Map = (props) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [countNextLimit, setCountNextLimit] = useState({count: 0});
  // Default geolocation Marseille, France
  const [geolocation, setGeolocation] = useState({ lat: 43.2965, lng: 5.3698 });
  const [service, setService] = useState();
  const [restaurantsDataApiResults, setRestaurantsDataApiResults] = useState({
    data: [],
  });
  const refMap = useRef(null);
  let bounds;
  if(refMap.current!==null) {
     bounds = refMap.current.state.map.getBounds();
  }

  const setData = () => {
    if(props.offlineData) {
      setRestaurantsDataApiResults({data: restaurants})
    } else {
      apiResultService();
    }
  }

  window.onload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setGeolocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
    setData();
  };

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

  const checkBounds = () => {
    initData();
    if (bounds) {
      let sortedListRestaurants;
      if(props.offlineData) {
        sortedListRestaurants = restaurantsDataApiResults.data.filter(
          (restaurant) =>
            bounds.contains({
              lat: restaurant.geometry.lat,
              lng: restaurant.geometry.lng,
            })
        );
      } else {
        sortedListRestaurants = restaurantsDataApiResults.data.filter(
          (restaurant) =>
            bounds.contains({
              lat: (restaurant.geometry.location!==undefined) ? restaurant.geometry.location.lat() : restaurant.geometry.lat,
              lng: (restaurant.geometry.location!==undefined) ? restaurant.geometry.location.lng() : restaurant.geometry.lng,
            })
        );
      }
      let filteredRestaurantsWithMinMax = showMinMaxRestaurantsResults(sortedListRestaurants);
      props.mapApiCallback(filteredRestaurantsWithMinMax)
    }
  };

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


  const getRestaurantsApi = () => {
    if(service) {
      new Promise((resolve, reject) => {
        service.nearbySearch(
          {
            location: geolocation,
            radius: 1500,
            type: "restaurant",
          },
          (results, status, pagination) => {
            if (status !== "OK" || !results) {
              return;
            }
            let setResult = [];
            results.forEach(result => {
              setResult.push({
                place_id: result.place_id,
                name: result.name,
                vicinity: result.vicinity,
                geometry: { lat: result.geometry.location.lat(), lng: result.geometry.location.lng() },
                rating: result.rating,
                user_ratings_total: result.user_ratings_total
              });
            });
            setRestaurantsDataApiResults({data: setResult});
            if (pagination && pagination.hasNextPage) {
              // Note: nextPage will call the same handler function as the initial call
              getNextPage = () => {
                setCountNextLimit({count: countNextLimit.count ++})
                pagination.nextPage();
              };
            }
          }
        );
      });
    }
  };

  const initService = () => {
    setService(
      new window.google.maps.places.PlacesService(refMap.current.state.map)
    );
  };

  const apiResultService = () => {
    getRestaurantsApi();
    props.callbackGetServiceMap(service);
  };

  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey={process.env.REACT_APP_API_KEY}
      libraries={libraries}
    >
      <div className={style.map}>
        <div className={style.nextRestaurantsContainer}>
          <div className={style.logo}>
            <img src={logo} alt="good food" />
          </div>
          <div className={style.nextBntContainer}>
            {(countNextLimit.count < 1) ? restaurantsDataApiResults.data.length > 0 ? <button onClick={getNextPage} className={style.nextRestaurantsBtn}> Show more restaurants <FontAwesomeIcon icon="arrow-right"/> </button> : "" :"No more restaurants"}
          </div>
        </div>
        <div id="search-msg-error" className={style.searchMsgError}>
          Veillez choisir l'adresse dans la liste
        </div>
        <GoogleMap
          ref={refMap}
          onBoundsChanged={checkBounds}
          onZoomChanged={checkBounds}
          options={options}
          id="google-map"
          mapContainerStyle={containerStyle}
          center={geolocation}
          zoom={15}
          onLoad={initService}
        >
          <Marker icon={myPosition} position={geolocation} />
          <MarkerClusterer
            minimumClusterSize={20}
            zoomOnClick={false}
            options={options}
          >
            {(clusterer) =>
              props.newListRestaurants.map((restaurantLocation) => (
                <Marker
                  icon={marker}
                  key={restaurantLocation.place_id}
                  position={{lat: restaurantLocation.geometry.lat, lng: restaurantLocation.geometry.lng}}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClusterer>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              onClick={hideMsgAddressError}
              onChange={hideMsgAddressError}
              id="inputSearch"
              type="text"
              placeholder={`Search address`}
              className={style.inputSearch}
            />
          </Autocomplete>
          <></>
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default React.memo(Map);
