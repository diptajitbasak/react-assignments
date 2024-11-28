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
  console.log("signingType>>", signingType);

  const handleRadioChange = (event) => {
    setSigningType(event.target.value);
  };

  const _getStandardFees = async () => {
    try {
     
        const agentID = "63997eef2475d90ca5205bd2"
        const response = await getStandardFees(agentID)
        console.log("response>>>", response);
        
    } catch {

    }
  }

  useEffect(() => {
    _getStandardFees()
  }, [])

  const handlePreviousAndNext = (buttonName) => {
    if (buttonName === "next") {
      onNext("3", "3");
    } else {
      onNext("1", "1");
    }
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
                <NavItem>
                  <NavLink className={"active"}>Real Estate Documents</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={""}>Legal General Documents</NavLink>
                </NavItem>
              </Nav>

              <TabContent activeTab={"1"}>
                <TabPane tabId="1">
                  <div className="productList">
                    <ul>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          Refinance ($10.33)
                        </div>
                      </li>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          Loan Mod ($10)
                        </div>
                      </li>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          Loan Application ($10)
                        </div>
                      </li>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          Home Equity ($10)
                        </div>
                      </li>
                    </ul>
                  </div>
                </TabPane>
                <TabPane tabId="2">
                  <div className="productList">
                    <ul>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />2 Party
                          Agreement ($10)
                        </div>
                      </li>
                      <li>
                        <div className="formLabel">
                          <Input type="checkbox" name="signing" />
                          Divorce Papers ($10)
                        </div>
                      </li>
                    </ul>
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
        <Button color="primary" outline onClick={() => handlePreviousAndNext("previous")}>
          <SvgIcons type={"logArrowLeft"} />
          Previous
        </Button>
        <div>
          <Button color="primary" className="ms-auto" onClick={() => handlePreviousAndNext("next")}>
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
