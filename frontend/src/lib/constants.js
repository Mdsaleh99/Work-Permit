export const FORM_COMPONENTS = [
  {
    type: 'text',
    label: 'Text Field',
    description: 'Single line text input'
  },
  {
    type: 'textarea',
    label: 'Text Area',
    description: 'Multi-line text input'
  },
  {
    type: 'date',
    label: 'Date Picker',
    description: 'Date selection field'
  },
  {
    type: 'time',
    label: 'Time Picker',
    description: 'Time selection field'
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    description: 'Multiple choice selection'
  },
  {
    type: 'radio',
    label: 'Yes/No/N/A',
    description: 'Single choice selection'
  },
  {
    type: 'signature',
    label: 'Signature',
    description: 'Digital signature field'
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Data table component'
  },
  {
    type: 'header',
    label: 'Header',
    description: 'Section header'
  },
  {
    type: 'logo',
    label: 'Logo',
    description: 'Company logo'
  }
];

export const PTW_SECTIONS = [
  {
    id: 'work-description',
    title: 'Work Description',
    description: 'General work details and information'
  },
  {
    id: 'tools-equipment',
    title: 'Tools & Equipment',
    description: 'List of tools and equipment to be used'
  },
  {
    id: 'ppe',
    title: 'PPE Checklist',
    description: 'Personal Protective Equipment requirements'
  },
  {
    id: 'hazard-identification',
    title: 'Hazard Identification',
    description: 'Identification and assessment of hazards'
  },
  {
    id: 'ssow',
    title: 'Safe System of Work',
    description: 'Safe work procedures and methods'
  },
  {
    id: 'lmra',
    title: 'Last Minute Risk Assessment',
    description: 'Final risk assessment before work begins'
  },
  {
    id: 'declaration',
    title: 'Declaration',
    description: 'Work completion declarations'
  },
  {
    id: 'opening-ptw',
    title: 'Opening PTW',
    description: 'Permit to Work opening procedures'
  },
  {
    id: 'closure',
    title: 'Closure',
    description: 'Work completion and permit closure'
  }
];

export const COMPONENT_TEMPLATES = {
  text: {
    type: 'text',
    label: 'Text Field',
    required: false,
    enabled: true,
    value: '',
    placeholder: 'Enter text...'
  },
  textarea: {
    type: 'textarea',
    label: 'Text Area',
    required: false,
    enabled: true,
    value: '',
    placeholder: 'Enter text...',
    rows: 3
  },
  date: {
    type: 'date',
    label: 'Date',
    required: false,
    enabled: true,
    value: ''
  },
  time: {
    type: 'time',
    label: 'Time',
    required: false,
    enabled: true,
    value: ''
  },
  checkbox: {
    type: 'checkbox',
    label: 'Checkbox Group',
    required: false,
    enabled: true,
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedValues: []
  },
  radio: {
    type: 'radio',
    label: 'Radio Group',
    required: false,
    enabled: true,
    options: ['Yes', 'No', 'N/A'],
    selectedValue: ''
  },
  signature: {
    type: 'signature',
    label: 'Signature',
    required: false,
    enabled: true,
    value: ''
  },
  table: {
    type: 'table',
    label: 'Table',
    required: false,
    enabled: true,
    columns: ['Column 1', 'Column 2', 'Column 3'],
    rows: 3
  },
  header: {
    type: 'header',
    label: 'Header',
    required: false,
    enabled: true,
    text: 'Section Header',
    level: 2
  },
  logo: {
    type: 'logo',
    label: 'Logo',
    required: false,
    enabled: true,
    src: '',
    alt: 'Company Logo'
  }
};

