import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import SvgIcons from "./SvgIcons";
import { useEffect, useState } from "react";
import { getStandardFees } from "../http/http-calls";
import { useDispatch, useSelector } from "react-redux";
import { updateBooking } from "../redux/actions";

const BookingStep2 = ({ onNext }) => {
  const [formFields, setFormFields] = useState({
    signingType: "Mobile",
  });
  const [errors, setErrors] = useState("");
  // console.log("errors>>", errors);

  const [checkboxSelections, setCheckboxSelections] = useState({});
  const [standardFeeDetails, setStandardFeeDetails] = useState();
  const [activeTab, setActiveTab] = useState("1");
  // Only calculate unique categories once standardFeeDetails is available
  const uniqueCategories = standardFeeDetails?.agent?.standardFees
    ? [
        ...new Set(
          standardFeeDetails.agent.standardFees.map(
            (item) => item.productCategory
          )
        ),
      ]
    : [];

  const storedBookingData = useSelector((state) => state.bookingDataReducer);
  // console.log("storedBookingData>>>", storedBookingData);
  console.log("checkboxSelections>>>", checkboxSelections);

  useEffect(() => {
    if (storedBookingData && storedBookingData.step2) {
      // Assuming storedBookingData has step2 with data
      const updatedFormFields = {
        witnessCount: storedBookingData.step2.witnessCount || "", // Make sure to handle default values
        loanTypeOther: storedBookingData.step2.loanTypeOther || "",
        loanCategories: storedBookingData.step2.loanCategories || [],
        loanType: storedBookingData.step2.loanType || "",
        signingType: storedBookingData.step2.signingType || "Mobile", // Default value if undefined
        checkboxSelections: storedBookingData.step2.checkboxSelections || {}, // Default to an empty object if undefined
      };
      setFormFields(updatedFormFields);
      setCheckboxSelections(updatedFormFields.checkboxSelections); // Ensure selections are set
    }
  }, [storedBookingData]); // Ensure it runs when storedBookingData is available

  const dispatch = useDispatch();

  const handleUpdateBooking = (formFields) => {

    const loanCategories = Object.keys(checkboxSelections);
    const loanType = Object.values(checkboxSelections).flat();
    console.log("loanCategories>>", loanCategories);
    console.log("loanType>>", loanType);
    
    let updatedBookingData = { ...storedBookingData };

    // Calculate productValue dynamically based on selected product categories
    let totalProductValue = 0;
    standardFeeDetails?.agent?.standardFees?.forEach((category) => {
      if (
        checkboxSelections[category.productCategory] &&
        checkboxSelections[category.productCategory].includes(
          category.productType
        )
      ) {
        totalProductValue += category.productValue;
      }
    });

    // Update the step2 with the form fields and calculated product value
    updatedBookingData.step2 = {
      witnessCount: formFields?.witnessCount || 0,
      loanTypeOther: formFields?.loanTypeOther,
      loanCategories: loanCategories, // array of strings of product Categories
      loanType: loanType, // array of strings of product type
      signingType: formFields?.signingType,
      checkboxSelections: checkboxSelections, // Store selections in redux
      productValue: totalProductValue + (formFields?.witnessCount * standardFeeDetails?.agent?.WitnessFee), // Calculate total product value
    };

    dispatch(updateBooking(updatedBookingData));
  };

  console.log("standardFeeDetails>>>", standardFeeDetails);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
    // handleUpdateBooking(formFields);
  };

  const _getStandardFees = async () => {
    try {
      const agentID = "63997eef2475d90ca5205bd2";
      const response = await getStandardFees(agentID);
      if (response) {
        setStandardFeeDetails(response); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    _getStandardFees();
  }, []);

  useEffect(() => {
    if (storedBookingData && storedBookingData.step2) {
      // Assuming storedBookingData has checkboxSelections in step2
      setCheckboxSelections(storedBookingData.step2.checkboxSelections || {});
    }
  }, [storedBookingData]); // This will make sure checkboxSelections is updated when storedBookingData is available

  const validateForm = (checkboxSelections) => {
    // Check if checkboxSelections has any non-empty arrays
    const isSelectionsEmpty = Object.values(checkboxSelections).every(
      (arr) => arr.length === 0
    );
    let isvalid = true;
    if (isSelectionsEmpty) {
      setErrors("*Required"); // Show error if any array inside checkboxSelections is empty
      isvalid = false;
      return isvalid;
    } else {
      setErrors("");
      isvalid = true;
      return isvalid;
    }
  };

  const handlePreviousAndNext = (buttonName) => {
    handleUpdateBooking(formFields);

    const isFormValid = validateForm(checkboxSelections);
    if (isFormValid) {
      if (buttonName === "next") {
        onNext("3", "3");
      }
    }
    if (buttonName === "previous") {
      onNext("1", "1");
    }
  };

  // const handleCheckboxChange = (category, productType, isChecked) => {
  //   setCheckboxSelections((prevSelections) => {
  //     const newSelections = { ...prevSelections };

  //     // Update the selection based on whether the checkbox was checked or unchecked
  //     if (!newSelections[category]) {
  //       newSelections[category] = [];
  //     }

  //     if (isChecked) {
  //       newSelections[category].push(productType); // Add productType to the category
  //     } else {
  //       newSelections[category] = newSelections[category].filter(
  //         (type) => type !== productType // Remove productType from the category
  //       );
  //     }

  //     return newSelections;
  //   });
  // };

  const handleCheckboxChange = (category, productType, isChecked) => {
    setCheckboxSelections((prevSelections) => {
      // Deep copy the prevSelections to avoid mutation
      const newSelections = { ...prevSelections };

      // Ensure we create a new array if category doesn't exist yet
      if (!newSelections[category]) {
        newSelections[category] = [];
      } else {
        // Create a copy of the existing array to avoid mutating the original array directly
        newSelections[category] = [...newSelections[category]];
      }

      // Update the selection based on whether the checkbox was checked or unchecked
      if (isChecked) {
        newSelections[category].push(productType); // Add productType to the category
      } else {
        newSelections[category] = newSelections[category].filter(
          (type) => type !== productType // Remove productType from the category
        );
      }
      validateForm(newSelections);

      return newSelections;
    });
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      <Card className="stepCard">
        <CardHeader>Select Signing &amp; Product Type</CardHeader>
        <CardBody>
          <div className="cardInerInfo">
            <h5>Signing Type</h5>
            <FormGroup check inline>
              <Label check>
                <Input
                  id="Mobile"
                  checked={formFields.signingType === "Mobile"}
                  onChange={handleChange}
                  type="radio"
                  name="signingType"
                  value="Mobile"
                />{" "}
                <span> Mobile</span> (We come to you!)
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input
                  id="RON"
                  checked={formFields.signingType === "RON"}
                  onChange={handleChange}
                  type="radio"
                  name="signingType"
                  value="RON"
                />{" "}
                <span>Remote Online</span> (Virtual signing * available in
                certain states) <i className="fa fa-info"></i>
              </Label>
            </FormGroup>
          </div>

          <div className="cardInerInfo">
            <h5>Product Type</h5>
            <div className="tabs">
              <Nav pills>
                {uniqueCategories.map((category, index) => {
                  const categoryName = category
                    .replace(/([A-Z])/g, " $1")
                    .trim(); // Format the category name
                  return (
                    <NavItem key={index}>
                      <NavLink
                        className={
                          activeTab === String(index + 1) ? "active" : ""
                        }
                        onClick={() => toggleTab(String(index + 1))} // Change active tab
                      >
                        {categoryName}
                      </NavLink>
                    </NavItem>
                  );
                })}
              </Nav>

              <TabContent activeTab={activeTab}>
                {/* <TabPane tabId = {activeTab}>
                  <div className="productList">
                  {standardFeeDetails?.agent?.standardFees.map((category, index) => {
                    return category = uniqueCategories[0]
                    <ul>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          {productType}{productValue}
                        </div>
                      </li>                     
                    </ul>
                    })}
                  </div>
                </TabPane> */}

                {/* <TabPane tabId={activeTab}>
                  <div className="productList">
                    {standardFeeDetails?.agent?.standardFees
                      .filter((category, index, self) => {
                        // Only include the category if it's the first occurrence of that productType within the same category
                        return (
                          category.productCategory ===
                            uniqueCategories[activeTab - 1] &&
                          self.findIndex(
                            (item) => item.productType === category.productType
                          ) === index
                        );
                      })
                      .map((category, index) => (
                        <ul key={category._id}>
                          {category.productValue > 0 ? (
                            <li>
                              <div className="formLabel">
                                <Input type="checkbox" name="signing" />
                                {category.productType
                                  .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
                                  .trim()}{" "}
                                (${category.productValue})
                              </div>
                            </li>
                          ) : (
                            ""
                          )}
                        </ul>
                      ))}
                  </div>
                </TabPane> */}

                <TabPane tabId={activeTab}>
                  <div style={{display:"flex",  flexWrap:"wrap"}} className="productList">
                    {standardFeeDetails?.agent?.standardFees
                      .filter((category, index, self) => {
                        return (
                          category.productCategory ===
                            uniqueCategories[activeTab - 1] &&
                          self.findIndex(
                            (item) => item.productType === category.productType
                          ) === index
                        );
                      })
                      .map((category) => (
                        <ul key={category._id}>
                          {category.productValue > 0 && (
                            <li>
                              <div className="formLabel" style={{margin:"10px",display:"flex", }}>
                                <Input
                                  type="checkbox"
                                  name="signing"
                                  checked={
                                    checkboxSelections[
                                      uniqueCategories[activeTab - 1]
                                    ] &&
                                    checkboxSelections[
                                      uniqueCategories[activeTab - 1]
                                    ].includes(category.productType)
                                  }
                                  onChange={(e) =>
                                    handleCheckboxChange(
                                      uniqueCategories[activeTab - 1],
                                      category.productType,
                                      e.target.checked
                                    )
                                  }
                                />
                                {category.productType
                                  .replace(/([A-Z])/g, " $1") // Add a space before each uppercase letter
                                  .trim()}{" "}
                                (${category.productValue})
                              </div>
                            </li>
                          )}
                        </ul>
                      ))}
                  </div>
                </TabPane>
              </TabContent>
            </div>
            {errors && <p style={{ color: "red" }}>{errors}</p>}
          </div>

          <div className="formGroup mt-4">
          <Label>Witness Number ({"$" + standardFeeDetails?.agent?.WitnessFee} per Witness)</Label>
          <Input
              name="witnessCount"
              placeholder="Enter Witness Number"
              type="number"
              value={formFields.witnessCount}
              onChange={handleChange}
            />
          </div>
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

export default BookingStep2;
