
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
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
  Row,
  Spinner,
} from "reactstrap";
import SvgIcons from "./SvgIcons";
import { useEffect, useState } from "react";
import {
  agentClientAddAndSetDefaultCard,
  createBooking,
  getDetailsWithEmail,
  sendOtpEmailForBooking,
  verificationForBooking,
} from "../http/http-calls";
import { useDispatch, useSelector } from "react-redux";
import { clearBooking } from "../redux/actions";
import Toastify from 'toastify-js';
import { formatDate, formatTime } from "../helper-methods";

const BookingStep4 = ({ onNext }) => {

  const [buttonName, setButtonName] = useState("Check Email");
  const [timer, setTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); 

  const [formFields, setFormFields] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  const [totalValue, setTotalValue] = useState();
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    phone: "",
  });
  const [isDirty, setIsDirty] = useState({
    email: false,
    name: false,
    phone: false,
  });
  // console.log("isDirty>>", isDirty);
  console.log("formFields>>", formFields);
  // console.log("errors>>", errors);
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const storedBookingData = useSelector((state) => state.bookingDataReducer);
  // console.log("storedBookingData>>>", storedBookingData);
  const processingFee = parseFloat(((storedBookingData?.step2?.productValue * 3.5) / 100).toFixed(2));
  useEffect(() => {

    if (storedBookingData?.step3) { 
      const formattedDate = formatDate(storedBookingData?.step3?.appointmentDate)
     
      console.log("formattedDate", formattedDate);
      const formattedTime = formatTime(storedBookingData?.step3?.time)
      console.log("formattedTime", formattedTime);
      setFormFields((prev) => ({
        ...prev,
        formattedDate : formattedDate,
        formattedTime : formattedTime
      }))
    }

      if (storedBookingData && processingFee) {
      const totalProductValue =
      parseFloat ((storedBookingData?.step2?.productValue + processingFee).toFixed(2));
      console.log("totalProductValue>>>", totalProductValue);
      
      setTotalValue(totalProductValue);
    }
  },[]);

  useEffect(() => {
    let interval;
    if (timer && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1); 
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
      setTimer(false);
    } 
    return () => clearInterval(interval); 
  }, [timer, countdown]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    const updatedFormFields = { ...formFields };
    updatedFormFields[name] = value;
    setFormFields(updatedFormFields);
    validateForm(updatedFormFields);
  };

  const handleBlur = (event) => {
    const { name } = event?.target;
    const updatedIsDirty = { ...isDirty };
    updatedIsDirty[name] = true;
    setIsDirty(updatedIsDirty);
    validateForm(formFields);
  };

  const markAllDirty = () => {
    return new Promise((resolve) => {
      Object.keys(isDirty).forEach((each) => {
        isDirty[each] = true;
      });
      setIsDirty(isDirty);
      resolve();
    });
  };

  const obfuscateEmail = (email) => {
    const [local, domain] = email.split("@");
    return local.slice(0, 3) + "*****" + "@" + domain;
  };

  const validateForm = (updatedFormFields) => {
    const updatedErrors = {};
    let isFormValid = true;

    Object.keys(updatedFormFields).forEach((each) => {
      switch (each) {
        case "name":
          if (!updatedFormFields?.name) {
            updatedErrors.name = "*Required";
            isFormValid = false;
          }
          break;

        case "email":
          if (!updatedFormFields?.email) {
            updatedErrors.email = "*Required";
            isFormValid = false;
          } else if (!emailRegex.test(updatedFormFields?.email)) {
            updatedErrors.email = "Invalid email!";
            isFormValid = false;
          }
          break;

        case "phone":
          if (!updatedFormFields?.phone) {
            updatedErrors.phone = "*Required";
            isFormValid = false;
          } else if (!phoneRegex.test(updatedFormFields?.phone)) {
            updatedErrors.phone = "Invalid phone no.!";
            isFormValid = false;
          }
          break;

        default:
          break;
      }
    });

    setErrors(updatedErrors); // Ensure errors are updated before returning isValid
    return isFormValid;
  };

  const handleButtons = async (event, name) => {
    if (name === "Check Email") {
      try {
        const payload = {
          agentId: "63997eef2475d90ca5205bd2",
          email: formFields.email,
        };
        const response = await getDetailsWithEmail(payload);
        console.log("response >>", response);
        if (response) {
          setButtonName("Send OTP");
        }
      } catch (error) {
        console.log(error);
      }
    } else if (name === "Send OTP") {
      setLoading(true);
      try {
        const payload = {
          agentId: "63997eef2475d90ca5205bd2",
          email: formFields.email,
        };
        const response = await sendOtpEmailForBooking(payload);
        console.log("response >>", response);
        if (response) {
          Toastify({
            text: "OTP has been sent successfully!",
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
          

          setTimer(true);
          setCountdown(60); // Reset countdown to 60 seconds
        }
      } catch (error) {
        // console(error);
      } finally {
        setLoading(false);
      }
    } else if (name === "Verify") {
      if (formFields.otp) {
        try {
          const payload = {
            agentId: "63997eef2475d90ca5205bd2",
            email: formFields.email,
            token: formFields.otp,
          };
          const response = await verificationForBooking(payload);
          console.log("response >>", response);
          if (response) {
            setButtonName("Verified");
            setTimer(false); // Reset the timer state

            const updatedFormFields = {...formFields}
            updatedFormFields["name"] = response?.user?.name?.full
            updatedFormFields["phone"] = response?.user?.phone
            setFormFields(updatedFormFields)
          
          }
        } catch (error) {
          Toastify({
            text: "Invalid OTP!",
            title: "Title",
            duration: 1500,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",  
            stopOnFocus: true,
            closeMethod: "fade",
            className: "custom-toast",
          }).showToast();
          setButtonName("Not Verified");
        }
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await markAllDirty();
      const isValid = validateForm(formFields);
      console.log("isValid >>", isValid);
      if (isValid) {
        if (!stripe || !elements) {
          return;
        }
        setIsProcessing(true);

        // Create a token from the card details
        const { token, error } = await stripe.createToken(
          elements.getElement(CardElement)
        );
        console.log("token>>", token);

        if (error) {
          console.log(error.message);
          setIsProcessing(false);
          return;
        }

        try {
          if (token) {
            const payload = {
              token: token?.id,
              websiteOwnerId: "63997eef2475d90ca5205bd2",
              clientId: "653f8c6d3cea37b5bc3f50c8",
            };
            const response = await agentClientAddAndSetDefaultCard(payload);
            console.log("response>>>", response);
            if (response) {
              const payload = {
                // create payload here using redux store
                agentId: "63997eef2475d90ca5205bd2",
                clientId: "653f8c6d3cea37b5bc3f50c8",
                borrower: storedBookingData?.step1?.borrower,
                signingType: storedBookingData?.step2?.signingType,
                loanType: storedBookingData?.step2?.loanType,
                loanCategories: storedBookingData?.step2?.loanCategories,
                loanTypeOther: storedBookingData?.step2?.loanTypeOther,
                witnessCount: storedBookingData?.step2?.witnessCount,
                appointmentDate: formFields?.formattedDate + " " + formFields?.formattedTime,
                // appointmentDate : "03/02/2025 10:32",
                closingAddress: storedBookingData?.step3?.closingAddress,
                timeZone: storedBookingData?.step3?.timeZone,
                isBookingMainSigner:
                  storedBookingData?.step1?.isBookingMainSigner,
                agentFee: storedBookingData?.step2?.productValue,
                totalAmount: totalValue,
              };
              console.log("payload", payload);
              
              const response = await createBooking(payload);
              if (response) {
                Toastify({
                  text: "Sucessfull Booking!",
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
                dispatch(clearBooking());
                onNext("1","1")

              }
            }
          }
        } catch {}
      }
    } catch (error) {
      // console(error);
    } finally {
      setLoading(false)
    }
  };
  const handlePreviousAndNext = (buttonName) => {
    if (buttonName === "previous") {
      onNext("3", "3");
    } else {
      onNext("4", "5");
    }
  };

  return (
    <>
      <Card className="stepCard">
        <CardHeader>Person Placing The Order</CardHeader>
        <CardBody>
          <Row>
            <Col lg={6} md={6}>
              <div className="formGroup">
                <Label>Email</Label>
                <InputGroup className="InputWithButton">
                  <Input
                    type="email"
                    placeholder="Enter your Email ID"
                    name="email"
                    onChange={(e) => handleChange(e)}
                    onBlur={handleBlur}
                  />

                  {buttonName === "Not Verified" && (
                    <InputGroupText>
                      <span style={{color:"red", fontSize:"15px"}} className="text-error">Not Verified</span>
                    </InputGroupText>
                  )}

                  {buttonName === "Verified" && (
                    <InputGroupText>
                      <Button color="success">Verified</Button>
                    </InputGroupText>
                  )}

                  {buttonName === "Send OTP" && (
                    <InputGroupText>
                      <Button
                        disabled={loading || timer}
                        color="primary"
                        onClick={(e) => handleButtons(e, "Send OTP")}
                      >
                        Send OTP
                      </Button>
                    </InputGroupText>
                  )}

                  {/* <InputGroupText>
                    <span className="text-success">Verified</span>
                  </InputGroupText> */}
                  {buttonName === "Check Email" && (
                    <InputGroupText>
                      <Button
                      disabled={!formFields?.email}
                        color="link"
                        className="p-0"
                        onClick={(e) => handleButtons(e, "Check Email")}
                      >
                        Check Email
                      </Button>
                    </InputGroupText>
                  )}
                </InputGroup>
                {isDirty?.email ? (
                  <p style={{ color: "red", fontSize: "15px" }}>
                    {errors?.email}
                  </p>
                ) : null}

              
                  {/* Show timer countdown when OTP is sent */}
                  {timer ? (
                  <span className="resetOtpCount">
                   Don&apos;t receive the OTP? : <span style={{color:"red", fontSize:"15px"}}>{countdown}s</span>
                  </span>
                ) : ""}

                
                {!timer && <span className="mt-1 fs-11 d-block text-muted">
                  Enter your email to receive an OTP!
                </span>}
                
              </div>
            </Col>
            <Col lg={6} md={6}>
              <div className="formGroup">
                <Label>Enter the code sent to your email</Label>
                <InputGroup className="InputWithButton">
                  <Input
                    placeholder="Enter the OTP"
                    name="otp"
                    onChange={handleChange}
                  />

                  {/* show this when email is verified */}
                  <InputGroupText>
                    <Button
                    disabled={!formFields?.otp}
                      color="link"
                      onClick={(e) => handleButtons(e, "Verify")}
                    >
                      verify
                    </Button>
                  </InputGroupText>
                </InputGroup>

                {/* Show this when otp is sent with email address */}
                {timer && (
                  <span className=" mt-1 fs-11 d-block text-muted">
                    We have sent you an OTP at{" "}
                    {obfuscateEmail(formFields.email)}
                  </span>
                )}
               
              </div>
            </Col>
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your Name"
                  name="name"
                  value={formFields?.name}
                  onChange={(e) => handleChange(e)}
                  onBlur={handleBlur}
                />
              </FormGroup>
              {isDirty?.name ? (
                <p style={{ color: "red", fontSize: "15px" }}>{errors?.name}</p>
              ) : null}
            </Col>
            <Col lg={6} md={6}>
              <div className="formGroup">
                <Label>Phone Number</Label>
                <InputGroup className="withCountryCode">
                  <InputGroupText>
                    <Input type="select">
                      <option>+1</option>
                    </Input>
                  </InputGroupText>
                  <Input
                    type="number"
                    placeholder="Enter your Phone No."
                    name="phone"
                    value={formFields?.phone}
                    onChange={(e) => handleChange(e)}
                    onBlur={handleBlur}
                  />
                </InputGroup>
                {isDirty?.phone ? (
                  <p style={{ color: "red", fontSize: "15px" }}>
                    {errors?.phone}
                  </p>
                ) : null}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Payment Section */}
      <Card className="stepCard">
        <CardHeader>Payment Process</CardHeader>
        <CardBody>
          <Row>
            <Col xl="auto">
              <ul className="agentAmount">
                <li>
                  <span>Agent Fee:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    {storedBookingData?.step2?.productValue ? (storedBookingData?.step2?.productValue).toFixed(2) : ""}
                  </span>
                </li>
                <li>
                  <span>Processing Fee:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    {processingFee}
                  </span>
                </li>
                <li>
                  <span>Total:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    {totalValue}
                  </span>
                </li>
              </ul>
            </Col>
            <Col>
              <div className="formGroup">
                <Label>Card Details</Label>
                <div className="stripeWrapper">
                  <CardElement onChange={() => {}} />
                </div>
              </div>
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
            disabled={loading}
            color="primary"
            className="ms-auto"
            onClick={() => handleSubmit("book")}
          >
            <i className="fa fa-spinner fa-spin mr-2" />
            Book
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingStep4;
