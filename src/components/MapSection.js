import { useState } from "react";
import Map from "./Map";
import ListRestaurants from "../components/ListRestaurants";
import style from "../assets/styles/map_section.module.css";
import { ErrorBoundary } from "react-error-boundary";
import Filter from "../components/Filter";
import OfflineButton from "./OfflineModeBtn"
import AddRestaurant from "./AddRestaurant";

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

const MapSection = () => {
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [service, setService] = useState();
  const [minFilterStar, setMinFilterStar] = useState();
  const [maxFilterStar, setMaxFilterStar] = useState();
  const [offlineData, setOfflineData ] = useState()
  const [addedRestaurant, setAddedRestaurant] = useState(null);
  
  const mapCallbackApiData = (restaurantApiData) => {
    let sortedRestaurantsData = [];
      for (let i = 0; i < restaurantApiData.length; i++) {
        sortedRestaurantsData.push({
          place_id: restaurantApiData[i].place_id,
          name: restaurantApiData[i].name,
          vicinity: restaurantApiData[i].vicinity,
          geometry: { lat: restaurantApiData[i].geometry.lat, lng: restaurantApiData[i].geometry.lng },
          rating: restaurantApiData[i].rating,
          user_ratings_total: restaurantApiData[i].user_ratings_total,
          reviews: restaurantApiData[i].reviews
        });
      }
      setRestaurantsList(sortedRestaurantsData);
  };

  const callbackMaxFilter = (min, max) => {
    setMinFilterStar(min);
    setMaxFilterStar(max);
  };
 
  const callbackGetService = (service) => {
    setService(service);
  };

  const callbackAddRestaurant = (newRestaurant) => {
    setRestaurantsList((restaurantsList) => [
      ...restaurantsList,
      newRestaurant,
    ]);
    setAddedRestaurant(newRestaurant);
  };

  const callbackOffline = (offlineData) => {
    setOfflineData(offlineData);
  }

  const getCallbackRestaurantWithReview = (newRestaurantWithReview) => {
    let restaurantIndex = restaurantsList.findIndex((restaurant => restaurant.place_id === newRestaurantWithReview.place_id));
    restaurantsList[restaurantIndex].rating = (restaurantsList[restaurantIndex].rating * restaurantsList[restaurantIndex].user_ratings_total + newRestaurantWithReview.reviews.at(-1).rating)/ (restaurantsList[restaurantIndex].user_ratings_total +1);
    restaurantsList[restaurantIndex].user_ratings_total = restaurantsList[restaurantIndex].user_ratings_total +1;
    restaurantsList[restaurantIndex].reviews = newRestaurantWithReview.reviews;
    mapCallbackApiData(restaurantsList)
  }

  return (
    <div>
      <div className={style.map_section}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Map
            newListRestaurants={restaurantsList}
            mapApiCallback={mapCallbackApiData}
            callbackGetServiceMap={callbackGetService}
            minFilterStar={minFilterStar}
            maxFilterStar={maxFilterStar}
            offlineData={offlineData}
            newRestaurant={addedRestaurant}
          />
          <div className={style.list_restaurants}>
            <div className={style.container_options}>
              <Filter callbackFilter={callbackMaxFilter} />
              <AddRestaurant callbackAddRestaurant={callbackAddRestaurant} />
              <OfflineButton callbackOffline={callbackOffline}></OfflineButton>
            </div>
            <ListRestaurants
              listRestaurants={restaurantsList}
              service={service}
              offlineData={offlineData}
              callbackRestaurantWithReview={getCallbackRestaurantWithReview}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default MapSection;
