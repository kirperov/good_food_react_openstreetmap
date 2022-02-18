import React from "react";
import style from "../assets/styles/detail_restaurant.module.css";
import ChangeRating from "../components/ChangeRating";
import { useState, useEffect } from "react";

const AddReview = ({ callbackReviw }) => {
  const [username, setUserName] = useState();
  const [comment, setComment] = useState();
  const [rating, setRating] = useState();

  const callbackRating = (rating) => {
    setRating(rating);
  };

  useEffect(() => {
    callbackReviw(rating, comment, username);
  }, [rating, comment, username]);

  return (
    <div className={style.detail_restaurant_review_form}>
      <span><strong>Your review </strong></span>
      <input
        placeholder="Enter your username"
        onChange={(event) => {
          setUserName(event.target.value);
        }}
        className={style.detail_restaurant_add_review}
      ></input>
      <textarea
        onChange={(event) => {
          setComment(event.target.value);
        }}
        className={style.detail_restaurant_add_review}
        placeholder="Write something ..."
      ></textarea>
      <ChangeRating callbackRating={callbackRating} />
    </div>
  );
};

export default AddReview;
