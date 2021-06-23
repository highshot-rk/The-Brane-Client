const basicFields = [
  {
    id: 'bf03',
    name: 'Title',
    type: 'string',
    value: '',
    required: true,
  },
  {
    id: 'bf02',
    name: 'Upload File',
    type: 'file',
    value: '',
    required: false,
  },
  {
    id: 'bf05',
    name: 'Date',
    type: 'date',
    value: '',
    required: true,
  },
]

export default [
  {
    id: 'ty01',
    label: 'Research article',
    fields: [
      ...basicFields,
      {
        id: 'r01',
        name: 'Journal title',
        type: 'string',
        required: true,
      },
      {
        id: 'r02',
        name: 'Subject(s) / Index terms / Keywords',
        type: 'string',
        required: true,
      },
      {
        id: 'r03',
        name: 'Open Access or not?',
        type: 'bool',
        required: false,
      },
      {
        id: 'r04',
        name: 'Publication date',
        type: 'date',
        required: false,
      },
      {
        id: 'r05',
        name: 'Abstract',
        type: 'string',
        required: false,
      },
      {
        id: 'r06',
        name: 'DOI',
        type: 'string',
        required: true,
      },
      {
        id: 'r07',
        name: 'Volume #, issue #, page #',
        type: 'string',
        required: false,
      },
      {
        id: 'r08',
        name: 'Altmetric score',
        type: 'string',
        required: false,
      },
    ],
  },
  {
    id: 'ty02',
    label: 'Conference paper',
    fields: [
      ...basicFields,
      {
        id: 'c01',
        name: 'DOI',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'ty03',
    label: 'Thesis',
    fields: [
      ...basicFields,
    ],
  },
  {
    id: 'ty04',
    label: 'Preprint',
    fields: [
      ...basicFields,
      {
        id: 'p01',
        name: 'DOI',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'ty05',
    label: 'Book',
    fields: [
      ...basicFields,
    ],
  },
  {
    id: 'ty06',
    label: 'Chapter',
    fields: [
      ...basicFields,
    ],
  },
  {
    id: 'ty07',
    label: 'Technical paper',
    fields: [
      ...basicFields,
    ],
  },
  {
    id: 'ty08',
    label: 'Patent',
    fields: [
      ...basicFields,
      {
        id: 'pt01',
        name: 'Classification',
        type: 'string',
        required: true,
      },
      {
        id: 'pt02',
        name: 'Inventor(s)',
        type: 'string',
        required: true,
      },
      {
        id: 'pt03',
        name: 'Owner',
        type: 'string',
        required: true,
      },
    ],
  },
  {
    id: 'ty09',
    label: 'Website',
    fields: [
      ...basicFields,
      {
        id: 'w01',
        name: 'Name of website',
        type: 'string',
        required: true,
      },
    ],
  },
]
