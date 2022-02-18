import React from "react";
import { useState } from "react";
import style from "../assets/styles/detail_restaurant.module.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import StarRatings from "react-star-ratings";
import ReactStreetview from "react-streetview";
import AddReview from "./AddReview";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye , faComments, faUser, faMapMarkedAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faEye, faComments, faUser, faMapMarkedAlt);

const DetailRestaurant = ({selectedRestaurant, service, callbackRestaurantWithReview, offlineData}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [newUsername, setNewUsername] = useState();
  const [newComment, setNewComment] = useState();
  const [newRating, setNewRating] = useState(0);
  const [reviewsRestaurant, setReviewsRestaurant] = useState();

  const handleService = () => {
    if(selectedRestaurant.place_id && !offlineData) {
      if(typeof(selectedRestaurant.reviews) !== "undefined") {
        setReviewsRestaurant(selectedRestaurant);
      } else {
        service.getDetails(
          {
            placeId: selectedRestaurant.place_id,
          },
          function (place, status) {
              setReviewsRestaurant(place);
          }
        );
      }
    } else {
      setReviewsRestaurant(selectedRestaurant);
    }
  };

  const handleOnClick = () => {
    handleService();
    handleShow();
  };

  const updateRestaurant = () => {
      reviewsRestaurant.reviews.push({
        author_name: newUsername,
        rating: newRating,
        text: newComment,
      });
  
      setReviewsRestaurant(reviewsRestaurant);
      callbackRestaurantWithReview(reviewsRestaurant)
      getCallbackReview();
  };

  const getCallbackReview = (rating, comment, username) => {
    setNewUsername(username);
    setNewComment(comment);
    setNewRating(rating);
  };
  
  let streetViewPanoramaOptions;
  // see https://developers.google.com/maps/documentation/javascript/3.exp/reference#StreetViewPanoramaOptions
  if(typeof(selectedRestaurant.geometry) !== "undefined") {
     streetViewPanoramaOptions = {
      position: {
        lat: selectedRestaurant.geometry.lat,
        lng: selectedRestaurant.geometry.lng,
      },
      pov: { heading: 100, pitch: 0 },
      zoom: 1,
    };
  }

  const listItems = (
    <div
      className={style.detail_restaurant_container}
      key={selectedRestaurant.name}
    >
      <div className={style.detail_restaurant_street_view}>
        <ReactStreetview
          apiKey={process.env.REACT_APP_API_KEY}
          streetViewPanoramaOptions={streetViewPanoramaOptions}
        />
      </div>
      <div className={style.detail_restaurant_address}>
        <span>
          <strong><FontAwesomeIcon icon="map-marked-alt"/> </strong>
        </span>
        <span>{selectedRestaurant.vicinity}</span>
      </div>
      <div className={style.detail_restaurant_comments}>
        <AddReview callbackReviw={getCallbackReview} />
        <Button className={style.detail_restaurant_add_new_btn} variant="primary" onClick={updateRestaurant}>
          Add new review 
        </Button>
        <div className={style.detail_restaurant_comments_title}>
          <span>
            <strong>
              Comments <FontAwesomeIcon icon="comments"/> : ({reviewsRestaurant ? reviewsRestaurant.reviews.length : "0"})
            </strong>
          </span>
        </div>
        {reviewsRestaurant
          ? reviewsRestaurant.reviews.map((review, index) => {
              return (
                <div key={index} className={style.detail_restaurant_comment}>
                  <span>
                    <strong> <FontAwesomeIcon icon="user"/> {review.author_name} </strong>
                  </span>
                  <span>
                    {review.relative_time_description}
                  </span>
                  <StarRatings
                    rating={review.rating}
                    starRatedColor="blue"
                    numberOfStars={5}
                    starDimension="1em"
                    name="rating"
                  />
                  {review.text}
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );

  return (
    <>
      <Button className={style.detail_restaurant_details_btn} variant="primary" onClick={handleOnClick}>
        See <FontAwesomeIcon icon="eye"/>
      </Button>
      <Modal  fullscreen={true} show={show} onHide={handleClose}>
        <Modal.Header closeButton className={style.detail_restaurant_header}>
          <Modal.Title>{selectedRestaurant.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{listItems}</Modal.Body>
      </Modal>
    </>
  );
};

export default DetailRestaurant;
