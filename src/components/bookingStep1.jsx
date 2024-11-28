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
import { useState } from "react";

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

const BookingStep1 = ({ onNext }) => {
  const [bookingFor, setBookingFor] = useState('mainSigner');
  const [formFields, setFormFields] = useState([{}]);
  const [errors, setErrors] = useState([{}]);
  const [isDirty, setIsDirty] = useState([
    {
      signer: false,
      email: false,
      phone: false,
    },
  ]);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  // console.log("formFields>>>", formFields);
  // console.log("errors>>>", errors);
  // console.log("bookingFor>>>", bookingFor);

  const handleRadioChange = (event) => {
    setBookingFor(event.target.value); 
  };

  const handleChange = (index, event) => {
    const { value, name } = event.target;
    const updatedFormFields = formFields.map((field, i) =>
      i === index ? { ...field, [name]: value.trim() } : field
    );
    setFormFields(updatedFormFields);
    validateForm(updatedFormFields);
  };

  const handleBlur = (index, event) => {
    const { name } = event.target;
    const updatedIsDirty = [...isDirty];
    updatedIsDirty[index] = { ...updatedIsDirty[index], [name]: true };
    setIsDirty(updatedIsDirty);
    validateForm(formFields);
  };

  const markAllDirty = () => {
    return new Promise((resolve) => {
      const updatedIsDirty = isDirty.map((dirty) => ({
        signer: true,
        email: true,
        phone: true,
      }));
      setIsDirty(updatedIsDirty);
      resolve();
    });
  };

  const handleAdd = async () => {
    try {
      await markAllDirty();
      const isValid = await validateForm(formFields);
      if (isValid) {
        const newField = {
          signer: "",
          email: "",
          phone: "",
          language: "",
          id: Date.now(),
        }; // Unique ID added here
        setFormFields([...formFields, newField]);
        setErrors([...errors, { signer: "", email: "", phone: "" }]);
        setIsDirty([...isDirty, { signer: false, email: false, phone: "" }]);
      }
    } catch (error) {}
  };

  const handleDelete = (idToDelete) => {
    const updatedFormFields = formFields.filter(
      (field) => field.id !== idToDelete
    );
    const updatedErrors = errors.filter(
      (_, index) => formFields[index].id !== idToDelete
    );
    const updatedIsDirty = isDirty.filter(
      (_, index) => formFields[index].id !== idToDelete
    );
    setFormFields(updatedFormFields);
    setErrors(updatedErrors);
    setIsDirty(updatedIsDirty);
  };

  const validateForm = (updatedFormFields) => {
    return new Promise((resolve) => {
      const updatedErrors = updatedFormFields.map((field) => ({
        signer: "",
        email: "",
        phone: "",
      }));
      let isFormValid = true;

      updatedFormFields.forEach((field, rowIndex) => {
        if (!field.signer) {
          updatedErrors[rowIndex].signer = "*Required";
          isFormValid = false;
        }

        if (!field.email) {
          updatedErrors[rowIndex].email = "*Required";
          isFormValid = false;
        } else if (!emailRegex.test(field.email)) {
          updatedErrors[rowIndex].email = "*Invalid email";
          isFormValid = false;
        }

        if (!field.phone) {
          updatedErrors[rowIndex].phone = "*Required";
          isFormValid = false;
        } else if (!phoneRegex.test(field.phone)) {
          updatedErrors[rowIndex].phone = "*Invalid Phone No.";
          isFormValid = false;
        }
      });

      setErrors(updatedErrors);
      resolve(isFormValid);
    });
  };

  const handleNext = async () => {
    try {
      await markAllDirty();
      const isValid = await validateForm(formFields);
      if (isValid) {
          onNext("2", "2"); 
        // const agentID = "63997eef2475d90ca5205bd2"
        // const response = getStandardFees(agentID)
      }
    } catch {

    }
  }

  return (
    <>
      <Card className="stepCard">
        <CardHeader>Add Your Order Details</CardHeader>
        <CardBody>
          <div className="cardInerInfo">
            <h5>Who are you booking for?</h5>
            <FormGroup check inline>
              <Input
                id="mainSigner"
                type="radio"
                name="bookingFor"
                value="mainSigner"
                checked={bookingFor === "mainSigner"}
                onChange={handleRadioChange}
              />
              <Label for="mainSigner" check>
                I am the main signer
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                id="bookingSomeone"
                type="radio"
                name="bookingFor"
                value="someoneElse"
                checked={bookingFor === "someoneElse"}
                onChange={handleRadioChange}
              />
              <Label for="bookingSomeone" check>
                I am booking for someone else
              </Label>
            </FormGroup>
          </div>

          {formFields.map((fields, index) => (
            <div key={fields.id} className="cardInerInfo">
              {" "}
              {/* Use unique `fields.id` */}
              <h5>Basic Info</h5>
              <div className="SignerInfo">
                <div className="formGroup">
                  <Label>Signer Name</Label>
                  <Input
                    name="signer"
                    placeholder="Enter your Name"
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                  />
                  <div
                    className="formGroup"
                    style={{ color: "red", fontSize: "15px" }}
                  >
                    {isDirty[index]?.signer && (
                      <span>{errors[index]?.signer}</span>
                    )}
                  </div>
                </div>

                <div className="formGroup">
                  <Label>Email ID</Label>
                  <Input
                    name="email"
                    placeholder="Enter your Email ID"
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                  />
                  <div
                    className="formGroup"
                    style={{ color: "red", fontSize: "15px" }}
                  >
                    {isDirty[index]?.email && (
                      <span>{errors[index]?.email}</span>
                    )}
                  </div>
                </div>

                <div className="formGroup ">
                  <Label>Phone Number</Label>
                  <InputGroup className="withCountryCode">
                    <InputGroupText>
                      <Input type="select">
                        <option>+1</option>
                      </Input>
                    </InputGroupText>
                    <Input
                      name="phone"
                      placeholder="Enter your Phone No."
                      onChange={(e) => handleChange(index, e)}
                      onBlur={(e) => handleBlur(index, e)}
                    />
                  </InputGroup>
                  <div
                    className="formGroup"
                    style={{ color: "red", fontSize: "15px" }}
                  >
                    {isDirty[index]?.phone && (
                      <span>{errors[index]?.phone}</span>
                    )}
                  </div>
                </div>

                <div className="formGroup">
                  <Label>Language</Label>
                  <Input
                    type="select"
                    name="language"
                    onChange={(e) => handleChange(index, e)}
                    onBlur={(e) => handleBlur(index, e)}
                  >
                    <option value="">Select your Language</option>

                    {LanguageList.map((lang, index) => (
                      <option key={index} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </Input>
                </div>

                {formFields[index]?.language === "Other" && (
                  <div className="formGroup">
                    <Label>Other Language</Label>
                    <Input type="text" name="languageTypeOther"></Input>
                  </div>
                )}

                {formFields.length > 1 && (
                  <div className="action">
                    <Button
                      color="link"
                      className="remove"
                      onClick={() => handleDelete(fields.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button color="link" size="sm" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} /> Add New Person
          </Button>
        </CardBody>
      </Card>
      <div className="tabAction">
        <Button hidden color="primary" outline>
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <div>
          <Button color="primary" className="ms-auto" onClick={handleNext}>
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
