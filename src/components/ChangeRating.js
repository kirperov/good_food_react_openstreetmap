import StarRatings from "react-star-ratings";
import { useState, useEffect } from "react";
import style from "../assets/styles/detail_restaurant.module.css";

const ChangeRating = ({ callbackRating }) => {
  const [rating, setRating] = useState();

  const changeRating = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    callbackRating(rating);
  }, [rating]);

  return (
    <div className={style.detail_restaurant_add_reviw_rating}>
      <StarRatings
        rating={rating}
        starRatedColor="blue"
        starEmptyColor="rgb(143, 143, 143)"
        starHoverColor="rgb(210, 161, 255)"
        numberOfStars={5}
        changeRating={changeRating}
        starDimension="1.5em"
        name="rating"
      />
    </div>
  );
};

export default ChangeRating;
