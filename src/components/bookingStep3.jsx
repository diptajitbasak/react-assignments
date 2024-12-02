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
  const [formFields, setFormFields] = useState({});
  const [placeSuggestions, setPlaceSuggestions] = useState([]);

  const [errors, setErrors] = useState("");

  console.log("formFields>>>", formFields);
  // console.log("errors>>>", errors);

  const storedBookingData = useSelector((state) => state.bookingDataReducer);

  useEffect(() => {
    if (storedBookingData.step3) {
      // Assuming storedBookingData has step2 with data
      const updatedFormFields = {
        appointmentDate: storedBookingData?.step3?.appointmentDate || "",
        timeZone: storedBookingData?.step3?.timeZone || "",
        time: storedBookingData?.step3?.time || "",
        closingAddress: storedBookingData?.step3?.closingAddress || "",
        formattedAddress: storedBookingData?.step3?.closingAddress?.state || "",
      };
      setFormFields(updatedFormFields);
      // setCheckboxSelections(updatedFormFields.checkboxSelections); // Ensure selections are set
    }
  }, []); // Ensure it runs when storedBookingData is available

  useEffect(() => {
    // if (formFields?.closingAddress) {
    handleUpdateBooking(formFields);
    // }
  }, [formFields]); // Trigger this when formFields change

  const dispatch = useDispatch();

  const handleUpdateBooking = (formFields) => {
    let updatedBookingData = { ...storedBookingData };
    // Update the step2 with the form fields and calculated product value
    updatedBookingData.step3 = {
      appointmentDate: formFields?.date,
      timeZone: formFields?.timeZone,
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

  const handlePreviousAndNext = (buttonName) => {
    handleUpdateBooking(formFields);

    const isFormValid = validateForm(formFields);
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
    const formattedTime = moment(date).format("HH:mm");
    console.log("formattedTime", formattedTime);

    setFormFields({
      ...formFields,
      time: date,
    });
  };

  const handleLocationSearch = async (event) => {
    const searchValue = event.target.value;
    // console.log("searchValue>>", searchValue);

    try {
      if (searchValue) {
        console.log("searchValue>>", searchValue);
        const googleSearch = await googlePlaceSearch(searchValue);
        // console.log("googleSearch>>", googleSearch);
        setPlaceSuggestions(googleSearch);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const validateForm = (updatedFormFields) => {
    let isvalid = true;
    if (storedBookingData?.step2?.signingType === "RON") {
      if (!updatedFormFields?.timeZone) {
        setErrors("*Please Select Time Zone"); // Show error if any array inside checkboxSelections is empty
        isvalid = false;
        return isvalid;
      } else {
        setErrors("");
        isvalid = true;
        return isvalid;
      }
    }
    return isvalid;
  };

  const getPlaceDetail = async (selectedPlace) => {
    console.log("selectedPlace>>>", selectedPlace);

    try {
      if (selectedPlace?.place_id) {
        // console.log("selectedPlace.place_id>>", selectedPlace.place_id);
        const placeDetails = await googlePlaceDetails(selectedPlace.place_id);
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
        updatedFormFields["selectedPlace"] = selectedPlace?.description;
        setFormFields(updatedFormFields);
        // handleUpdateBooking(updatedFormFields)
        setTimeout(() => {
          setPlaceSuggestions([]); // This will close the dropdown after a brief delay
        }, 100);
      } else {
        Toastify({
          text: "Invalid Address Selected!",
          title: "Title",
          duration: 1500,
          close: true,
          gravity: "top",
          position: "center",
          backgroundColor: "#1D9E53", // Parrot Green color
          stopOnFocus: true,
          closeMethod: "fade",
          className: "custom-toast",
        }).showToast();

        // alert("Ivalid Address Selected!");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  // const handleChange = (event) => {
  //   let value = "";
  //   let name = "date"; // Default name for handling the date

  //   // Check if the event is a moment object (from ReactDatetime)
  //   if (event && event._isValid) {
  //     name = event.target ? event.target.name : "date"; // Set default name if not from input
  //     value = event.format("DD/MM/YYYY"); // Format the date to 'DD/MM/YYYY HH:mm'
  //   } else if (event && event.target) {
  //     name = event.target.name;
  //     value = event.target.value; // Regular input value
  //   }

  //   // Update the formFields state with the formatted value
  //   const updatedFormFields = { ...formFields };
  //   updatedFormFields[name] = value;
  //   setFormFields(updatedFormFields);

  //   validateForm(updatedFormFields);
  //   handleUpdateBooking(updatedFormFields);
  // };

  // Function to check if the selected date is not in the past

  const handleChange = (event) => {
    let value = "";
    let name = event.target ? event.target.name : "appointmentDate"; // Default name for handling the date

    // Handle ReactDatetime for date and time
    if (event && event._isValid) {
      name = event.target ? event.target.name : "appointmentDate";
      value = event.format("DD/MM/YYYY"); // Format the date to 'DD/MM/YYYY'
    } else if (event && event.target) {
      name = event.target.name;
      value = event.target.value; // Regular input value
    }

    // Update the formFields state
    const updatedFormFields = { ...formFields };
    updatedFormFields[name] = value;
    setFormFields(updatedFormFields);

    // Optionally validate form after updating
    validateForm(updatedFormFields);
  };

  const isValidDate = (current) => {
    // Allow today's date, but prevent selecting past dates
    const today = new Date().setHours(0, 0, 0, 0); // Set to midnight to compare only dates
    return current.isSameOrAfter(today); // Allow today and any future date
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
                    value={formFields?.selectedPlace || ""}
                    className="w-full"
                    onChange={(e) => handleLocationSearch(e)}
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
                {errors && <p style={{ color: "red" }}>{errors}</p>}
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
                  onChange={handleChangeTime}
                  onClose={() => {}}
                  dateFormat={false}
                  timeFormat={true}
                  timeConstraints={{
                    minutes: { min: 0, max: 59, step: 15 },
                  }}
                  isValidDate={(current) => {
                    // Prevent past times (make sure the selected time is after the current time)
                    const now = new Date();
                    const selectedTime = current.toDate();
                    return selectedTime > now;
                  }}
                />
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
