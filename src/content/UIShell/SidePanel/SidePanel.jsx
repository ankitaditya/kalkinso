import { EditSidePanel, pkg, UserProfileImage } from "@carbon/ibm-products";
import { Dropdown, FilterableMultiSelect, TextArea, TextInput, usePrefix } from "@carbon/react";
import { useEffect, useState } from "react";
import costaPic from '../../SearchPage/component-playground/_story-assets/costa.jpeg';
import { useDispatch, useSelector } from "react-redux";
import { saveProfile } from "../../../actions/profile";

const skills = [...new Set([
  "Accounting",
  "Active Listening",
  "Analytical Thinking",
  "Architectural Design",
  "Artistic Illustration",
  "Automotive Repair",
  "Baking",
  "Biochemical Analysis",
  "Budget Management",
  "Carpentry",
  "Computer Programming",
  "Conflict Resolution",
  "Content Creation",
  "Counseling",
  "Critical Thinking",
  "Culinary Arts",
  "Customer Service",
  "Data Analysis",
  "Database Management",
  "Dental Care",
  "Digital Marketing",
  "Editing",
  "Electrical Engineering",
  "Event Planning",
  "Financial Planning",
  "Firefighting",
  "First Aid",
  "Graphic Design",
  "Hair Styling",
  "Human Resources Management",
  "HVAC Repair",
  "Interior Design",
  "Inventory Management",
  "Journalism",
  "Language Translation",
  "Leadership",
  "Legal Research",
  "Machine Operation",
  "Marketing Strategy",
  "Mechanical Engineering",
  "Medical Diagnostics",
  "Music Composition",
  "Network Security",
  "Nursing Care",
  "Online Advertising",
  "Operating Heavy Machinery",
  "Painting",
  "Paralegal Services",
  "Photography",
  "Physical Therapy",
  "Plumbing",
  "Project Management",
  "Public Relations",
  "Real Estate Management",
  "Research Methodology",
  "Retail Management",
  "Robotics Engineering",
  "Sales Strategy",
  "Search Engine Optimization (SEO)",
  "Social Media Management",
  "Software Development",
  "Speech Writing",
  "Statistical Analysis",
  "Strategic Planning",
  "Teaching",
  "Technical Support",
  "Time Management",
  "Translation Services",
  "Transportation Logistics",
  "Travel Planning",
  "Urban Planning",
  "User Experience (UX) Design",
  "Veterinary Care",
  "Video Editing",
  "Virtual Assistance",
  "Voice Acting",
  "Web Development",
  "Welding",
  "Writing and Editing",
  "Yoga Instruction",
  "Zoological Research",
  "Agricultural Management",
  "Air Traffic Control",
  "Animation",
  "App Development",
  "Archaeological Research",
  "Astronomical Observation",
  "Aviation Navigation",
  "Bioinformatics",
  "Blockchain Development",
  "Chemical Engineering",
  "Cinematography",
  "Cloud Computing",
  "Cybersecurity",
  "Dietetics and Nutrition",
  "E-commerce Management",
  "Environmental Science",
  "Fashion Design",
  "Fitness Training",
  "Forensic Analysis",
  "JavaScript", 
  "Python", 
  "Java",
  "3D Modeling",
  "Abnormal Psychology",
  "Acoustical Engineering",
  "Actuarial Science",
  "Advertising",
  "Aerial Photography",
  "Agronomy",
  "Air Conditioning Repair",
  "Aircraft Maintenance",
  "Algorithm Design",
  "Allergy Testing",
  "Alternative Medicine",
  "Animal Husbandry",
  "Animation Design",
  "Antique Appraisal",
  "Apparel Design",
  "Arboriculture",
  "Artificial Intelligence",
  "Art Restoration",
  "Astrobiology",
  "Astrophysics",
  "Auctioneering",
  "Audio Engineering",
  "Auditing",
  "Auto Detailing",
  "AutoCAD",
  "Aviation Maintenance",
  "Bacteriology",
  "Ballistics",
  "Barista Skills",
  "Bartending",
  "Behavioral Analysis",
  "Biogeochemistry",
  "Biometrics",
  "Biomedical Engineering",
  "Blacksmithing",
  "Boat Repair",
  "Botany",
  "Brand Management",
  "Bridge Engineering",
  "Broadcast Journalism",
  "Building Inspection",
  "Business Analysis",
  "Business Development",
  "C++ Programming",
  "Cabinet Making",
  "Calligraphy",
  "Catering",
  "Ceramic Arts",
  "Chemical Analysis",
  "Childcare",
  "Chiropractic Care",
  "Cinematography",
  "Civil Engineering",
  "Classical Music Performance",
  "Climate Science",
  "Cloud Architecture",
  "Coaching",
  "Commercial Diving",
  "Commercial Piloting",
  "Community Outreach",
  "Computer Forensics",
  "Construction Management",
  "Consumer Behavior Analysis",
  "Content Management",
  "Copywriting",
  "Corporate Law",
  "Costume Design",
  "Crisis Management",
  "Cryptocurrency Trading",
  "Cryptography",
  "Cultural Anthropology",
  "Curriculum Development",
  "Customer Relationship Management",
  "Cyber Law",
  "Dairy Farming",
  "Data Mining",
  "Data Science",
  "Database Administration",
  "Deckhand Skills",
  "Deep Learning",
  "Demography",
  "Dental Hygiene",
  "Dermatology",
  "Desktop Publishing",
  "Detective Work",
  "Diet Planning",
  "Digital Illustration",
  "Disaster Recovery",
  "Documentary Filmmaking",
  "Drone Piloting",
  "Eco-Friendly Design",
  "Ecotourism",
  "Editing and Proofreading",
  "Education Administration",
  "Electric Guitar Repair",
  "Electrical Wiring",
  "Electronics Repair",
  "Emergency Medical Services",
  "Emergency Planning",
  "Endocrinology",
  "Energy Management",
  "Engineering Design",
  "Environmental Health",
  "Epidemiology",
  "Ergonomics",
  "Estate Planning",
  "Ethical Hacking",
  "Event Coordination",
  "Executive Coaching",
  "Exercise Physiology",
  "Explosives Handling",
  "Facilities Management",
  "Fashion Merchandising",
  "Film Direction",
  "Film Production",
  "Financial Analysis",
  "Fine Arts Restoration",
  "Fire Safety",
  "Fishery Management",
  "Floral Design",
  "Food Safety",
  "Forestry",
  "Freelance Writing",
  "Fundraising",
  "Furniture Design",
  "Game Development",
  "Genealogy",
  "Genetic Counseling",
  "Genetics",
  "Geographic Information Systems (GIS)",
  "Geology",
  "Gerontology",
  "Glass Blowing",
  "Golf Course Management",
  "Government Relations",
  "Graphic Facilitation",
  "Green Building",
  "Green Energy",
  "Guitar Teaching",
  "Handwriting Analysis",
  "Health Administration",
  "Health Coaching",
  "Health Informatics",
  "Healthcare Management",
  "Heavy Equipment Operation",
  "Hematology",
  "Herbal Medicine",
  "Herpetology",
  "Highway Engineering",
  "Histology",
  "Horticulture",
  "Hospital Administration",
  "Hostel Management",
  "Hotel Management",
  "Housekeeping",
  "Human Factors Engineering",
  "Hydraulic Engineering",
  "Hydrology",
  "Hyperbaric Medicine",
  "Illustration",
  "Immunology",
  "Industrial Design",
  "Industrial Hygiene",
  "Information Security",
  "Information Systems Management",
  "Insurance Underwriting",
  "Interior Architecture",
  "International Business",
  "International Law",
  "Internet of Things (IoT)",
  "iOS Development",
  "Jewelry Design",
  "Journalistic Writing",
  "Kitchen Design",
  "Laboratory Analysis",
  "Landscape Architecture",
  "Landscape Photography",
  "Landscaping",
  "Law Enforcement",
  "Leatherworking",
  "Librarianship",
  "Life Coaching",
  "Linguistics",
  "Literary Analysis",
  "Litigation",
  "Logistics Management",
  "Machine Learning",
  "Magnetic Resonance Imaging (MRI)",
  "Makeup Artistry",
  "Marine Biology",
  "Marine Engineering",
  "Marine Navigation",
  "Market Research",
  "Mathematical Modeling",
  "Mechanical Drafting",
  "Medical Coding",
  "Medical Imaging",
  "Medical Research",
  "Metalworking",
  "Microbiology",
  "Mobile App Development",
  "Mortgage Lending",
  "Motion Graphics",
  "Museum Curation",
  "Music Arrangement",
  "Music Therapy",
  "Nanotechnology",
  "Negotiation",
  "Neonatal Care",
  "Nephrology",
  "Neurology",
  "Nuclear Engineering",
  "Nuclear Medicine",
  "Numerical Analysis",
  "Nutritional Counseling",
  "Obstetrics",
  "Oceanography",
  "Oncology",
  "Opera Singing",
  "Operations Management",
  "Optometry",
  "Oral Surgery",
  "Organizational Development",
  "Orthodontics",
  "Orthopedic Surgery",
  "Osteopathy",
  "Outdoor Education",
  "Paragliding",
  "Park Management",
  "Patent Law",
  "Pathology",
  "Pediatric Nursing",
  "Pediatrics",
  "Pet Grooming",
  "Pharmaceutical Sales",
  "Pharmacology",
  "Philanthropy",
  "Photojournalism",
  "Physical Chemistry",
  "Physiotherapy",
  "Pilates Instruction",
  "Plant Pathology",
  "Plastic Surgery",
  "Playwriting",
  "Podcasting",
  "Political Campaign Management",
  "Political Science",
  "Portrait Photography",
  "Post-Production Editing",
  "Primary Education",
  "Private Investigation",
  "Process Improvement",
  "Product Management",
  "Professional Networking",
  "Project Coordination",
  "Psychiatry",
  "Public Health",
  "Public Policy Analysis",
  "Public Speaking",
  "Publishing",
  "Quality Assurance",
  "Radiation Therapy",
  "Radiologic Technology",
  "Real Estate Appraisal",
  "Recruiting",
  "Reflexology",
  "Regulatory Affairs",
  "Rehabilitation Counseling",
  "Remote Sensing",
  "Renewable Energy",
  "Restaurant Management",
  "Retail Buying",
  "Risk Assessment",
  "Robotic Process Automation",
  "Roofing",
  "Safety Engineering",
  "Sales Forecasting",
  "Scenic Design",
  "Scientific Research",
  "Screen Printing",
  "Screenwriting",
  "Scriptwriting",
  "Security Analysis",
  "Security Consulting",
  "Set Design",
  "Sewing",
  "Shakespearean Acting",
  "SharePoint Administration",
  "Ship Navigation",
  "Social Work",
  "Software Quality Assurance",
  "Solar Energy",
  "Sound Design",
  "Special Effects Makeup",
  "Speech Therapy",
  "Sports Coaching",
  "Stained Glass Making",
  "Statistical Modeling",
  "Stock Trading",
  "Strategic Marketing",
  "Structural Engineering",
  "Supply Chain Management",
  "Surgical Assisting",
  "Surveying",
  "Sustainable Agriculture",
  "System Administration",
  "Systems Analysis",
  "Tailoring",
  "Tax Consulting",
  "Tax Preparation",
  "Taxidermy",
  "Teacher Training",
  "Technical Illustration",
  "Telecommunications",
  "Television Production",
  "Textile Design",
  "Theatrical Directing",
  "Thermodynamics",
  "Tour Guiding",
  "Tourism Management",
  "Trade Compliance",
  "Training Development",
  "Transcription",
  "Transportation Engineering",
  "Travel Writing",
  "Tree Surgery",
  "UI Design",
  "User Research",
  "UX Research",
  "Veterinary Surgery",
  "Victim Advocacy",
  "Video Game Design",
  "Video Production",
  "Virtual Reality Development",
  "Voice Over",
  "Warehouse Management",
  "Waste Management",
  "Water Treatment",
  "Wildlife Conservation",
  "Wind Energy",
  "Wine Making",
  "Woodworking",
  "Workplace Safety",
  "Yoga Instruction",
  "Youth Counseling",
  "Zoology"
])];


