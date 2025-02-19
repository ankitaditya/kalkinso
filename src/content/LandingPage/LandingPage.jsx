import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  TextInput,
  NumberInput,
  Button,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  FluidForm,
  IconButton,
  Tile,
  ButtonSet,
  Loading
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { AIReactDashboardConfig } from '../UIShell/AIReactConfig';
import AIReact from '../UIShell/AIReact';
import {
  Globe,
  Application,
  PersonFavorite,
  WatsonHealth3DSoftware,
  AiLaunch
} from '@carbon/react/icons';
import axios from 'axios';
// import { ShoppingCart } from '@carbon/react/icons'; // Uncomment if needed
import Login from '../Login/Login';
import HeroSection from './HeroSection';
import TaskCarousel from './TaskCarousel';
import { loadUser, setLoading } from '../../actions/auth';
import SearchPage from '../SearchPage';
import PDFViewer from './PDFViewer';
import "./_landing-page.scss";
import { getSelectedTasks } from "../../actions/kits";
import { getTasks, setTasks } from '../../actions/task';

function PaymentForm({ type }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(1000); // Default amount

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    if (!name || !email || !phone) {
      alert('Please fill all the fields');
      return;
    }

    try {
      const response = await axios.post('/api/payment/create-order', {
        amount,
        name,
        email,
        phone,
        type,
      });

      const order = response.data;

      const options = {
        key: 'rzp_live_Z3U0AoBZ8N7rSf',
        amount: order.amount,
        currency: order.currency,
        name: 'KALKINSO SOFTWARE (OPC) PRIVATE LIMITED',
        description: type === 'invest' ? 'Investment in Pitch' : 'Service Payment',
        order_id: order.id,
        callback_url: `${window.location.origin}/#/wallet/${order.id}`,
        prefill: { name, email, contact: phone },
        theme: { color: '#F37254' },
        handler: function (response) {
          axios.post('/api/payment/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).then((res) => {
            if (res.data.status === 'ok') {
              window.location.href = `${window.location.origin}/#/wallet/${order.id}`;
            } else {
              alert('Payment verification failed');
            }
          }).catch(() => alert('Error verifying payment'));
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed');
    }
  };

  return (
    <div className="payment-container">
      <img src="/logo-new.png" alt="Kalkinso Logo" style={{ 
        width: '100px', 
        height: '100px', 
        border: '2px solid #000', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
        }} />
      <h3>{type === 'invest' ? 'Investor Connect Payment' : 'Service Payment'}</h3>
      <TextInput labelText="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextInput labelText="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextInput labelText="Your Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <NumberInput hideSteppers={true} label="Amount" min={500} value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Button style={{
        marginTop: '1rem',
      }} onClick={handlePayment}>Pay Now</Button>
    </div>
  );
}

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }
  componentDidMount() {
    // Optionally, dispatch actions to load user data
    // this.props.dispatch(setLoading(true));
    // this.props.dispatch(loadUser({ token: localStorage.getItem('token') }));
    // Create new plugin instance
    console.log('Selected Task:', this.props.selectedTask?.entries[0]?.children?.entries);
    if(this.props?.selectedTask?.entries[0]?.children?.entries) {
      const dashboardConfig = AIReactDashboardConfig(this.props.selectedTask.entries[0].children.entries, (e, o)=>{
        if(o.activeNodeId){
          this.props.setTasks(o.value);
        }
      });
      this.setState({ dashboardConfig });
      console.log('Dashboard Config:', dashboardConfig);
    } else {
      this.props.getSelectedTasks('kalkinso.com', 'users/67a041aff1a43dada0170b37/tasks');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props?.selectedTask?.entries[0]?.children?.entries&&!this.state.dashboardConfig) {
      const dashboardConfig = AIReactDashboardConfig(this.props.selectedTask.entries[0].children.entries, (e, o)=>{
        if(o.activeNodeId){
          this.props.setTasks(o.value);
          // console.log('Active Node:', o);
        }
      });
      this.setState({ dashboardConfig });
      console.log('Dashboard Config:', dashboardConfig);
    }
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
              <Tab>Get Started</Tab>
              {/* <Tab>Join</Tab> */}
            </TabList>
            <TabPanels>
              {/* Tab 1: Search */}
              <TabPanel>
                {this?.state?.dashboardConfig?<AIReact config={this?.state?.dashboardConfig} />:<Loading active={!this?.state?.dashboardConfig} withOverlay description='Kalkinso demo is loading...' />}
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
                        <PDFViewer file='https://live-kalkinso.s3.ap-south-1.amazonaws.com/Pitch+deck+(UPDATED).pdf' />
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

              
              <TabPanel>
                <PaymentForm type={"invest"} />
              </TabPanel>
             
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
                <h4>Demo: Kalkinso Research</h4>
                <p>
                  Research tools for writing research papers and articles.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="https://kalkitex.kalkinso.com">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/#/services">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Kalkinso Ecommerce</h4>
                <p>
                  Explore our interactive demo to sell your products.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="https://apparels.kalkinso.com">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/apparels">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: BuCAudio Tools</h4>
                <p>
                  Experience how Smart Assist can streamline your book writing.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="https://tools.bucaudio.com">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="https://www.bucaudio.com">
                        Solution
                    </Button>
                </ButtonSet>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h4>Demo: Kalkinso 3D</h4>
                <p>
                  See how Kalkinso 3D leverages ThreeJS for Designing.
                </p>
                <ButtonSet style={{
                    maxWidth: '10rem',
                }}>
                    <Button kind="primary" size="sm" href="/3d/editor">
                        Demo
                    </Button>
                    <Button
                        kind="tertiary"
                        size="sm"
                        href="/3d/examples">
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
  selectedTask: state.kits.selectedTask,
  tasks: state.task.kanban.tasks
});

export default connect(mapStateToProps, { loadUser, setLoading, getSelectedTasks, getTasks, setTasks })(LandingPage);
