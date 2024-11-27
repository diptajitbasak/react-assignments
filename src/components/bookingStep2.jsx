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

const BookingStep2 = () => {
  return (
    <>
      <Card className="stepCard">
        <CardHeader>Select Signing &amp; Product Type</CardHeader>
        <CardBody>
          <div className="cardInerInfo">
            <h5>Signing Type</h5>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="radioOption" value="Mobile" />{" "}
                <span> Mobile</span> (We come to you!)
              </Label>
            </FormGroup>
            <FormGroup check inline>
              <Label check>
                <Input type="radio" name="radioOption" value="RON" />{" "}
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

export default BookingStep2;
