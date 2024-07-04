import React, { Component } from 'react';
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
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { Globe, Application, PersonFavorite } from '@carbon/react/icons';
import Login from '../Login/Login';
import HeroSection from './HeroSection';

class LandingPage extends Component {
  render() {

    return (
      <Grid className="landing-page" fullWidth>
        <Column lg={16} md={8} sm={4} className="landing-page__banner">
          <HeroSection ButtonComponent={<FluidForm style={{marginTop:"35px"}}>
            <Button href='/#/register'>SignUp</Button>
            <Button kind="secondary" href='/#/login'>Login</Button>
          </FluidForm>}/>
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
                        Kalkinso Software Private Limited is a dynamic technology company committed to transforming innovative ideas into reality. 
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
                      <Button href='/#/contribute'>Search Tasks</Button>
                    </Column>
                    </Grid>
                  </Column>
                  <Column md={4} lg={{ span: 8, offset: 7 }} sm={4}>
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/kalkinso-background.png`}
                      alt="Carbon illustration"
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
                    Swiping through the tasks, you'll find a variety of
                    opportunities to contribute and earn. 
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
                    Carbon provides styles and components in Vanilla, React,
                    Angular, and Vue for anyone building on the web.
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

export default LandingPage;
