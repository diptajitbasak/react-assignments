import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Button,
} from "reactstrap";
import SvgIcons from "./SvgIcons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const LanguageList = [
  { label: "English", value: "English" },
  { label: "Russian", value: "Russian" },
  { label: "German", value: "German" },
  { label: "French", value: "French" },
  { label: "Italian", value: "Italian" },
  { label: "Spanish", value: "Spanish" },
  { label: "Mandarin", value: "Mandarin" },
  { label: "Japanese", value: "Japanese" },
  { label: "Korean", value: "Korean" },
  { label: "Vietnamese", value: "Vietnamese" },
  { label: "Hindi", value: "Hindi" },
  { label: "Portuguese", value: "Portuguese" },
  { label: "Arabic", value: "Arabic" },
  { label: "Hebrew", value: "Hebrew" },
  { label: "Swahili", value: "Swahili" },
  { label: "Tagalog", value: "Tagalog" },
  { label: "Haitian Creole", value: "Haitian Creole" },
  { label: "Polish", value: "Polish" },
  { label: "Urdu", value: "Urdu" },
  { label: "Persian", value: "Persian" },
  { label: "Other", value: "Other" },
];

const BookingStep1 = () => {
  return (
    <>
      <Card className="stepCard">
        <CardHeader>Add Your Order Details</CardHeader>
        <CardBody>
          <div className="cardInerInfo">
            <h5>Who are you booking for?</h5>
            <FormGroup check inline>
              <Input id="mainSigner" type="radio" name="bookingFor" />
              <Label for="mainSigner" check>
                I am the main signer
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Input id="bookingSomeone" type="radio" name="bookingFor" />
              <Label for="bookingSomeone" check>
                I am booking for someone else
              </Label>
            </FormGroup>
          </div>
          <div className="cardInerInfo">
            <h5>Basic Info</h5>
            <div className="SignerInfo">
              <div className="formGroup">
                <Label>Signer Name</Label>
                <Input placeholder="Enter" />
              </div>
              <div className="formGroup">
                <Label>Email ID</Label>
                <Input placeholder="Enter" />
              </div>
              <div className="formGroup ">
                <Label>Phone Number</Label>
                <InputGroup className="withCountryCode">
                  <InputGroupText>
                    <Input type="select">
                      <option>+1</option>
                    </Input>
                  </InputGroupText>
                  <Input placeholder="Enter" />
                </InputGroup>
              </div>
              <div className="formGroup">
                <Label>Language</Label>
                <Input type="select" name="language">
                  <option value="">Select</option>

                  {LanguageList.map((lang, index) => (
                    <option key={index} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </Input>
              </div>

              {/* Show when language is other */}

              {/* <div className="formGroup">
                <Label>Other Language</Label>
                <Input type="text" name="languageTypeOther"></Input>
              </div> */}
              <div className="action">
                <Button color="link" className="remove">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </div>
            </div>
            <Button color="link" size="sm">
              <FontAwesomeIcon icon={faPlus} /> Add New Person
            </Button>
          </div>
        </CardBody>
      </Card>
      <div className="tabAction">
        <Button color="primary" outline>
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <div>
          <Button color="primary" className="ms-auto">
            <i className="fa fa-spinner fa-spin mr-2" />
            Next
            <SvgIcons type={"logArrowRight"} />
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingStep1;
