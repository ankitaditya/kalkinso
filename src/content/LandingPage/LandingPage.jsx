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
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { Globe, Application, PersonFavorite, WatsonHealth3DSoftware, ShoppingCart } from '@carbon/react/icons';
import Login from '../Login/Login';
import HeroSection from './HeroSection';
import TaskCarousel from './TaskCarousel';
import { loadUser, setLoading } from '../../actions/auth';

class LandingPage extends Component {

  componentDidMount() {
    // this.props.dispatch(setLoading(true));
    // this.props.dispatch(loadUser({token: localStorage.getItem('token')}));
  }

  render() {

    return (
      <Grid className="landing-page" fullWidth>
        <Column lg={16} md={8} sm={4} className="landing-page__banner">
          <HeroSection ButtonComponent={this.props?.auth?.isAuthenticated?<FluidForm style={{marginTop:"35px"}}>
            <IconButton style={{minWidth:"106px"}} href='/3d/editor' label="3d designer" kind="primary">
              <WatsonHealth3DSoftware style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>3D Desi</span>
            </IconButton>
            {/* <IconButton style={{minWidth:"106px"}} href='https://apparels.kalkinso.com' label="3d designer" kind="secondary">
              <ShoppingCart style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>Apparels</span>
            </IconButton> */}
          </FluidForm>:<><FluidForm style={{marginTop:"35px"}}>
            <Button href='/#/register'>Sign Up</Button>
            <Button kind="secondary" href='/#/login'>Login</Button>
          </FluidForm>
          <FluidForm style={{marginTop:"35px"}}>
            <IconButton style={{minWidth:"106px"}} href='/3d/editor' label="3d designer" kind="primary">
              <WatsonHealth3DSoftware style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>3D Desi</span>
            </IconButton>
            {/* <IconButton style={{minWidth:"106px"}} href='https://apparels.kalkinso.com' label="3d designer" kind="secondary">
              <ShoppingCart style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>Apparels</span>
            </IconButton> */}
          </FluidForm>
          </>}/>
        </Column>
        <Column lg={16} md={8} sm={4} className="landing-page__r2">
          <Tabs defaultSelectedIndex={0}>
            <TabList className="tabs-group" aria-label="Tab navigation">
              <Tab>Search</Tab>
              <Tab>Connect</Tab>
              <Tab>Earn</Tab>
              {/* <Tab>Join</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    md={4}
                    lg={7}
                    sm={4}
                    className="landing-page__tab-content">
                    <Grid>
                      <Column md={4}
                              lg={7}
                              sm={4}>
                        <h2 className="landing-page__subheading">What is Kalkinso?</h2>
                        <p className="landing-page__p">
                        Kalkinso Software  is a dynamic technology company committed to transforming innovative ideas into reality. 
                        Our core strengths lie in bridging the gap between conceptualization and successful implementation. 
                        With a dedicated team of skilled engineers and strategists, 
                        we specialize in turning ideas into high-quality software products.
                        </p>
                      </Column>
                      <Column md={4}
                              lg={7}
                              sm={4}>
                        <Search
                        className="landing-page__p"
                        closeButtonLabelText="Clear search input"
                        defaultValue="Front End Designing"
                        id="search-playground-1"
                        labelText="Label text"
                        placeholder="Search for tasks"
                        playgroundWidth={300}
                        role="searchbox"
                        size="md"
                        type="text"
                        onKeyDownCapture={() => {  }}
                      />
                      <Button href='/#/Home/search'>Search Tasks</Button>
                    </Column>
                    </Grid>
                  </Column>
                  <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/kalkinso-background.png`}
                      alt="KALKINSO Carbon illustration"
                    />
                  </Column>
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    lg={16}
                    md={8}
                    sm={4}
                    className="landing-page__tab-content">
                    <TaskCarousel component={<HeroSection ButtonComponent={<FluidForm style={{marginTop:"35px"}}>
                                              <Button href='/#/register'>SignUp</Button>
                                              <Button kind="secondary" href='/#/login'>Login</Button>
                                              <FluidForm style={{marginTop:"35px"}}>
                                              <IconButton style={{minWidth:"106px"}} href='/3d/editor' label="3d designer" kind="primary">
                                                <WatsonHealth3DSoftware style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>3D Desi</span>
                                              </IconButton>
                                              {/* <IconButton style={{minWidth:"106px"}} href='https://apparels.kalkinso.com' label="3d designer" kind="secondary">
                                                <ShoppingCart style={{marginLeft:"15px"}} /><span style={{marginLeft:"5px", marginRight: "15px"}}>Apparels</span>
                                              </IconButton> */}
                                            </FluidForm>
                                            </FluidForm>}/>} />
                  </Column>
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid className="tabs-group-content">
                  <Column
                    lg={16}
                    md={8}
                    sm={4}
                    className="landing-page__tab-content">
                    
                    <Grid>
                      <Column lg={8} md={6} sm={4} className="process-column">
                        <h6>Receive direct payment from project managers upon task completion. The process involves:</h6>
                        <OrderedList style={{margin:'2rem'}}>
                          <ListItem>
                            <strong>Search:</strong> Begin by searching for projects or tasks that match your skills and interests.
                          </ListItem>
                          <ListItem>
                            <strong>Select:</strong> Choose the project or task that suits you best and meets your criteria.
                          </ListItem>
                          <ListItem>
                            <strong>Work:</strong> Start working on the selected project, ensuring you meet all the specified requirements and deadlines.
                          </ListItem>
                          <ListItem>
                            <strong>Submit:</strong> Once you have completed the work, submit it for review.
                          </ListItem>
                          <ListItem>
                            <strong>Approval:</strong> Await approval from the project manager, who will review your submission for quality and accuracy.
                          </ListItem>
                          <ListItem>
                            <strong>Payment:</strong> Upon approval, receive your payment directly from the project manager.
                          </ListItem>
                        </OrderedList>
                      </Column>
                    </Grid>
                  </Column>
                </Grid>
              </TabPanel>
              {/* <TabPanel>
                  <Login />
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </Column>
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(LandingPage);
