import style from "../assets/styles/list_restaurants.module.css";
import DetailRestaurant from "../components/DetailRestaurant";
import ReviewRestaurant from "../components/ReviewRestaurant";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMapPin} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faMapPin)

const ListRestaurants = (props) => {
  const getCallbackReview = (selectedRestaurant, index) => {
    props.listRestaurants[index] = selectedRestaurant;
    props.callbackReview(props.listRestaurants);
  };

  const callbackRestaurantWithReview = (newRestaurantWithReview) => {
    props.callbackRestaurantWithReview(newRestaurantWithReview)
  }

  const listItems = props.listRestaurants.map((restaurant, index) => (
    <div key={index}>
      <div className={style.list_restaurants_item}>
        <div className={style.restaurant_infos}>
          <span><strong>{restaurant.name}</strong></span>
          <span><FontAwesomeIcon icon="map-pin"/> Address: {restaurant.vicinity}</span>
          <span>Ratings ({restaurant.user_ratings_total})</span>
          <ReviewRestaurant
            restaurantRating={restaurant.rating}
          ></ReviewRestaurant>
        </div>
        <div className={style.restaurant_rating}>
          <DetailRestaurant
            selectedRestaurant={restaurant}
            callbackReviw={getCallbackReview}
            index={index}
            service={props.service}
            callbackRestaurantWithReview={callbackRestaurantWithReview}
            offlineData={props.offlineData}
          />
        </div>
      </div>
    </div>
  ));

  return (
    <div className={style.container_restaurants}>
      <div className={style.list_restaurants_items}>
        {(listItems.length > 0) ? listItems : "No data to show ..."}</div>
    </div>
  );
};

export default ListRestaurants;
