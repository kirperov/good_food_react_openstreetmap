import StarRatings from "react-star-ratings";

const ReviewRestaurant = (restaurantRating) => {

  return (
    <div>
      <StarRatings
        rating={restaurantRating.restaurantRating}
        starRatedColor="blue"
        numberOfStars={5}
        starDimension="2em"
        name="rating"
      />
    </div>
  );
};

export default ReviewRestaurant;
