// import {
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   FormGroup,
//   Input,
//   InputGroup,
//   InputGroupText,
//   Label,
//   ListGroup,
//   ListGroupItem,
//   Row,
// } from "reactstrap";
// import ReactDatetime from "react-datetime";
// import "react-datetime/css/react-datetime.css";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { timezoneList } from "../helper-methods";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import SvgIcons from "./SvgIcons";

// const BookingStep3 = ({ onNext }) => {
//   const handlePreviousAndNext = (buttonName) => {
//     if (buttonName === "next") {
//       onNext("4", "4");
//     } else {
//       onNext("2", "2");
//     }
//   };

//   return (
//     <>
//       <Card className="stepCard">
//         <CardHeader>Add Your Appointment Details</CardHeader>
//         <CardBody>
//           <Row>
//             <Col md={6}>
//               <FormGroup className="searchList">
//                 <Label>Appointment location</Label>
//                 <InputGroup>
//                   <InputGroupText>
//                     <FontAwesomeIcon icon={faMagnifyingGlass} />
//                   </InputGroupText>
//                   <Input placeholder="Search" className="w-full" />
//                 </InputGroup>
//                 <ListGroup>
//                   {" "}
//                   {/* {searchResult?.map((each, index) => {
//               return (
//                 <ListGroupItem
//                   key={each.place_id}
//                   className="cursorPointer"
//                   onClick={() => getPlaceDetail(each)}
//                 >
//                   {each.description}
//                 </ListGroupItem>
//               );
//             })} */}
//                 </ListGroup>
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup className="searchList">
//                 <Label>Select date</Label>
//                 <InputGroup>
//                   <ReactDatetime
//                     inputProps={{
//                       className: "form-control",
//                       placeholder: "Select Date",
//                       // value: formatDate(selectedDate),
//                       readOnly: true,
//                     }}
//                     initialValue={new Date()}
//                     value={""}
//                     onChange={(e) => {}}
//                     isValidDate={(current) => {}}
//                     dateFormat={true}
//                     closeOnSelect={true}
//                     timeFormat={false}
//                   />
//                   <InputGroupText>
//                     <SvgIcons type={"calendar"} />
//                   </InputGroupText>
//                 </InputGroup>
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup>
//                 <Label>Time Zone</Label>
//                 <Input type="select" name="timeZone">
//                   <option value="">Select</option>
//                   {timezoneList().map((item, index) => (
//                     <option key={index}>{item}</option>
//                   ))}
//                 </Input>
//               </FormGroup>
//             </Col>
//             <Col md={6}>
//               <FormGroup>
//                 <Label>Time </Label>
//                 <ReactDatetime
//                   inputProps={{
//                     className: "form-control",
//                     placeholder: "Select Start Time",
//                     value: "",
//                     readOnly: true,
//                   }}
//                   value={new Date()}
//                   onChange={(e) => {}}
//                   onClose={() => {}}
//                   dateFormat={false}
//                   timeFormat={true}
//                   timeConstraints={{
//                     minutes: { min: 0, max: 59, step: 15 },
//                   }}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//         </CardBody>
//       </Card>
//       <div className="tabAction">
//         <Button color="primary" outline onClick={() => handlePreviousAndNext("previous")}>
//           <SvgIcons type={"logArrowLeft"} />
//           Previous
//         </Button>
//         <div>
//           <Button
//             color="primary"
//             className="ms-auto"
//             onClick={() => handlePreviousAndNext("next")}
//           >
//             <i className="fa fa-spinner fa-spin mr-2" />
//             Next
//             <SvgIcons type={"logArrowRight"} />
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BookingStep3;

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import ReactDatetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { timezoneList } from "../helper-methods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SvgIcons from "./SvgIcons";
import { useEffect, useState } from "react";
import {
  googlePlaceDetails,
  googlePlaceSearch,
} from "../helper-methods/google-service";
import { useDispatch, useSelector } from "react-redux";
import { updateBooking } from "../redux/actions";
import moment from "moment";
import Toastify from "toastify-js";

