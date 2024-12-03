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
import { emailDotFormat } from "../helper-methods";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { STRIPE_API_KEY } from "../config";
import { clearBooking, updateBooking } from "../redux/actions";
import { toast } from "react-toastify";
import Successfull from "./Successfull";

const BookingStep4 = ({ goPrevious, goNext }) => {
  const reduxStep2Data = useSelector((state) => {
    return state?.bookingDataReducer?.step2;
  });
  console.log(reduxStep2Data);
  const [email, setEmail] = useState("");
  const [emailDot, setEmailDot] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [tokenCode, setTokenCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [error, setError] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [timer, setTimer] = useState(0);
  const [showTimer, setShowTimer] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [stripePromise, setStripePromise] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const _toggleModal = (isOpenModal = false) => {
    setIsOpenModal(isOpenModal);
  };

  const reduxStep4Data = useSelector((state) => {
    return state?.bookingDataReducer?.step2;
  });
  const allStateData = useSelector((state) => {
    return state?.bookingDataReducer;
  });

  const dispatch = useDispatch();

  const intializeStrip = () => {
    if (!stripePromise) {
      const stripeRes = loadStripe(STRIPE_API_KEY);
      setStripePromise(stripeRes);
    }
  };
  useEffect(() => {
    intializeStrip();
  }, []);

  const handleUserDetailsApi = async () => {
    setIsLoading(true);
    const payload = {
      agentId: "63997eef2475d90ca5205bd2",
      email: email,
    };
    try {
      const response = await getDetailsWithEmail(payload);
      setUserDetails(response?.user);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    setFormData({
      name: userDetails?.name?.full || "",
      phone: userDetails?.phone || "",
    });
  }, [userDetails]);

  useEffect(() => {
    let timerId;

    if (showTimer && timer > 0) {
      timerId = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowTimer(false);
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [showTimer, timer]);

  const handleverifyEmailApi = async () => {
    setIsLoading(true);
    const payload = {
      agentId: "63997eef2475d90ca5205bd2",
      email: email,
    };
    try {
      const response = await sendOtpEmailForBooking(payload);
      if (response) {
        toast.success("OTP sent succesfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,

          theme: "light",
        });
        setTimer(59);
        setShowTimer(true);
      }
      setEmailDot(emailDotFormat(email));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCodeApi = async () => {
    setIsLoading(true);
    const payload = {
      agentId: "63997eef2475d90ca5205bd2",
      email: email,
      token: tokenCode,
    };
    try {
      const response = await verificationForBooking(payload);
      if (response) {
        setShowTimer(false);
        setIsVerified(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };
  const handleBlur = (name) => {
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let newError = { ...error };

    if (value === "") {
      newError[name] = "*Required";
    } else {
      newError[name] = "";
    }

    setError(newError);
  };
  const validForm = () => {
    console.log(formData);
    let newError = {};
    let isValid = true;
    if (formData.name === "") {
      newError.name = "*Required";
      isValid = false;
    }
    if (formData.phone === "") {
      newError.phone = "*Required";
      isValid = false;
    }
    if (email === "") {
      newError.email = "*Required";
      isValid = false;
    }
    if (Object.keys(newError).length > 0) {
      setError(newError);
    }
    console.log(newError);

    return isValid;
  };

  const handleBook = async () => {
    if (validForm()) {
      const cardElement = elements.getElement(CardElement);
      let payload = {};
      await stripe.createToken(cardElement).then(function (result) {
        payload = {
          websiteOwnerId: "63997eef2475d90ca5205bd2",
          token: result?.token?.id,
          clientId: "653f8c6d3cea37b5bc3f50c8",
        };
        console.log(result.token.id);
      });
      try {
        const stripeCardResponse = await agentClientAddAndSetDefaultCard(
          payload
        );
        console.log(stripeCardResponse);
        if (!stripeCardResponse.error) {
          const payload = {
            ...allStateData.step1,
            ...allStateData.step2,
            ...allStateData.step3,
            agentId: "63997eef2475d90ca5205bd2",
            clientId: "653f8c6d3cea37b5bc3f50c8",
            totalAmount: Number(totalAmount.toFixed(2)),
          };
          console.log("payload", payload);
          const bookClosingApiRes = await createBooking(payload);
          if (!bookClosingApiRes.error) {
            setIsOpenModal(true);
          }

          if (!bookClosingApiRes?.error) {
            toast.success("Successfully Booking", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

              theme: "light",
            });

            dispatch(clearBooking());
          } else {
            toast.error("Payment Fail", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

              theme: "light",
            });
          }
          console.log(bookClosingApiRes);
          //
        }
      } catch (err) {
        console.log("stripe Card Response not found");
      }
    }
  };

  useEffect(() => {
    const pFee = Number(reduxStep4Data?.agentFee) * (3.5 / 100);
    setProcessingFee(pFee);
    const amountTotal = Number(reduxStep4Data?.agentFee) + pFee;
    setTotalAmount(amountTotal);
  }, [reduxStep4Data?.agentFee]);
  return (
    <>
      <Card className="stepCard">
        <CardHeader>Person Placing The Order</CardHeader>
        <CardBody>
          <Row>
            {/* Email Section */}
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Email</Label>
                <InputGroup className="InputWithButton">
                  <Input
                    placeholder="Enter"
                    name="email"
                    onBlur={() => handleBlur("email")}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!isVerified ? (
                    !userDetails ? (
                      <InputGroupText>
                        <Button
                          color="link"
                          className="p-0"
                          onClick={handleUserDetailsApi}
                          disabled={isLoading}
                        >
                          {isLoading ? <Spinner size="sm" /> : "Check Email"}
                        </Button>
                      </InputGroupText>
                    ) : (
                      <InputGroupText>
                        {showTimer ? (
                          timer > 9 ? (
                            <Button color="info">00:{timer}</Button>
                          ) : (
                            <Button color="info" style={{ color: "red" }}>
                              00:{timer}
                            </Button>
                          )
                        ) : (
                          <Button
                            color="primary"
                            onClick={handleverifyEmailApi}
                            disabled={isLoading}
                          >
                            {isLoading ? <Spinner size="sm" /> : "Send OTP"}
                          </Button>
                        )}
                      </InputGroupText>
                    )
                  ) : (
                    <InputGroupText>
                      <Button color="success">Verified</Button>
                    </InputGroupText>
                  )}
                </InputGroup>
                <span className="mt-1 fs-11 d-block text-muted">
                  Enter your email to get 4 digit verification code!
                </span>
              </FormGroup>
              {error.email && (
                <span style={{ color: "red" }}>{error.email}</span>
              )}
            </Col>

            {/* OTP Section */}
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Enter the code sent to your email</Label>
                <InputGroup className="InputWithButton">
                  <Input
                    placeholder="Enter"
                    name="token"
                    onChange={(e) => setTokenCode(e.target.value)}
                  />
                  <InputGroupText>
                    <Button
                      color="link"
                      onClick={handleVerifyCodeApi}
                      disabled={isLoading || isVerified || !showTimer}
                      style={{ display: isVerified ? "none" : "inline" }}
                    >
                      {isLoading ? <Spinner size="sm" /> : "Verify"}
                    </Button>
                  </InputGroupText>
                </InputGroup>
                {emailDot && (
                  <span className="mt-1 fs-11 d-block text-muted">
                    We have sent you a 4-digit code at {emailDot}
                  </span>
                )}
              </FormGroup>
            </Col>

            {/* Name Section */}
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  placeholder="Enter"
                  name="name"
                  value={formData.name}
                  onBlur={() => handleBlur("name")}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </FormGroup>
              {error.name && <span style={{ color: "red" }}>{error.name}</span>}
            </Col>

            {/* Phone Number Section */}
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Phone Number</Label>
                <InputGroup className="withCountryCode">
                  <InputGroupText>
                    <Input type="select">
                      <option>+1</option>
                    </Input>
                  </InputGroupText>
                  <Input
                    placeholder="Enter"
                    name="phone"
                    value={formData.phone}
                    onBlur={() => handleBlur("phone")}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {error.phone && (
                <span style={{ color: "red" }}>{error.phone}</span>
              )}
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
                    {reduxStep2Data?.agentFee || 0}
                  </span>
                </li>
                <li>
                  <span>Processing Fee:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    {Number(processingFee?.toFixed(2)) || 0}
                  </span>
                </li>
                <li>
                  <span>Total:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    {Number(totalAmount?.toFixed(2)) || 0}
                  </span>
                </li>
              </ul>
            </Col>
            <Col>
              <FormGroup>
                <Label>Card Details</Label>
                <div className="stripeWrapper">
                  <CardElement onChange={() => {}} />
                </div>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="tabAction">
        <Button color="primary" outline onClick={goPrevious}>
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <Button color="primary" className="ms-auto" onClick={handleBook}>
          <i className="fa fa-spinner fa-spin mr-2" />
          Book
          <SvgIcons type={"logArrowRight"} />
        </Button>
      </div>

      {isOpenModal && (
        <Successfull isOpen={isOpenModal} toggle={() => _toggleModal()} />
      )}
    </>
  );
};

export default BookingStep4;
