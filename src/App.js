import "bootstrap/dist/css/bootstrap.min.css";
import "./global.scss";
import { Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import SvgIcons from "./components/SvgIcons";
import BookingStep1 from "./components/bookingStep1";
import BookingStep2 from "./components/bookingStep2";
import BookingStep3 from "./components/bookingStep3";
import BookingStep4 from "./components/bookingStep4";
import { GOOGLE_LOCATION_API_KEY, STRIPE_API_KEY } from "./config";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Providers } from "./redux/provider";

const stripePromise = loadStripe(STRIPE_API_KEY);
function App() {
  return (
    <>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_LOCATION_API_KEY}&libraries=places`}
      />
      <Providers>
        <Elements stripe={stripePromise}>
          <div className="bookingForm">
            <div className="personalWebsiteSetps">
              <div className="verticalTabs">
                <Nav pills>
                  <NavItem>
                    <NavLink className={"current"}>
                      <div className={"stepCount "}>
                        <SvgIcons type={"check"} /> 1
                      </div>
                      <span className="stepTitle">Order Details</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={"current"}>
                      <div className={"stepCount success"}>
                        <SvgIcons type={"check"} /> 2
                      </div>
                      <span className="stepTitle">
                        Signing &amp; Product Type
                      </span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={"active"}>
                      <div className={"stepCount "}>
                        <SvgIcons type={"check"} /> 3
                      </div>
                      <span className="stepTitle">Appointment Detailss</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className={"current"}>
                      <div className={"stepCount success"}>
                        <SvgIcons type={"check"} /> 4
                      </div>
                      <span className="stepTitle">
                        Person Placing &amp; Payment Details
                      </span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="tabContentWrapper">
                  <TabContent activeTab={"1"}>
                    <TabPane tabId="1">
                      {Number(1) === 1 ? <BookingStep1 /> : null}
                    </TabPane>
                    {/* <TabPane tabId="2">
                {Number(2) === 2 ? <BookingStep2 /> : null}
              </TabPane> */}
                    {/* <TabPane tabId="3">
                {Number(3) === 3 ? <BookingStep3 /> : null}
              </TabPane> */}
                    {/* <TabPane tabId="4">
                    {Number(4) === 4 ? <BookingStep4 /> : null}
                  </TabPane> */}
                  </TabContent>
                </div>
              </div>
            </div>
          </div>
        </Elements>
      </Providers>
    </>
  );
}

export default App;
