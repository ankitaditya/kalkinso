import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  Search,
  FluidForm,
  OrderedList,
  ListItem,
  IconButton,
  Tile,
  ButtonSet
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { AIReactDashboardConfig } from './AIReactConfig';
import AIReact from './AIReact';
import {
  Globe,
  Application,
  PersonFavorite,
  WatsonHealth3DSoftware,
  AiLaunch
} from '@carbon/react/icons';
// import { ShoppingCart } from '@carbon/react/icons'; // Uncomment if needed
import Login from '../Login/Login';
import HeroSection from '../LandingPage/HeroSection';
import TaskCarousel from '../LandingPage/TaskCarousel';
import { loadUser, setLoading } from '../../actions/auth';
import SearchPage from '../SearchPage';
import PDFViewer from './PDFViewer';

class LandingPage extends Component {
  componentDidMount() {
    // Optionally, dispatch actions to load user data
    // this.props.dispatch(setLoading(true));
    // this.props.dispatch(loadUser({ token: localStorage.getItem('token') }));
    // Create new plugin instance
  }

  /**
   * Renders the FluidForm that shows authentication buttons (if not logged in)
   * and always shows the IconButtons for 3D Designer and Services.
   */
  renderAuthButtons() {
    const { isAuthenticated } = this.props.auth || {};

    return (
      <FluidForm style={{ marginTop: '35px' }}>
        {/* Show Sign Up & Login only when the user is not authenticated */}
        {!isAuthenticated && (
          <>
            <Button href="/#/register">Sign Up</Button>
            <Button kind="secondary" href="/#/login">
              Login
            </Button>
          </>
        )}

        {/* Always available: Direct access to tool demos */}
        <IconButton
          style={{ minWidth: '106px' }}
          href="/3d/editor"
          label="3D Designer"
          kind="primary"
        >
          <WatsonHealth3DSoftware style={{ marginLeft: '15px' }} />
          <span style={{ marginLeft: '5px', marginRight: '15px' }}>3D Desi</span>
        </IconButton>
        <IconButton
          style={{ minWidth: '106px' }}
          href="https://www.kalkinso.com/#/services"
          label="Services"
          kind="secondary"
        >
          <AiLaunch style={{ marginLeft: '15px' }} />
          <span style={{ marginLeft: '5px', marginRight: '15px' }}>Services</span>
        </IconButton>
      </FluidForm>
    );
  }

