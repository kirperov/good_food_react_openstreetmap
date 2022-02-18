import React from "react";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Autocomplete } from "@react-google-maps/api";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlusSquare, faStar} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from "../assets/styles/add_restaurant.module.css";

library.add(faPlusSquare)

const AddRestaurant = ({ callbackAddRestaurant }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [newRestaurant, setNewRestaurant] = useState({});
  const [autocomplete, setAutocomplete] = useState();
  const onLoad = (autocompleted) => {
    setAutocomplete(autocompleted)
  };

  const onPlaceChanged = () => {
    try {
      setAddress(autocomplete.getPlace().formatted_address);
    } catch (error) {}
  };

  const addRestaurant = () => {
    if(autocomplete.getPlace().geometry) {
      setNewRestaurant({
        place_id: 10,
        name: name,
        vicinity: address,
        geometry:  {lat: autocomplete.getPlace().geometry.location.lat() , lng: autocomplete.getPlace().geometry.location.lng()},
        rating: 0,
        user_ratings_total: 0,
        reviews: []
      });
    }
    handleClose();
  };

  useEffect(() => {
    callbackAddRestaurant(newRestaurant);
  }, [newRestaurant]);

  return (
    <>
      <span><strong>Add restaurant </strong> </span><Button variant="primary" onClick={handleShow} className={style.add_restaurant_btn_modal}>
     <FontAwesomeIcon icon="plus-square"/>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className={style.add_restaurant_header} closeButton>
          <Modal.Title>Add new restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label><strong>Name:</strong></label>
            <input
              className={style.add_restaurant_input}
              onChange={(event) => {
                setName(event.target.value);
              }}
              type="text"
              placeholder="Enter name ..."
            />
            <br />
            <label><strong>Address:</strong></label>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                className={style.add_restaurant_input}
                onChange={(event) => {
                  setAddress(event.target.value);
                }}
                type="text"
                placeholder="Enter address ..."
              />
            </Autocomplete>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className={style.add_restaurant_btn_add} variant="success" onClick={addRestaurant}>
            Add
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddRestaurant;
