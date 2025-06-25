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
  Loading,
  Breadcrumb,
  BreadcrumbItem
} from '@carbon/react';
import { InfoSection, InfoCard } from '../../components/Info';
import { AIReactDashboardConfig } from '../UIShell/AIReactConfig';
import AIReact from '../UIShell/AIReact';
import {
  Globe,
  Application,
  PersonFavorite,
  WatsonHealth3DSoftware,
  AiLaunch,
  ArrowRight
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
import CCTVAnalytics from './assets/cctv_analytics.webp';
import OCPPGateway from './assets/ocpp_gateway.webp';
import Writing from './assets/writing.webp';
import Design from './assets/design.webp';
import Videobook from './assets/video.webp';
import Analysis from './assets/analysis.webp';

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
      const response = await axios.post('/api/phonepe/create-order', {
        amount,
        name,
        email,
        phone,
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
          axios.post('/api/phonepe/verify-payment', {
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
            {/* <Button href="/#/register">Sign Up</Button> */}
            <center><Button kind='ghost' style={{
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#FFF',
              backgroundColor: '#E31B25',
            }} href="/#/build">
              Build Your Vision
            </Button></center>
          </>
        )}

        {/* Always available: Direct access to tool demos */}
        {/* <IconButton
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
        </IconButton> */}
      </FluidForm>
    );
  }

  render() {
    return (
      <Grid className="landing-page" fullWidth>
        {/* Top (Hero) Section */}
        <Column lg={16} md={8} sm={4} className="landing-page__banner">
          {/* <Breadcrumb noTrailingSlash>
            <BreadcrumbItem href="#/Home">Home</BreadcrumbItem>
            <BreadcrumbItem href="#" isCurrentPage>
              Landing Page
            </BreadcrumbItem>
          </Breadcrumb> */}
          <HeroSection ButtonComponent={this.renderAuthButtons()} />
        </Column>
        {/* NEW: Demo Versions & Delivered Solutions Section */}
        <Column
          lg={16}
          md={8}
          sm={4}
          className="landing-page__demos"
          style={{ marginBottom: '2rem' }}>
          <h1
            // className="landing-page__subheading"
            style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Our Featured Projects
          </h1>
          <p
            className="landing-page__p"
            style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Discover our suite of advanced AI solutions designed to bring forth the next era of technology
          </p>
          <Grid>
            <Column md={4} lg={4} sm={4}>
              <Tile style={{ padding: '1.5rem' }}>
                <h2>BuCAudio</h2>
                <img
                    src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8"
                    alt="BuCAudio"
                    style={{
                        width: '100%',
                        height: '12rem',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                    }}
                  />
                <p>
                  Advanced audio processing and analysis platform
                </p>
                <ul>
                    <li>- <b>Audio Transcription</b></li>
                    <li>- <b>Audio Editing</b></li>
                    <li>- <b>Audio Analysis</b></li>
                </ul>
                <Button
                    kind="tertiary"
                    size="sm"
                    href="https://tools.bucaudio.com">
                    <span>Try Demo</span> <ArrowRight style={{
                      marginLeft: '3rem',
                    }} />
                </Button>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
                <h2>Kalki Research</h2>
                <img
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
                    alt="KalkiTex"
                    style={{
                        width: '100%',
                        height: '12rem',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                    }}
                  />
                <p>
                  Write Research Papers with ease
                </p>
                <ul>
                    <li>- <b>Latex Formatter</b></li>
                    <li>- <b>Content Writer and Concept Simulation</b></li>
                    <li>- <b>Reference Finder and Analyser</b></li>
                </ul>
                <Button
                    kind="tertiary"
                    size="sm"
                    href="https://kalkitex.kalkinso.com">
                    <span>Try Demo</span> <ArrowRight style={{
                      marginLeft: '3rem',
                    }} />
                </Button>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
                <h2>AI Surveillance</h2>
                <img
                    src={CCTVAnalytics}
                    alt="CCTV Analytics"
                    style={{
                        width: '100%',
                        height: '12rem',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                    }}
                  />
                <p>
                  Intelligent video surveillance and analysis
                </p>
                <ul>
                    <li>- <b>Object Detection</b></li>
                    <li>- <b>Motion Tracking</b></li>
                    <li>- <b>Behavior Analysis</b></li>
                </ul>
                <Button
                    kind="tertiary"
                    size="sm"
                    href="https://cctv.kalkinso.com">
                    <span>Try Demo</span> <ArrowRight style={{
                      marginLeft: '3rem',
                    }} />
                </Button>
              </Tile>
            </Column>
            <Column md={4} lg={4} sm={4}>
            <Tile style={{ padding: '1.5rem' }}>
                <h2>Kalki Charging Solutions</h2>
                <img
                    src={OCPPGateway}
                    alt="OCPP Gateway"
                    style={{
                        width: '100%',
                        height: '12rem',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                    }}
                  />
                <p>
                  Open Charge Point Protocol Monitor and Manage for EV charging stations
                </p>
                <ul>
                    <li>- <b>Authorization</b></li>
                    <li>- <b>Monitor Charging Stations</b></li>
                    <li>- <b>Monitoring and Transaction Control</b></li>
                </ul>
                <Button
                    kind="tertiary"
                    size="sm"
                    href="https://cctv.kalkinso.com">
                    <span>Try Demo</span> <ArrowRight style={{
                      marginLeft: '3rem',
                    }} />
                </Button>
              </Tile>
            </Column>
          </Grid>
        </Column>

        <Column
          lg={16}
          md={8}
          sm={4}
          className="landing-page__demos"
          style={{ marginBottom: '2rem' }}>
          <h1
            // className="landing-page__subheading"
            style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Our AI Tools
          </h1>
          <p
            className="landing-page__p"
            style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Explore our comprehensive suite of AI technologies, each designed to advance humanity towards a brighter future
          </p>
          <Grid>
          <Column md={4} lg={4} sm={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h2>Writing Assistant</h2>
            <img
              src={Writing}
              alt="Writing Assistant"
              style={{
                width: '100%',
                height: '12rem',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
            />
            <p>Efficient writing, editing, and language enhancement</p>
            <ul>
              <li>- <b>Grammar Correction</b></li>
              <li>- <b>Formatting</b></li>
              <li>- <b>AI-based Suggestions</b></li>
            </ul>
            <Button
              kind="tertiary"
              size="sm"
              href="/#/tools/writing-assistant"
            >
              <span>Try Demo</span>
              <ArrowRight style={{ marginLeft: '3rem' }} />
            </Button>
          </Tile>
        </Column>

        <Column md={4} lg={4} sm={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h2>Design Assistant</h2>
            <img
              src={Design}
              alt="Design Assistant"
              style={{
                width: '100%',
                height: '12rem',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
            />
            <p>AI-powered design suggestions and improvements</p>
            <ul>
              <li>- <b>Layout Suggestions</b></li>
              <li>- <b>Color Palette Generation</b></li>
              <li>- <b>AI Prototyping</b></li>
            </ul>
            <Button
              kind="tertiary"
              size="sm"
              href="/#/tools/design-assistant"
            >
              <span>Try Demo</span>
              <ArrowRight style={{ marginLeft: '3rem' }} />
            </Button>
          </Tile>
        </Column>

        <Column md={4} lg={4} sm={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h2>Videobook Assistant</h2>
            <img
              src={Videobook}
              alt="Videobook Assistant"
              style={{
                width: '100%',
                height: '12rem',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
            />
            <p>Transform text into engaging video presentations</p>
            <ul>
              <li>- <b>Text to Video</b></li>
              <li>- <b>Animations</b></li>
              <li>- <b>Voice Over</b></li>
            </ul>
            <Button
              kind="tertiary"
              size="sm"
              href="/#/tools/videobook-assistant"
            >
              <span>Try Demo</span>
              <ArrowRight style={{ marginLeft: '3rem' }} />
            </Button>
          </Tile>
        </Column>

        <Column md={4} lg={4} sm={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <h2>Analysis Assistant</h2>
            <img
              src={Analysis}
              alt="Analysis Assistant"
              style={{
                width: '100%',
                height: '12rem',
                borderRadius: '10px',
                marginBottom: '1rem',
              }}
            />
            <p>Advanced data analysis and pattern recognition</p>
            <ul>
              <li>- <b>Data Ingestion</b></li>
              <li>- <b>Predictive Modeling</b></li>
              <li>- <b>Trend Analysis</b></li>
            </ul>
            <Button
              kind="tertiary"
              size="sm"
              href="/#/tools/analysis-assistant"
            >
              <span>Try Demo</span>
              <ArrowRight style={{ marginLeft: '3rem' }} />
            </Button>
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