  render() {
    return (
      <Grid className="landing-page" fullWidth>
        {/* Top (Hero) Section */}
        {/* <Column lg={16} md={8} sm={4} className="landing-page__banner">
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem href="#/Home">Home</BreadcrumbItem>
            <BreadcrumbItem href="#" isCurrentPage>
              Landing Page
            </BreadcrumbItem>
          </Breadcrumb>
          <HeroSection ButtonComponent={this.renderAuthButtons()} />
        </Column> */}
        <Column lg={16} md={8} sm={4} className="landing-page__r2">
          <Tabs defaultSelectedIndex={0}>
            <TabList className="tabs-group" aria-label="Tab navigation" style={{
                zIndex: 999,
            }}>
              <Tab>Idea</Tab>
              <Tab>Work</Tab>
              <Tab>Invest</Tab>
              {/* <Tab>Join</Tab> */}
            </TabList>
            <TabPanels>
              {/* Tab 1: Search */}
              <TabPanel>
                <AIReact config={AIReactDashboardConfig} />
              </TabPanel>

              {/* Tab 2: Connect */}
              <TabPanel>
                <SearchPage />
              </TabPanel>

              {/* Tab 3: Earn */}
              <TabPanel>
              <Grid className="investment-collection-content">
                <Column
                    lg={16}
                    md={8}
                    sm={4}
                    className="investment-collection__tab-content">
                    <Grid>
                    {/* Pitch Plan Showcase */}
                    <Column
                        lg={8}
                        md={6}
                        sm={4}
                        className="investment-process-column">
                        <center><h4>Pitch Plan</h4></center>
                        <PDFViewer file='https://s3.ap-south-1.amazonaws.com/kalkinso.com/output/svl4.pdf?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEGEaCmFwLXNvdXRoLTEiRjBEAiAfYQ0M7uKpV0jHLd9nmbj28WOC6rk5%2BHWvnxdu5jHUKAIgIR2Pys4eYY8tSDearqbTuoqEka%2BNbCHhikV5GZNLALUq1AMIiv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw5NzUwNTAwNTk4NDUiDBbNne6IG7lApIYJsSqoA6KMdAxb2SqmQb555GgugeCC72ztenWD9s4n3cmxPCwTeR%2Ft9rjLtkKpm%2FmDsQJuR30%2BmO0DbzEJ6OfmHbKfGrq9l3XdaTZiQWyj7XwfGkmDUw459ZI9JqVrK7iGI7BDsdHpDqzaxlrpKq%2BKNrPaZJIGLDwcmI%2FdxR77bYbKnVfwJkjM5ZtHFr%2BpY3ev%2F8mkmyUa2o0wLUFrmZCfQwhMpghmLsqiAFFkhwNRfsQ1QG6CPili%2BuFTys0UkaxdHdg2%2BLmK26rBeQW2VMlDVXltcTm59rrTVKyG5%2BqdY9Vw5sOkrlYjaPrtwcjlUxVPevYksHB42Ym0dGuFEL%2BAyn9Web0YbNs%2B3KH1vTAZmHIWbdECcmvLY2yZYOMysJ0G7hHMCJiu%2FycHS6Hf6%2FcV%2FxTZSRJaN30RNGrG6hagQ%2BkSBShEosZFqpoLn15z9DdsNI1gnm0vbULU74ZHLJkN84hrBiv13UsEEoTGPOc2a6QmkUd5sMgPi7xeKxUd59eILEI4u3HT9wy0wMYtQnXR7NeC5gVqqq0r6XABjtWP0oQSkkTkAGnZ%2F4MstuAwn5vRvQY65QIcWg76OL%2B9sbdj5nqbSxDWkTyrMFDF%2BtLqQH3%2F7wWbGCb31HtriX9HmyVA5HeMtofRP%2B%2FBAoTn%2B6Syqp8qfiZ7x2YXd64t5yuo%2BwXshZq1BK8YY2suFIHb0MHhMmCRfoNWlfB0c1zk%2F8IrDS77LgxxVk9jCHXEMtCYpmdSv1C5U5Kz8pJc3reBFMOzkqDSN46FAzXOYGPqJKBxQ9%2BqJCaIQByhCwAV2maCvL%2BWJDkjOZhs%2FEWMFPMJWvydkphv1V2DrEedaU3KXrSZ3CjT02PuzHP%2BwVNLosN8wlzwTD5HxaUW1nDZIxJGQsCdoPslr18ve3T%2FLNP8hcLnGiEDTAVbEhCpzigISjSsZjzKG368md9IKrQqqxUSyLNXAw2eodhTMg1sostzDdmtmkRSuQc98P2yuYfkI8zLtuea4pI35ctpP91HlvbyrmncGoqF%2BcDcS4b%2F7jv477SFU6GUyzffn308pEw%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6GBMDGBCX4USTRQP%2F20250218%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250218T090840Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=fdaa7d05b623fe6f58fc9357f2391f7f88b372f55f22c87b767911111a1f57fa' />
                    </Column>

                    {/* Live Demos & Delivered Solutions */}
                    <Column
                        lg={8}
                        md={6}
                        sm={4}
                        className="investment-demo-showcase">
                        <center><h4>Demos & Deliveries</h4></center>
                        <TaskCarousel />
                    </Column>
                    </Grid>
                </Column>
                </Grid>

              </TabPanel>

              {/*
              <TabPanel>
                <Login />
              </TabPanel>
              */}
            </TabPanels>
          </Tabs>
        </Column>

        {/* Middle Tabs Section */}
        

        {/* NEW: AI-Human Synergy Section */}
        {/* <Column
          lg={16}
          md={8}
          sm={4}
          className="landing-page__ai-synergy"
          style={{ marginBottom: '2rem' }}>
          <h2
            className="landing-page__subheading"
            style={{ textAlign: 'center', marginBottom: '1rem' }}>
            AI-Human Synergy
          </h2>
          <p
            className="landing-page__p"
            style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Discover how Kalkinso’s advanced AI tools unite with human expertise to drive innovation.
            From automated product design to data-driven insights, our platform empowers creators
            to transform ideas into tangible outcomes.
          </p>
          <Grid>
            <Column md={4} lg={4} sm={4}>
              <Tile className="ai-tool-card" style={{ padding: '1.5rem' }}>
                <h4 className="landing-page__subheading">Tool A: Auto Designer</h4>
                <p className="landing-page__p">
                  Rapidly prototype product designs using AI-driven creativity.
                  Human designers can refine these AI drafts to perfection.
                </p>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile className="ai-tool-card" style={{ padding: '1.5rem' }}>
                <h4 className="landing-page__subheading">Tool B: Market Lens</h4>
                <p className="landing-page__p">
                  Analyze real-time market trends, then apply human intuition
                  for strategic positioning.
                </p>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile className="ai-tool-card" style={{ padding: '1.5rem' }}>
                <h4 className="landing-page__subheading">Tool C: Smart Assist</h4>
                <p className="landing-page__p">
                  Automate repetitive tasks to free up your creative energy,
                  allowing human insights to flourish where they matter most.
                </p>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile className="ai-tool-card" style={{ padding: '1.5rem' }}>
                <h4 className="landing-page__subheading">Tool D: Data Forge</h4>
                <p className="landing-page__p">
                  Harness big data for predictive analytics. Combine AI-driven
                  forecasts with hands-on expertise to minimize risk and maximize ROI.
                </p>
              </Tile>
            </Column>
          </Grid>
        </Column> */}

        {/* NEW: Demo Versions & Delivered Solutions Section */}
        <Column
          lg={16}
          md={8}
          sm={4}
          className="landing-page__demos"
          style={{ marginBottom: '2rem', marginTop: '5rem' }}>
          <h2
            className="landing-page__subheading"
            style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Demo Versions & Delivered Solutions
          </h2>
          <p
            className="landing-page__p"
            style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Explore interactive demos of our AI tools and see real-world solutions delivered
            to our clients.
          </p>
          <Grid>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Auto Designer</h4>
                <p>
                  Try our AI-powered Auto Designer demo to experience rapid prototyping.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="/demo/auto-designer">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/solutions/auto-designer">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Market Lens</h4>
                <p>
                  Explore our interactive demo to analyze market trends and insights.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="/demo/auto-designer">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/solutions/auto-designer">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Smart Assist</h4>
                <p>
                  Experience how Smart Assist can streamline your workflow.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="/demo/auto-designer">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/solutions/auto-designer">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Data Forge</h4>
                <p>
                  See how Data Forge leverages big data for predictive analytics.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="/demo/auto-designer">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/solutions/auto-designer">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
          </Grid>
        </Column>

        {/* Bottom Info Section */}
        <Column lg={16} md={8} sm={4} className="landing-page__r3">
          <InfoSection heading="The Principles">
            <InfoCard
              heading="Kalkinso is Free for Contributors"
              body="Kalkinso is free for all individual contributors. Companies are charged for hiring work force."
              icon={() => <PersonFavorite size={32} />}
            />
            <InfoCard
              heading="Quality and Purity is Guaranteed"
              body="Quality Assurance is our top priority. We guarantee the quality of the work done by our contributors. Payment is also guaranteed for pure work."
              icon={() => <Application size={32} />}
            />
            <InfoCard
              heading="Group Hiring and Workforce Management"
              body="Show efficiency of your team and get hired as a team. Kalkinso provides a platform for group hiring and workforce management."
              icon={() => <Globe size={32} />}
            />
          </InfoSection>
        </Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LandingPage);