const SidePanel = ({
    isSideNavExpanded,
    closeSideNav
  }) => {
    pkg.component.EditSidePanel = true;
    const carbonPrefix = usePrefix();
    const dispatch = useDispatch();
    const itemsGender = ['Male', 'Female', 'Other'];
    const itemsPath = ['Fresher', 'Professional', 'Administrator', 'Explorer'];
    const profile = useSelector(state => state.profile);
    const user = useSelector(state => state.auth.user);
    // const [open, setOpen] = useState(false);

    const [topicValue, setTopicValue] = useState('Sita Ram Chandra');
    const [ userInput, setUserInput ] = useState(profile);
    const getInitials = (name) => {
      return name.split(' ').map((n) => n[0]).join('');
    };
    useEffect(() => {
      setUserInput(profile);
    }, [profile])
    return <EditSidePanel id="storybook-id" formTitle="" title="Edit Profile" primaryButtonText="Save" secondaryButtonText="Cancel" open={isSideNavExpanded} onRequestClose={() => closeSideNav()} onRequestSubmit={() => dispatch(saveProfile({...userInput}))} selectorPrimaryFocus={`.${carbonPrefix}--text-input`}>
                <UserProfileImage
                  size=""
                  backgroundColor="light-cyan"
                  theme="light"
                  style={{ height: '8rem', width: '8rem' }}
                  initials={Object.keys(userInput).length>0 ? getInitials(userInput?.first_name + ' ' + userInput?.last_name) : 'CC'}
                  tooltipText={Object.keys(userInput).length>0 ? userInput?.first_name + ' ' + userInput?.last_name : ''}
                  imageDescription="blank"
                  image={user?.avatar?user?.avatar:costaPic}
                />
                <TextArea 
                  id="create-side-panel-first-name-a" 
                  labelText="BIO" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Wanna Add Something about yourself?" 
                  value={userInput?.bio} 
                  onChange={event => setUserInput({
                      ...userInput,
                      bio: event.target.value
                  })} />
                <TextInput 
                  id="create-side-panel-first-name-a" 
                  labelText="FIRST NAME" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your first name" 
                  value={userInput?.first_name} 
                  onChange={event => setUserInput({
                      ...userInput,
                      first_name: event.target.value
                  })} 
                  invalid={userInput?.first_name?.length === 0}
                  invalidText="First Name cannot be empty!" 
                  required/>
                <TextInput 
                  id="create-side-panel-last-name-a" 
                  labelText="LAST NAME" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your last name" 
                  value={userInput?.last_name} 
                  onChange={event => setUserInput({
                      ...userInput,
                      last_name: event.target.value
                  })} 
                  invalid={userInput?.last_name?.length === 0}
                  invalidText="Last Name cannot be empty!" 
                  required/>
                <TextInput 
                  id="create-side-panel-user-name-a" 
                  labelText="USERNAME" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your username" 
                  value={userInput?.username} 
                  onChange={event => setUserInput({
                      ...userInput,
                      username: event.target.value
                  })} 
                  invalid={userInput?.username?.length === 0}
                  invalidText="username cannot be empty!" 
                  required/>
                <div style={{
                display: 'grid',
                alignItems: 'flex-end',
                gridGap: '0.75rem',
                gridTemplateColumns: '1fr 1fr'
                }}>
                    <Dropdown id="create-side-panel-dropdown-gender-a" items={itemsGender} initialSelectedItem={userInput?.gender} label="GENDER" titleText="GENDER" className={`${carbonPrefix}form-item`} />
                    <Dropdown id="create-side-panel-dropdown-path-a" items={itemsPath} initialSelectedItem={userInput?.user_role} label="PATH" titleText="PATH" className={`${carbonPrefix}form-item`} />
                </div>
                <TextInput 
                  id="create-side-panel-url-a" 
                  labelText="URL" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your url id" 
                  value={userInput?.url} 
                  onChange={event => {
                    if (event.target.value.replace('https://www.kalkinso.com', '').length !==0){
                      setUserInput({
                        ...userInput,
                        url: event.target.value
                    })
                    }
                  }
                  }
                  invalid={userInput?.url?.replace('https://www.kalkinso.com/','').length === 0}
                  invalidText="url cannot be empty!" 
                  required/>
                <TextInput 
                  id="create-side-panel-user-name-a" 
                  labelText="USERNAME" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your username" 
                  value={userInput?.username} 
                  onChange={event => setUserInput({
                      ...userInput,
                      username: event.target.value
                  })} 
                  invalid={userInput?.username?.length === 0}
                  invalidText="username cannot be empty!" 
                  required/>
                {
                  Object.keys(userInput?.verification_status?userInput?.verification_status:{}).map((key, index) => {
                    return <TextInput 
                      id={`create-side-panel-${key}-a`} 
                      labelText={key.toUpperCase()} 
                      className={`${carbonPrefix}form-item`} 
                      placeholder={`Enter your ${key}`} 
                      value={userInput?.verification_status[key]?.value} 
                      onChange={event => setUserInput({
                          ...userInput,
                          verification_status: {
                            ...userInput.verification_status,
                            [key]: {
                              ...userInput.verification_status[key],
                              value: event.target.value
                            }
                          }
                      })} 
                      invalid={userInput?.verification_status[key]?.value?.length === 0}
                      invalidText={`${key} cannot be empty!`} 
                      required/>
                  })
                }
                <TextInput 
                  id="create-side-panel-org-name-a" 
                  labelText="ORGANISATION NAME" 
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Enter your Organisation name" 
                  value={userInput?.org} 
                  onChange={event => setUserInput({
                      ...userInput,
                      org: event.target.value
                  })} 
                  invalid={userInput?.org?.length === 0}
                  invalidText="Organisation name cannot be empty!" 
                  required/>
                <FilterableMultiSelect 
                  items={skills}
                  id="create-side-panel-skills-a" 
                  titleText="SKILLS"
                  label="Select Skills" 
                  selectionFeedback="top-after-reopen"
                  className={`${carbonPrefix}form-item`} 
                  placeholder="Type your skills" 
                  selectedItems={userInput?.skills}
                  onChange={event => {
                    setUserInput({
                      ...userInput,
                      skills: event.selectedItems
                  })
                  }}
                  itemToString={(item)=>item} />
                <div style={{
                display: 'grid',
                alignItems: 'flex-end',
                gridGap: '0.75rem',
                gridTemplateColumns: '1fr 1fr'
                }}>
                  <Dropdown 
                    items={['github', 'gitlab', 'kalkinso']}
                    id="create-side-panel-kit-a" 
                    titleText="KIT SOURCE"
                    label="Select Kit Source" 
                    // selectionFeedback="top-after-reopen"
                    className={`${carbonPrefix}form-item`} 
                    placeholder="Select Kit Source" 
                    initialSelectedItem={userInput?.kalkinso_information_tracker?.find((val,index)=>index===0)?.type} 
                    onChange={event => {
                      let kit = userInput?.kalkinso_information_tracker?.find((val,index)=>index===0);
                      kit.type = event.selectedItem;
                      setUserInput({
                        ...userInput,
                        kalkinso_information_tracker: [kit] 
                    })
                    }}
                    itemToString={(item)=>item} 
                  />
                  <TextInput 
                    id="create-side-panel-kit-user-name-a" 
                    labelText="KIT USERNAME" 
                    className={`${carbonPrefix}form-item`} 
                    placeholder="Enter your username for kit" 
                    value={userInput?.kalkinso_information_tracker?.find((val,index)=>index===0)?.username} 
                    onChange={event => {
                      let kit = userInput.kalkinso_information_tracker?.find((val,index)=>index===0);
                      kit.username = event.target.value;
                      setUserInput({
                        ...userInput,
                        kalkinso_information_tracker: [kit]
                    })}} 
                    invalid={userInput?.kalkinso_information_tracker?.find((val,index)=>index===0)?.username.length === 0}
                    invalidText="kit cannot be empty!" 
                    required
                  />
                </div>
                <TextArea labelText="EXPERIENCE" rows={4} value={userInput?.experience} onChange={event => {
                  const experiences = event.target.value;
                  setUserInput({
                    ...userInput,
                    experience: experiences
                  })
                }} />
                <TextArea labelText="EDUCATION" rows={4} value={userInput?.education} onChange={event => {
                  const education = event.target.value;
                  setUserInput({
                    ...userInput,
                    education: education
                  })
                }} />
                <TextArea labelText="SOCIAL LINKS" rows={4} value={userInput?.social} onChange={event => {
                  const social = event.target.value;
                  setUserInput({
                    ...userInput,
                    social: social
                  })
                }} />
            </EditSidePanel>;
  }

export default SidePanel;