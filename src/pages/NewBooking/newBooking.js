/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import "./newBooking.scss";
import SpaceType from "./spaceType.js";
import FillDetails from "./FillDetails.js";

function newBooking() {
  const location = useLocation();
  const modifyFlag = location?.state?.modifyFlag;
  const bookingDetails =  location?.state?.bookingDetails;
  console.log(bookingDetails);

  return (
    <>
      <Container fluid className="p-5 new-booking-block">
        <Row>
          <p id="page-title">{`${modifyFlag ? 'Modify' : 'New'} Booking`}</p>
        </Row>
        <hr className="hr" />
        <Row className="p-2">
          <SpaceType />
          <hr className="hr" />
        </Row>
        <Row>
          <FillDetails />
        </Row>
      </Container>
    </>
  );
}

export default newBooking;