const BookingStep3 = ({ onNext }) => {
  const [formFields, setFormFields] = useState({
    appointmentDate: "",
    time: "",
    locationSearched: "",
    timeZone: "",
  });
  const [placeSuggestions, setPlaceSuggestions] = useState([]);

  const [errors, setErrors] = useState({});

  console.log("formFields>>>", formFields);
  console.log("errors>>>", errors);

  const storedBookingData = useSelector((state) => state.bookingDataReducer);

  useEffect(() => {
    if (storedBookingData?.step3) {
      const updatedFormFields = {
        appointmentDate: storedBookingData?.step3?.appointmentDate || "",
        timeZone: storedBookingData?.step3?.timeZone || "",
        time: storedBookingData?.step3?.time || "",
        closingAddress: storedBookingData?.step3?.closingAddress || "",
        formattedAddress: storedBookingData?.step3?.closingAddress?.state || "",
        locationSearched: storedBookingData?.step3?.locationSearched || "",
      };
      setFormFields(updatedFormFields);
    }
  }, []);

  useEffect(() => {
    handleUpdateBooking(formFields);
  }, [formFields]);

  const dispatch = useDispatch();

  const handleUpdateBooking = (formFields) => {
    let updatedBookingData = { ...storedBookingData };
    // Update the step2 with the form fields and calculated product value
    updatedBookingData.step3 = {
      time: formFields?.time,
      appointmentDate: formFields?.appointmentDate,
      timeZone: formFields?.timeZone,
      locationSearched: formFields?.locationSearched,
      closingAddress: {
        line1: formFields?.closingAddress?.line1,
        line2: formFields?.closingAddress?.line2,
        city: formFields?.closingAddress?.city,
        state: formFields?.closingAddress?.state,
        zip: formFields?.closingAddress?.zip,
        county: formFields?.closingAddress?.county,
      },
    };

    dispatch(updateBooking(updatedBookingData));
  };
  // console.log("storedBookingData>>>", storedBookingData);

  const handlePreviousAndNext = async (buttonName) => {
    handleUpdateBooking(formFields);
    const isFormValid = await validateForm(formFields);
    // console.log("isFormValid" , isFormValid);

    if (isFormValid) {
      if (buttonName === "next") {
        onNext("4", "4");
      }
    }
    if (buttonName === "previous") {
      onNext("2", "2");
    }
  };

  const handleChangeTime = (date) => {
    const updatedFormFields = { ...formFields };
    updatedFormFields["time"] = date;

    setFormFields(updatedFormFields);
    validateForm(updatedFormFields);
  };

  const handleLocationSearch = async (event, name) => {
    console.log("name>>>", name);

    const updatedFormFields = { ...formFields };
    updatedFormFields[name] = event.target.value;
    setFormFields(updatedFormFields);
    validateForm(updatedFormFields);

    const searchValue = event.target.value;

    try {
      if (searchValue.length > 2) {
        // console.log("searchValue>>", searchValue);
        const googleSearch = await googlePlaceSearch(searchValue);
        // console.log("googleSearch>>", googleSearch);
        setPlaceSuggestions(googleSearch);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const validateForm = (updatedFormFields) => {
    const updatedErrors = { ...errors };
    let isFormValid = true;
    return new Promise((resolve) => {
      Object.keys(updatedFormFields).forEach((each) => {
        switch (each) {
          case "locationSearched":
            if (updatedFormFields?.locationSearched) {
              delete updatedErrors?.locationSearched;
            } else {
              updatedErrors.locationSearched = "*Required";
              isFormValid = false;
            }
            setErrors(updatedErrors);
            break;
          case "timeZone":
            if (updatedFormFields?.timeZone) {
              delete updatedErrors?.timeZone;
            } else {
              updatedErrors.timeZone = "*Required";
              isFormValid = false;
            }
            setErrors(updatedErrors);
            break;
          case "appointmentDate":
            if (updatedFormFields?.appointmentDate) {
              delete updatedErrors?.appointmentDate;
            } else {
              updatedErrors.appointmentDate = "*Required";
              isFormValid = false;
            }
            setErrors(updatedErrors);
            break;
          case "time":
            if (updatedFormFields?.time) {
              if (checkTime(updatedFormFields?.time)) {
                delete updatedErrors?.time;
              } else {
                updatedErrors.time = "Past time selected!";
                isFormValid = false;
              }
            } else {
              updatedErrors.time = "*Required";
              isFormValid = false;
            }
            setErrors(updatedErrors);
            break;

          default:
            break;
        }
      });
      setErrors(updatedErrors);
      resolve(isFormValid);
    });
  };

  const getPlaceDetail = async (locationSearched) => {
    console.log("locationSearched>>>", locationSearched);

    try {
      if (locationSearched?.place_id) {
        // console.log("locationSearched.place_id>>", locationSearched.place_id);
        const placeDetails = await googlePlaceDetails(
          locationSearched.place_id
        );
        // console.log("placeDetails>>", placeDetails);
        const updatedFormFields = { ...formFields };
        updatedFormFields["closingAddress"] = {
          line1: placeDetails?.street,
          line2: placeDetails?.address,
          city: placeDetails?.city,
          state: placeDetails?.state,
          zip: placeDetails?.postal,
          county: placeDetails?.county,
        };
        updatedFormFields["locationSearched"] = locationSearched?.description;
        setFormFields(updatedFormFields);
        handleUpdateBooking(updatedFormFields)
        setTimeout(() => {
          setPlaceSuggestions([]); 
        }, 100);
      } else {
        Toastify({
          text: "Invalid Address Selected!",
          title: "Title",
          duration: 1500,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1D9E53", 
          stopOnFocus: true,
          closeMethod: "fade",
          className: "custom-toast",
        }).showToast();

      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleChange = (event) => {
    // console.log("event>>>", event);

    let value = "";
    let name = event.target ? event.target.name : "appointmentDate"; 
    // console.log("name>>>", name);


    if (event && event._isValid) {
      name = event.target ? event.target.name : "appointmentDate";
      value = event; 
    } else if (event && event.target) {
      name = event.target.name;
      value = event.target.value; 
    }

    const updatedFormFields = { ...formFields };
    updatedFormFields[name] = value;
    setFormFields(updatedFormFields);
    validateForm(updatedFormFields);
  };

  const isValidDate = (current) => {
    const today = new Date().setHours(0, 0, 0, 0);
    
    return current.isSameOrAfter(today); 
  };

  const checkTime = (givenTime) => {
    const selectedDate = moment(formFields.appointmentDate); 
    const fullDateTime = selectedDate.set({
      hour: moment(givenTime).hour(),
      minute: moment(givenTime).minute(),
    }); // Combine the selected date with the selected time

    const now = moment();
    // console.log("fullDateTime>>", fullDateTime);
    
    if (fullDateTime.isBefore(now)) {
      return false; 
    } else if (fullDateTime.isSameOrAfter(now, "minute")) {
      return true; 
    }
  };

  return (
    <>
      <Card className="stepCard">
        <CardHeader>Add Your Appointment Details</CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <FormGroup className="searchList">
                <Label>Appointment location</Label>
                <InputGroup>
                  <InputGroupText>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </InputGroupText>
                  <Input
                    placeholder="Search"
                    value={formFields?.locationSearched || ""}
                    className="w-full"
                    onChange={(e) =>
                      handleLocationSearch(e, "locationSearched")
                    }
                  />
                </InputGroup>
                <ListGroup>
                  {placeSuggestions.length > 0 &&
                    placeSuggestions.map((each, index) => {
                      return (
                        <ListGroupItem
                          key={each.place_id}
                          className="cursorPointer"
                          onClick={() => getPlaceDetail(each)}
                        >
                          {each.description}
                        </ListGroupItem>
                      );
                    })}
                </ListGroup>
                {errors?.locationSearched && (
                  <p style={{ color: "red" }}>{errors?.locationSearched}</p>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="searchList">
                <Label>Select date</Label>
                <InputGroup>
                  <ReactDatetime
                    inputProps={{
                      className: "form-control",
                      placeholder: "Select Date",
                      readOnly: true,
                    }}
                    initialValue={""}
                    value={formFields.appointmentDate || new Date()}
                    name="appointmentDate"
                    isValidDate={isValidDate} // Prevent past dates, allow today
                    dateFormat={true}
                    onChange={handleChange}
                    closeOnSelect={true}
                    timeFormat={false}
                  />
                  <InputGroupText>
                    <SvgIcons type={"calendar"} />
                  </InputGroupText>
                </InputGroup>
                {errors?.appointmentDate && (
                  <p style={{ color: "red" }}>{errors?.appointmentDate}</p>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Time Zone</Label>
                <Input
                  type="select"
                  name="timeZone"
                  onChange={handleChange}
                  value={formFields?.timeZone}
                  disabled={storedBookingData?.step2?.signingType === "Mobile"}
                >
                  <option value="">Select</option>
                  {timezoneList().map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </Input>
                {errors?.timeZone && (
                  <p style={{ color: "red" }}>{errors?.timeZone}</p>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Time </Label>
                <ReactDatetime
                  inputProps={{
                    className: "form-control",
                    placeholder: "Select Start Time",
                    readOnly: true,
                  }}
                  value={formFields?.time}
                  name="time"
                  onChange={handleChangeTime}
                  onClose={() => {}}
                  dateFormat={false}
                  timeFormat={true}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 15 },
                  }}
                  // isValidDate={(current) => {
                  //   // Prevent past times (make sure the selected time is after the current time)
                  //   const now = new Date();
                  //   const selectedTime = current.toDate();
                  //   return selectedTime > now;
                  // }}
                />
                {errors?.time && <p style={{ color: "red" }}>{errors?.time}</p>}
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="tabAction">
        <Button
          color="primary"
          outline
          onClick={() => handlePreviousAndNext("previous")}
        >
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <div>
          <Button
            color="primary"
            className="ms-auto"
            onClick={() => handlePreviousAndNext("next")}
          >
            <i className="fa fa-spinner fa-spin mr-2" />
            Next
            <SvgIcons type={"logArrowRight"} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingStep3;
