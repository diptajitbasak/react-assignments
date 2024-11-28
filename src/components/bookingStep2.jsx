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

const BookingStep2 = ({ onNext }) => {
  const [signingType, setSigningType] = useState("Mobile");
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

  console.log("uniqueCategories>>>", uniqueCategories);

  const handleRadioChange = (event) => {
    setSigningType(event.target.value);
  };

  const _getStandardFees = async () => {
    try {
      const agentID = "63997eef2475d90ca5205bd2";
      const response = await getStandardFees(agentID);
      if (response) {
        setStandardFeeDetails(response); // Ensure response is stored as the complete object
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    _getStandardFees();
  }, []);

  const handlePreviousAndNext = (buttonName) => {
    if (buttonName === "next") {
      onNext("3", "3");
    } else {
      onNext("1", "1");
    }
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
                  checked={signingType === "Mobile"}
                  onChange={handleRadioChange}
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
                  checked={signingType === "RON"}
                  onChange={handleRadioChange}
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
                <TabPane tabId={activeTab}>
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
                          <li>
                            <div className="formLabel">
                              <Input type="checkbox" name="signing" />
                              {category.productType} (${category.productValue})
                            </div>
                          </li>
                        </ul>
                      ))}
                  </div>
                </TabPane>

               
              </TabContent>
            </div>
          </div>

          <div className="formGroup mt-4">
            <Label>Witness Number ($0 per Witness)</Label>
            <Input placeholder="Enter" />
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
