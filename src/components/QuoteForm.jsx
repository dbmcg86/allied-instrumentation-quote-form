import { useState } from 'react';

const QuoteForm = () => {
  const [devices, setDevices] = useState([]);
  
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    
    // Category Selection
    category: '',
    
    // Instrumentation Subcategories
    instrumentationType: '',
    instrumentationSubtype: '',
    
    // Valve Subcategories
    valveType: '',
    
    // Universal Process Conditions
    flowRateLow: '',
    flowRateNormal: '',
    flowRateMax: '',
    flowRateUnit: 'GPM',
    
    pressureLow: '',
    pressureNormal: '',
    pressureMax: '',
    pressureUnit: 'PSIG',
    
    temperatureLow: '',
    temperatureNormal: '',
    temperatureMax: '',
    temperatureUnit: '°F',
    
    specificGravity: '',
    specificGravityUnit: 'SG',
    
    viscosity: '',
    viscosityUnit: 'cP',
    
    // Universal Physical Specifications
    lineSize: '',
    connectionType: '',
    pressureClass: '',
    materialConstruction: '',
    
    // Valve Specific Fields
    failPosition: '',
    actuation: '',
    airPressure: '',
    airFilterRegulator: false,
    valveStyle: '',
    lockoutBracket: '',
    
    // On/Off Valve Fields
    limitSwitch: '',
    solenoid: '',
    
    // Control Valve Fields
    positionerBrand: '',
    electricalVoltage: '',
    feedbackRequired: '',
    
    // Additional Fields
    mediaType: '',
    hazardousAreaClassification: '',
    
    // Electrical Requirements (for all electrical items)
    electricalVoltageGeneral: '',
    electricalAreaClassification: '',
    
    // Options for instruments and positioners
    remoteRequired: false,
    displayRequired: false,
    
    // Systems
    systemsNotes: '',
    
    // General Notes
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim() || formData.company.length < 2) {
      newErrors.company = 'Company name must be at least 2 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    // Validate electrical requirements for electrical items
    if (isElectricalItemSelected()) {
      if (!formData.electricalVoltageGeneral) {
        newErrors.electricalVoltageGeneral = 'Electrical voltage is required for electrical items';
      }
      
      if (!formData.electricalAreaClassification) {
        newErrors.electricalAreaClassification = 'Electrical area classification is required for electrical items';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare submission data with all devices
      const allDevices = [...devices];
      // Add current device if it has a category selected
      if (formData.category) {
        const { firstName, lastName, email, company, ...currentDevice } = formData;
        allDevices.push(currentDevice);
      }
      
      // Format data for Netlify submission
      const formSubmissionData = {
        'form-name': 'quote-form',
        'firstName': formData.firstName,
        'lastName': formData.lastName,
        'email': formData.email,
        'company': formData.company,
        'deviceCount': allDevices.length.toString(),
        'devices': JSON.stringify(allDevices)
      };
      
      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formSubmissionData).toString()
      });
      
      if (response.ok) {
        alert('Quote request submitted successfully! You will receive a confirmation email shortly.');
        // Reset form after successful submission
        setDevices([]);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          category: '',
          instrumentationType: '',
          instrumentationSubtype: '',
          valveType: '',
          flowRateLow: '',
          flowRateNormal: '',
          flowRateMax: '',
          flowRateUnit: 'GPM',
          pressureLow: '',
          pressureNormal: '',
          pressureMax: '',
          pressureUnit: 'PSIG',
          temperatureLow: '',
          temperatureNormal: '',
          temperatureMax: '',
          temperatureUnit: '°F',
          specificGravity: '',
          specificGravityUnit: 'SG',
          viscosity: '',
          viscosityUnit: 'cP',
          lineSize: '',
          connectionType: '',
          pressureClass: '',
          materialConstruction: '',
          failPosition: '',
          actuation: '',
          airPressure: '',
          airFilterRegulator: false,
          valveStyle: '',
          lockoutBracket: '',
          limitSwitch: '',
          solenoid: '',
          positionerBrand: '',
          electricalVoltage: '',
          feedbackRequired: '',
          mediaType: '',
          hazardousAreaClassification: '',
          electricalVoltageGeneral: '',
          electricalAreaClassification: '',
          remoteRequired: false,
          displayRequired: false,
          systemsNotes: '',
          additionalNotes: ''
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Category and subcategory definitions
  const categories = [
    {
      id: 'instrumentation',
      title: 'Instrumentation',
      description: 'Flow, pressure, temperature, level, and analytical instruments',
      icon: '📊'
    },
    {
      id: 'valves',
      title: 'Valves',
      description: 'Control valves, on/off valves, and actuation systems',
      icon: '🔧'
    },
    {
      id: 'systems',
      title: 'Systems',
      description: 'Complete solutions and custom engineered systems',
      icon: '⚙️'
    }
  ];

  const instrumentationTypes = [
    {
      id: 'flow',
      title: 'Flow',
      icon: '🌊',
      subtypes: ['Coriolis', 'Mag (Magnetic)', 'Vortex', 'DP (Differential Pressure)', 'Thermal Mass']
    },
    {
      id: 'pressure',
      title: 'Pressure',
      icon: '⏲️',
      subtypes: ['Line Pressure', 'DP (Differential Pressure)']
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: '🌡️',
      subtypes: ['Transmitter', 'Element', 'Complete Unit']
    },
    {
      id: 'level',
      title: 'Level',
      icon: '📏',
      subtypes: ['Pressure', 'Radar', 'Other']
    },
    {
      id: 'analytical',
      title: 'Analytical',
      icon: '🧪',
      subtypes: ['Transmitter', 'Probe (pH, Conductivity, ORP, Dissolved Oxygen, Turbidity, etc.)', 'Holder', 'Cable Length']
    },
    {
      id: 'gas-detection',
      title: 'Gas Detection',
      icon: '💨',
      subtypes: []
    },
    {
      id: 'other',
      title: 'Other',
      icon: '⚡',
      subtypes: []
    }
  ];

  const valveTypes = [
    { id: 'onoff', title: 'On/Off', description: 'Binary open/close operation' },
    { id: 'control', title: 'Control', description: 'Variable positioning control' }
  ];

  const lineSizes = [
    '1/2"', '3/4"', '1"', '1.5"', '2"', '3"', '4"', '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"', 'Other'
  ];

  const connectionTypes = [
    { id: 'npt', label: 'NPT' },
    { id: 'flanged', label: 'Flanged' },
    { id: 'triclamp', label: 'Triclamp' },
    { id: 'sanitary', label: 'Sanitary' },
    { id: 'socket-weld', label: 'Socket Weld' },
    { id: 'butt-weld', label: 'Butt Weld' },
    { id: 'other', label: 'Other' }
  ];

  const pressureClasses = ['150', '300', '600', '900', '1500', '2500', 'Other'];

  const materials = ['Stainless Steel', 'Carbon Steel', 'Hastelloy', 'Other'];

  const valveStyles = ['Ball', 'Butterfly', 'Plug', 'Gate', 'Segmented Ball', 'Globe'];

  const getSelectedInstrumentationType = () => {
    return instrumentationTypes.find(type => type.id === formData.instrumentationType);
  };

  // Determine if electrical requirements are needed
  const isElectricalItemSelected = () => {
    // Instrumentation that requires electrical power
    const electricalInstrumentation = ['flow', 'pressure', 'temperature', 'level', 'analytical'];
    
    // Valves with electrical actuation or accessories
    const hasElectricalValveComponents = 
      formData.actuation === 'Electric' ||
      (formData.valveType === 'onoff' && (formData.limitSwitch && formData.limitSwitch !== 'None')) ||
      (formData.valveType === 'onoff' && (formData.solenoid && formData.solenoid !== 'None')) ||
      (formData.valveType === 'control' && (formData.positionerBrand && formData.positionerBrand !== 'None'));

    return (
      (formData.category === 'instrumentation' && electricalInstrumentation.includes(formData.instrumentationType)) ||
      (formData.category === 'valves' && hasElectricalValveComponents)
    );
  };


  // Function to get device summary for display
  const getDeviceSummary = (deviceData) => {
    let summary = '';
    if (deviceData.category === 'instrumentation') {
      summary = `${deviceData.instrumentationType || 'Instrumentation'}`;
      if (deviceData.instrumentationSubtype) {
        summary += ` - ${deviceData.instrumentationSubtype}`;
      }
    } else if (deviceData.category === 'valves') {
      summary = `${deviceData.valveType || 'Valve'}`;
      if (deviceData.valveStyle) {
        summary += ` - ${deviceData.valveStyle}`;
      }
    } else if (deviceData.category === 'systems') {
      summary = 'System';
    }
    return summary || 'Device';
  };

  // Function to add current device to list
  const addDevice = () => {
    if (!formData.category) {
      alert('Please select a category before adding device');
      return;
    }
    
    const deviceData = { ...formData };
    // Don't include contact info in device data
    const { firstName, lastName, email, company, ...deviceFields } = deviceData;
    
    setDevices(prev => [...prev, { ...deviceFields, id: Date.now() }]);
    
    // Reset device-specific fields but keep contact info
    setFormData(prev => ({
      firstName: prev.firstName,
      lastName: prev.lastName,
      email: prev.email,
      company: prev.company,
      
      // Reset all device fields
      category: '',
      instrumentationType: '',
      instrumentationSubtype: '',
      valveType: '',
      flowRateLow: '',
      flowRateNormal: '',
      flowRateMax: '',
      flowRateUnit: 'GPM',
      pressureLow: '',
      pressureNormal: '',
      pressureMax: '',
      pressureUnit: 'PSIG',
      temperatureLow: '',
      temperatureNormal: '',
      temperatureMax: '',
      temperatureUnit: '°F',
      specificGravity: '',
      specificGravityUnit: 'SG',
      viscosity: '',
      viscosityUnit: 'cP',
      lineSize: '',
      connectionType: '',
      pressureClass: '',
      materialConstruction: '',
      failPosition: '',
      actuation: '',
      airPressure: '',
      airFilterRegulator: false,
      valveStyle: '',
      lockoutBracket: '',
      limitSwitch: '',
      solenoid: '',
      positionerBrand: '',
      electricalVoltage: '',
      feedbackRequired: '',
      mediaType: '',
      hazardousAreaClassification: '',
      electricalVoltageGeneral: '',
      electricalAreaClassification: '',
      remoteRequired: false,
      displayRequired: false,
      systemsNotes: '',
      additionalNotes: ''
    }));
  };

  // Function to remove device
  const removeDevice = (deviceId) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 overflow-visible">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3 animate-fade-in">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg mb-2 shadow-md">
            <span className="text-lg text-white font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-balance">
            Allied Instrumentation
          </h1>
          <h2 className="text-lg text-slate-600 mb-1">
            Request a Quote
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-balance">
            Get expert quotes for process instrumentation, valves, and custom systems.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="card animate-slide-up">
          <form 
            data-netlify="true" 
            name="quote-form" 
            onSubmit={handleSubmit}
            className="card-body space-y-4"
          >
            <input type="hidden" name="form-name" value="quote-form" />
            {/* Honeypot field for spam protection - hidden from users */}
            <input type="text" name="bot-field" style={{ display: 'none' }} />
            {/* Hidden fields for Netlify form detection */}
            <input type="hidden" name="firstName" />
            <input type="hidden" name="lastName" />
            <input type="hidden" name="email" />
            <input type="hidden" name="company" />
            <input type="hidden" name="deviceCount" />
            <input type="hidden" name="devices" />
            
            {/* Contact Information Section */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">1</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="form-error">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="form-label">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="form-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="your.email@company.com"
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="company" className="form-label">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`form-input ${errors.company ? 'border-red-300 focus:ring-red-500' : ''}`}
                    placeholder="Your company name"
                  />
                  {errors.company && <p className="form-error">{errors.company}</p>}
                </div>
              </div>
            </div>

            {/* Devices List */}
            {devices.length > 0 && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Added Devices ({devices.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {devices.map((device, index) => (
                      <div key={device.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900">{getDeviceSummary(device)}</h4>
                            <p className="text-sm text-green-700">
                              {device.lineSize && `${device.lineSize} • `}
                              {device.materialConstruction && `${device.materialConstruction} • `}
                              {device.actuation && `${device.actuation}`}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDevice(device.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove device"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="section-divider"></div>

            {/* Category Selection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">2</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Product Category</h3>
              </div>

              <div>
                <label className="form-label">Select Product Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-input ${errors.category ? 'border-red-300 focus:ring-red-500' : ''}`}
                >
                  <option value="">Choose category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.title} - {category.description}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="form-error">{errors.category}</p>}
              </div>
            </div>

            {/* Instrumentation Subcategories */}
            {formData.category === 'instrumentation' && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Instrumentation Type</h3>
                  </div>

                  <div>
                    <label className="form-label">Instrumentation Type</label>
                    <select
                      name="instrumentationType"
                      value={formData.instrumentationType}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select instrumentation type...</option>
                      {instrumentationTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.icon} {type.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instrumentation Subtypes */}
                  {formData.instrumentationType && getSelectedInstrumentationType()?.subtypes.length > 0 && (
                    <div className="mt-6">
                      <label className="form-label">
                        {getSelectedInstrumentationType()?.title} Subtype
                      </label>
                      <select
                        name="instrumentationSubtype"
                        value={formData.instrumentationSubtype}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select subtype...</option>
                        {getSelectedInstrumentationType()?.subtypes.map((subtype) => (
                          <option key={subtype} value={subtype}>{subtype}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Remote and Display Options - Show for all instruments */}
                  {formData.instrumentationType && (
                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <h5 className="font-medium text-slate-800 mb-4">Additional Options</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="remoteRequired"
                            checked={formData.remoteRequired}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              remoteRequired: e.target.checked
                            }))}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-slate-700">Remote Required</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="displayRequired"
                            checked={formData.displayRequired}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              displayRequired: e.target.checked
                            }))}
                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm font-medium text-slate-700">Display Required</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Valve Subcategories */}
            {formData.category === 'valves' && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Valve Type</h3>
                  </div>

                  <div>
                    <label className="form-label">Valve Type</label>
                    <select
                      name="valveType"
                      value={formData.valveType}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select valve type...</option>
                      {valveTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          🔧 {type.title} - {type.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Valve-Specific Fields */}
                  {formData.valveType && (
                    <>
                      <div className="section-divider"></div>
                      <div className="space-y-6">
                        <h4 className="font-medium text-slate-800">Valve Configuration</h4>
                        
                        {/* Universal Valve Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="form-label">Fail Position</label>
                            <select
                              name="failPosition"
                              value={formData.failPosition}
                              onChange={handleInputChange}
                              className="form-input"
                            >
                              <option value="">Select fail position...</option>
                              <option value="Open">Open</option>
                              <option value="Close">Close</option>
                              <option value="In Place">In Place</option>
                            </select>
                          </div>

                          <div>
                            <label className="form-label">Actuation</label>
                            <select
                              name="actuation"
                              value={formData.actuation}
                              onChange={handleInputChange}
                              className="form-input"
                            >
                              <option value="">Select actuation...</option>
                              <option value="Pneumatic">Pneumatic</option>
                              <option value="Electric">Electric</option>
                              <option value="Manual">Manual</option>
                            </select>
                          </div>

                          <div>
                            <label className="form-label">Valve Style</label>
                            <select
                              name="valveStyle"
                              value={formData.valveStyle}
                              onChange={handleInputChange}
                              className="form-input"
                            >
                              <option value="">Select valve style...</option>
                              {valveStyles.map((style) => (
                                <option key={style} value={style}>{style}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="form-label">Lockout Bracket Required</label>
                            <select
                              name="lockoutBracket"
                              value={formData.lockoutBracket}
                              onChange={handleInputChange}
                              className="form-input"
                            >
                              <option value="">Select...</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="airFilterRegulator"
                                checked={formData.airFilterRegulator}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  airFilterRegulator: e.target.checked
                                }))}
                                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="form-label mb-0">Air Filter Regulator Required</span>
                            </label>
                          </div>
                        </div>

                        {/* Air Pressure Selection for Pneumatic Valves */}
                        {formData.actuation === 'Pneumatic' && (
                          <div className="mt-3">
                            <label className="form-label">Air Pressure *</label>
                            <select
                              name="airPressure"
                              value={formData.airPressure}
                              onChange={handleInputChange}
                              className="form-input"
                            >
                              <option value="">Select air pressure...</option>
                              <option value="60 PSI">60 PSI</option>
                              <option value="80 PSI">80 PSI</option>
                            </select>
                          </div>
                        )}

                        {/* On/Off Valve Specific Fields */}
                        {formData.valveType === 'onoff' && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-4">On/Off Valve Specific</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="form-label">Limit Switch</label>
                                <select
                                  name="limitSwitch"
                                  value={formData.limitSwitch}
                                  onChange={handleInputChange}
                                  className="form-input"
                                >
                                  <option value="">Select limit switch...</option>
                                  <option value="Topworx">Topworx</option>
                                  <option value="Westlock">Westlock</option>
                                  <option value="Other">Other</option>
                                  <option value="None">None</option>
                                </select>
                              </div>

                              <div>
                                <label className="form-label">Solenoid</label>
                                <select
                                  name="solenoid"
                                  value={formData.solenoid}
                                  onChange={handleInputChange}
                                  className="form-input"
                                >
                                  <option value="">Select solenoid...</option>
                                  <option value="ASCO">ASCO</option>
                                  <option value="Other">Other</option>
                                  <option value="None">None</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Control Valve Specific Fields */}
                        {formData.valveType === 'control' && (
                          <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <h5 className="font-medium text-green-900 mb-4">Control Valve Specific</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="form-label">Positioner Brand</label>
                                <select
                                  name="positionerBrand"
                                  value={formData.positionerBrand}
                                  onChange={handleInputChange}
                                  className="form-input"
                                >
                                  <option value="">Select positioner...</option>
                                  <option value="PMV">PMV</option>
                                  <option value="Westlock">Westlock</option>
                                  <option value="Masoneilan">Masoneilan</option>
                                  <option value="Other">Other</option>
                                  <option value="None">None</option>
                                </select>
                              </div>

                              <div>
                                <label className="form-label">Feedback Required</label>
                                <select
                                  name="feedbackRequired"
                                  value={formData.feedbackRequired}
                                  onChange={handleInputChange}
                                  className="form-input"
                                >
                                  <option value="">Select...</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                              </div>
                            </div>

                            {/* Remote and Display Options for Positioners */}
                            {formData.positionerBrand && formData.positionerBrand !== 'None' && (
                              <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg">
                                <h6 className="font-medium text-green-800 mb-3">Positioner Options</h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      name="remoteRequired"
                                      checked={formData.remoteRequired}
                                      onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        remoteRequired: e.target.checked
                                      }))}
                                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Remote Required</span>
                                  </label>

                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      name="displayRequired"
                                      checked={formData.displayRequired}
                                      onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        displayRequired: e.target.checked
                                      }))}
                                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Display Required</span>
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Systems Category */}
            {formData.category === 'systems' && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">System Requirements</h3>
                  </div>

                  <div>
                    <label className="form-label">
                      System Description & Requirements *
                    </label>
                    <textarea
                      name="systemsNotes"
                      value={formData.systemsNotes}
                      onChange={handleInputChange}
                      rows={6}
                      className="form-input"
                      placeholder="Please describe your system requirements, including specifications, drawings, or any complex requirements..."
                    />
                    <p className="text-sm text-slate-500 mt-1">
                      For systems quotes, you can provide detailed requirements here. Our engineering team will review and provide a comprehensive solution.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Universal Process Conditions - Show for Instrumentation and Valves */}
            {(formData.category === 'instrumentation' || formData.category === 'valves') && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Process Conditions</h3>
                  </div>

                  {/* Compact Process Conditions Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    {/* Flow Rate */}
                    <div>
                      <h4 className="font-medium text-slate-800 text-xs mb-1">Flow Rate</h4>
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="number"
                          name="flowRateLow"
                          value={formData.flowRateLow}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Low"
                        />
                        <input
                          type="number"
                          name="flowRateNormal"
                          value={formData.flowRateNormal}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Normal"
                        />
                        <input
                          type="number"
                          name="flowRateMax"
                          value={formData.flowRateMax}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Max"
                        />
                        <select
                          name="flowRateUnit"
                          value={formData.flowRateUnit}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                        >
                          <option value="GPM">GPM</option>
                          <option value="LPM">LPM</option>
                          <option value="CFM">CFM</option>
                          <option value="SCFM">SCFM</option>
                          <option value="kg/h">kg/h</option>
                          <option value="lb/h">lb/h</option>
                        </select>
                      </div>
                    </div>

                    {/* Pressure */}
                    <div>
                      <h4 className="font-medium text-slate-800 text-xs mb-1">Pressure</h4>
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="number"
                          name="pressureLow"
                          value={formData.pressureLow}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Low"
                        />
                        <input
                          type="number"
                          name="pressureNormal"
                          value={formData.pressureNormal}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Normal"
                        />
                        <input
                          type="number"
                          name="pressureMax"
                          value={formData.pressureMax}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Max"
                        />
                        <select
                          name="pressureUnit"
                          value={formData.pressureUnit}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                        >
                          <option value="PSIG">PSIG</option>
                          <option value="PSIA">PSIA</option>
                          <option value="bar">bar</option>
                          <option value="kPa">kPa</option>
                          <option value="MPa">MPa</option>
                        </select>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div>
                      <h4 className="font-medium text-slate-800 text-xs mb-1">Temperature</h4>
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="number"
                          name="temperatureLow"
                          value={formData.temperatureLow}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Low"
                        />
                        <input
                          type="number"
                          name="temperatureNormal"
                          value={formData.temperatureNormal}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Normal"
                        />
                        <input
                          type="number"
                          name="temperatureMax"
                          value={formData.temperatureMax}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="Max"
                        />
                        <select
                          name="temperatureUnit"
                          value={formData.temperatureUnit}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                        >
                          <option value="°F">°F</option>
                          <option value="°C">°C</option>
                          <option value="K">K</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Process Data - Ultra Compact */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="flex space-x-1 items-end">
                      <div className="flex-1">
                        <label className="form-label text-xs">Specific Gravity</label>
                        <input
                          type="number"
                          name="specificGravity"
                          value={formData.specificGravity}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="1.0"
                          step="0.01"
                        />
                      </div>
                      <select
                        name="specificGravityUnit"
                        value={formData.specificGravityUnit}
                        onChange={handleInputChange}
                        className="form-input w-12 text-xs"
                      >
                        <option value="SG">SG</option>
                      </select>
                    </div>
                    <div className="flex space-x-1 items-end">
                      <div className="flex-1">
                        <label className="form-label text-xs">Viscosity</label>
                        <input
                          type="number"
                          name="viscosity"
                          value={formData.viscosity}
                          onChange={handleInputChange}
                          className="form-input text-xs"
                          placeholder="1.0"
                          step="0.1"
                        />
                      </div>
                      <select
                        name="viscosityUnit"
                        value={formData.viscosityUnit}
                        onChange={handleInputChange}
                        className="form-input w-12 text-xs"
                      >
                        <option value="cP">cP</option>
                        <option value="cSt">cSt</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label text-xs">Media Type</label>
                      <input
                        type="text"
                        name="mediaType"
                        value={formData.mediaType}
                        onChange={handleInputChange}
                        className="form-input text-xs"
                        placeholder="Water, Oil, Gas..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Universal Physical Specifications - Show for Instrumentation and Valves */}
            {(formData.category === 'instrumentation' || formData.category === 'valves') && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">5</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Physical Specifications</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Line Size</label>
                      <select
                        name="lineSize"
                        value={formData.lineSize}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select line size...</option>
                        {lineSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Process Connection Type</label>
                      <select
                        name="connectionType"
                        value={formData.connectionType}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select connection type...</option>
                        {connectionTypes.map((type) => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Show pressure class only for flanged connections */}
                  {formData.connectionType === 'flanged' && (
                    <div>
                      <label className="form-label">Pressure Class</label>
                      <select
                        name="pressureClass"
                        value={formData.pressureClass}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="">Select pressure class...</option>
                        {pressureClasses.map((pClass) => (
                          <option key={pClass} value={pClass}>{pClass}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="form-label">Material of Construction</label>
                    <select
                      name="materialConstruction"
                      value={formData.materialConstruction}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select material...</option>
                      {materials.map((material) => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>

                </div>
              </>
            )}

            {/* Electrical Requirements - Show for all electrical items */}
            {isElectricalItemSelected() && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-semibold text-sm">⚡</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Electrical Requirements</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Required</span>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">
                        Electrical Voltage *
                      </label>
                      <select
                        name="electricalVoltageGeneral"
                        value={formData.electricalVoltageGeneral}
                        onChange={handleInputChange}
                        className={`form-input ${errors.electricalVoltageGeneral ? 'border-red-300 focus:ring-red-500' : ''}`}
                        required
                      >
                        <option value="">Select voltage...</option>
                        <option value="12VDC">12VDC</option>
                        <option value="24VDC">24VDC</option>
                        <option value="120VAC">120VAC</option>
                        <option value="Loop Power">Loop Power</option>
                      </select>
                      {errors.electricalVoltageGeneral && <p className="form-error">{errors.electricalVoltageGeneral}</p>}
                    </div>

                    <div>
                      <label className="form-label">
                        Electrical Area Classification *
                      </label>
                      <select
                        name="electricalAreaClassification"
                        value={formData.electricalAreaClassification}
                        onChange={handleInputChange}
                        className={`form-input ${errors.electricalAreaClassification ? 'border-red-300 focus:ring-red-500' : ''}`}
                        required
                      >
                        <option value="">Select classification...</option>
                        <option value="General Purpose">General Purpose (Non-hazardous)</option>
                        <option value="Class I Div 1">Class I Division 1</option>
                        <option value="Class I Div 2">Class I Division 2</option>
                        <option value="Class II Div 1">Class II Division 1</option>
                        <option value="Class II Div 2">Class II Division 2</option>
                      </select>
                      {errors.electricalAreaClassification && <p className="form-error">{errors.electricalAreaClassification}</p>}
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <strong>Note:</strong> Proper electrical classification ensures compliance with safety standards and correct equipment selection for your installation environment.
                  </div>
                </div>
              </>
            )}

            {/* Additional Notes */}
            {formData.category && formData.category !== 'systems' && (
              <>
                <div className="section-divider"></div>
                <div className="space-y-3 animate-slide-up">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">6</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Additional Information</h3>
                  </div>

                  <div>
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={4}
                      className="form-input"
                      placeholder="Any additional specifications, special requirements, or notes for our team..."
                    />
                  </div>
                </div>
              </>
            )}

            {/* Add Device and Submit Buttons */}
            <div className="pt-6 space-y-4">
              {/* Add Device Button - Show when category is selected */}
              {formData.category && (
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={addDevice}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Another Device</span>
                  </button>
                  <div className="text-sm text-slate-500">
                    Device {devices.length + 1}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full md:w-auto min-w-[200px] flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Quote {devices.length > 0 ? `(${devices.length + 1} devices)` : ''}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 text-center">
                Our team will review your request and respond within 24 hours with a detailed quote.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;