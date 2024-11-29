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
import { useState } from "react";
import { googlePlaceSearch } from "../helper-methods/google-service";

const BookingStep3 = ({ onNext }) => {
  const [formFields, setFormFields] = useState({});
  console.log("formFields>>>", formFields);

  const handlePreviousAndNext = (buttonName) => {
    if (buttonName === "next") {
      onNext("4", "4");
    } else {
      onNext("2", "2");
    }
  };

  const handleLocationSearch = async (event) => {
    const searchValue = event.target.value;
    console.log("searchValue>>", searchValue);

    try {
      if (searchValue) {
        console.log("searchValue>>", searchValue);
        const googleSearch = await googlePlaceSearch(searchValue);
        console.log("googleSearch>>", googleSearch);
      }
    } catch (err) {
      console.log("err", err);
      
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to check if the selected date is not in the past
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
                    className="w-full"
                    onChange={(e) => handleLocationSearch(e)}
                  />
                </InputGroup>
                <ListGroup>
                  {" "}
                  {/* {searchResult?.map((each, index) => {
              return (
                <ListGroupItem
                  key={each.place_id}
                  className="cursorPointer"
                  onClick={() => getPlaceDetail(each)}
                >
                  {each.description}
                </ListGroupItem>
              );
            })} */}
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
                    initialValue={new Date()}
                    value={formFields.date || ""}
                    name="date"
                    isValidDate={isValidDate} // Prevent past dates, allow today
                    dateFormat={true}
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
                <Input type="select" name="timeZone" onChange={handleChange}>
                  <option value="">Select</option>
                  {timezoneList().map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </Input>
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
                  value={new Date()}
                  onChange={(e) => {}}
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
