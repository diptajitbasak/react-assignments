import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardElement } from "@stripe/react-stripe-js";
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

const BookingStep4 = ({ onNext }) => {
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
                  <Input placeholder="Enter" name="email" />
                  {/* <InputGroupText>
                    <span className="text-error">Not Verified</span>
                  </InputGroupText> */}

                  {/* <InputGroupText>
                    <Button color="success">Verified</Button>
                  </InputGroupText> */}

                  {/* <InputGroupText>
                    <Button
                      color="primary"
                    >
                      Send OTP
                    </Button>
                  </InputGroupText> */}

                  {/* <InputGroupText>
                    <span className="text-success">Verified</span>
                  </InputGroupText> */}

                  <InputGroupText>
                    <Button color="link" className="p-0">
                      Check Email
                    </Button>
                  </InputGroupText>
                </InputGroup>

                {/* Show timer count down when otp is sent */}
                {/* <span className="resetOtpCount">
                  Don&apos;t receive the OTP? <span>29s</span>
                </span> */}

                <span className="mt-1 fs-11 d-block text-muted">
                  Enter your email to get 4 digit verify code!
                </span>
              </div>
            </Col>
            <Col lg={6} md={6}>
              <div className="formGroup">
                <Label>Enter the code sent to your email</Label>
                <InputGroup className="InputWithButton">
                  <Input placeholder="Enter" name="token" />

                  {/* show this when email is verified */}
                  {/* <InputGroupText>
                  <Button color="link" onClick={_verifyMail}>
                    verify
                  </Button>
                </InputGroupText> */}
                </InputGroup>

                {/* Show this when otp is sent with email address */}
                {/* <span className=" mt-1 fs-11 d-block text-muted">
                We have sent you a 4 digit code at{" "}
              </span> */}
              </div>
            </Col>
            <Col lg={6} md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input placeholder="Enter" name="name" />
              </FormGroup>
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
                  <Input placeholder="Enter" name="phone" />
                </InputGroup>
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
                    $50.33
                  </span>
                </li>
                <li>
                  <span>Processing Fee:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    $1.76
                  </span>
                </li>
                <li>
                  <span>Total:</span>
                  <span>
                    <FontAwesomeIcon icon={faDollarSign} />
                    $52.09
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
        <Button color="primary" outline onClick={() => handlePreviousAndNext("previous")}>
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <div>
          <Button color="primary" className="ms-auto" onClick={() => handlePreviousAndNext("book")}>
            <i className="fa fa-spinner fa-spin mr-2" />
            Book
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingStep4;