export const PTW_SECTION_TEMPLATES = [
  {
    id: 'work-description',
    title: 'Work Description',
    components: [
      {
        id: 'work-order-no',
        type: 'text',
        label: 'Work Order No:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'work-permit-no',
        type: 'text',
        label: 'Work Permit No:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'division-department',
        type: 'text',
        label: 'Division/Department:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'area-of-work',
        type: 'text',
        label: 'Area of Work:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'location',
        type: 'text',
        label: 'Location:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'work-starting-date',
        type: 'date',
        label: 'Work Starting Date:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'work-starting-time',
        type: 'time',
        label: 'Time:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'work-ending-date',
        type: 'date',
        label: 'Work Ending Date:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'work-ending-time',
        type: 'time',
        label: 'Time:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'description-of-work',
        type: 'textarea',
        label: 'Description Of the Work:',
        required: true,
        enabled: true,
        value: '',
        rows: 4
      }
    ]
  },
  {
    id: 'tools-equipment',
    title: 'Tools & Equipment',
    components: [
      {
        id: 'tools-equipment-table',
        type: 'table',
        label: 'LISTING OF IDENTIFIED TOOLS AND/OR EQUIPMENT TO BE USED FOR THE ACTIVITY.',
        required: false,
        enabled: true,
        columns: ['1', '2', '3', '4', '5', '6'],
        rows: 2
      }
    ]
  },
  {
    id: 'ppe',
    title: 'PPE Checklist',
    components: [
      {
        id: 'ppe-checklist',
        type: 'checkbox',
        label: 'PERSONAL PROTECTIVE EQUIPMENT (CROSS WITH AN X):',
        required: false,
        enabled: true,
        options: [
          'Helmet', 'Welder\'s Helmet', 'Welder\'s Apron', 'Work Clothes', 'Dust Mask',
          'Hear Protectors', 'Emergency Respirator', 'Protective Goggles', 'Safety Belts',
          'Gas Mask', 'Safety Shoes', 'Anti-Dust Overalls', 'Dielectric Boots',
          'Dielectric Gloves', 'Rubber Safety Boots', 'Welders Breeches', 'Safety Harness',
          'Safety Gloves', 'Safety Glasses', 'H2S Mask'
        ],
        selectedValues: []
      },
      {
        id: 'other-safety-measures',
        type: 'text',
        label: 'Other Safety Measures:',
        required: false,
        enabled: true,
        value: ''
      }
    ]
  },
  {
    id: 'hazard-identification',
    title: 'Hazard Identification',
    components: [
      {
        id: 'hazard-checklist',
        type: 'checkbox',
        label: 'HAZARD IDENTIFICATION (CROSS WITH AN X):',
        required: false,
        enabled: true,
        options: [
          'Hand tools inspected', 'Work area barricaded', 'Required PPE worn', 'Worker competent', 'Worker Fit-To-Work',
          'Slip/Trip and Fall', 'Dust, fumes or mist', 'Risk of Fall', 'Noise', 'Vibration',
          'Pinch Points', 'Fall of objects', 'Illumination', 'Blind spots', 'Visibility',
          'Electrical hazards', 'Use of chemical', 'Release of energy', 'Release of pressure', 'Likelihood of fire',
          'Generation of waste', 'SIMOP', 'LOTO', 'Hit by/Caught in-between', 'Inclement weather'
        ],
        selectedValues: []
      },
      {
        id: 'other-special-hazards',
        type: 'text',
        label: 'Other Special Hazards:',
        required: false,
        enabled: true,
        value: ''
      },
      {
        id: 'electrical-certificate',
        type: 'radio',
        label: 'Is Electrical Certificate Required?',
        required: false,
        enabled: true,
        options: ['Yes', 'No', 'N/A'],
        selectedValue: ''
      },
      {
        id: 'electrical-certificate-number',
        type: 'text',
        label: 'If Yes Certificate Number:',
        required: false,
        enabled: true,
        value: ''
      },
      {
        id: 'excavation-certificate',
        type: 'radio',
        label: 'Is Excavation Certificate Required?',
        required: false,
        enabled: true,
        options: ['Yes', 'No', 'N/A'],
        selectedValue: ''
      },
      {
        id: 'excavation-certificate-number',
        type: 'text',
        label: 'If Yes Certificate Number:',
        required: false,
        enabled: true,
        value: ''
      },
      {
        id: 'radiography-certificate',
        type: 'radio',
        label: 'Is Radiography Certificate Required?',
        required: false,
        enabled: true,
        options: ['Yes', 'No', 'N/A'],
        selectedValue: ''
      },
      {
        id: 'radiography-certificate-number',
        type: 'text',
        label: 'If Yes Certificate Number:',
        required: false,
        enabled: true,
        value: ''
      }
    ]
  },
  {
    id: 'ssow',
    title: 'Safe System of Work',
    components: [
      {
        id: 'toolbox-talk',
        type: 'radio',
        label: 'Has Toolbox Talk been conducted?',
        required: true,
        enabled: true,
        options: ['Yes', 'No'],
        selectedValue: ''
      },
      {
        id: 'scope-explained',
        type: 'radio',
        label: 'Has the scope of work been explained to workers?',
        required: true,
        enabled: true,
        options: ['Yes', 'No'],
        selectedValue: ''
      },
      {
        id: 'risk-assessment',
        type: 'radio',
        label: 'Is the Risk Assessment attached or explained?',
        required: true,
        enabled: true,
        options: ['Yes', 'No'],
        selectedValue: ''
      }
    ]
  },
  {
    id: 'lmra',
    title: 'Last Minute Risk Assessment',
    components: [
      {
        id: 'lmra-checklist',
        type: 'checkbox',
        label: 'LAST MINUTE RISK ASSESSMENT',
        required: false,
        enabled: true,
        options: [
          'Is access / egress adequate.',
          'Is lighting adequate for the activity.',
          'Do workers understand the task.',
          'Is the task safe to do in today\'s weather condition.',
          'Are all tools inspected by the user.',
          'Is the work area clear of tripping hazards.',
          'Are the workers aware of emergency procedure.',
          'Are the emergency escape routes established?'
        ],
        selectedValues: []
      }
    ]
  },
  {
    id: 'declaration',
    title: 'Declaration',
    components: [
      {
        id: 'site-preparation',
        type: 'text',
        label: 'Site Preparation completed and work can commence.',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'permit-issuing-authority',
        type: 'text',
        label: 'Permit Issuing Authority',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'permit-issuing-date',
        type: 'date',
        label: 'Date',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'safety-understanding',
        type: 'text',
        label: 'I fully understand the safety precaution to be taken as described above.',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'permit-receiving-authority',
        type: 'text',
        label: 'Permit Receiving Authority',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'permit-receiving-date',
        type: 'date',
        label: 'Date',
        required: true,
        enabled: true,
        value: ''
      }
    ]
  },
  {
    id: 'opening-ptw',
    title: 'Opening PTW',
    components: [
      {
        id: 'opening-instruction',
        type: 'textarea',
        label: 'The below signed persons are responsible for ensuring the work is performed under all the conditions mentioned and required safety precautions. Failure on this will be subjected to disciplinary actions.',
        required: false,
        enabled: true,
        value: '',
        rows: 3
      },
      {
        id: 'issuing-authority-name',
        type: 'text',
        label: 'Permit Issuing Authority - Name:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'issuing-authority-sign',
        type: 'signature',
        label: 'Sign:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'issuing-authority-date',
        type: 'date',
        label: 'Date:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'issuing-authority-time',
        type: 'time',
        label: 'Time:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'receiving-authority-name',
        type: 'text',
        label: 'Permit Receiving Authority - Name:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'receiving-authority-sign',
        type: 'signature',
        label: 'Sign:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'receiving-authority-date',
        type: 'date',
        label: 'Date:',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'receiving-authority-time',
        type: 'time',
        label: 'Time:',
        required: true,
        enabled: true,
        value: ''
      }
    ]
  },
  {
    id: 'closure',
    title: 'Closure',
    components: [
      {
        id: 'work-completed',
        type: 'textarea',
        label: 'The Work is completed and working area cleared.',
        required: true,
        enabled: true,
        value: '',
        rows: 2
      },
      {
        id: 'closure-issuing-authority',
        type: 'text',
        label: 'Permit Issuing Authority',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'closure-issuing-date',
        type: 'date',
        label: 'Date',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'closure-receiving-authority',
        type: 'text',
        label: 'Permit Receiving Authority',
        required: true,
        enabled: true,
        value: ''
      },
      {
        id: 'closure-receiving-date',
        type: 'date',
        label: 'Date',
        required: true,
        enabled: true,
        value: ''
      }
    ]
  }
];
