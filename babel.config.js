module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'modules': false,
        debug: false,
        'exclude': [
          'transform-regenerator',
        ],
        'useBuiltIns': 'entry',
        'corejs': {
          'version': 3,
        },
      },
    ],
    '@babel/preset-react',
  ],
  'env': {
    'production': {
      'only': [
        'app',
      ],
      'plugins': [
        'transform-react-remove-prop-types',
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements',
        'add-react-displayname',
      ],
    },
    'test': {
      'plugins': [
        '@babel/plugin-transform-modules-commonjs',
        'dynamic-import-node',
      ],
    },
  },
  'plugins': [
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    // set to loose to fix error with storybook
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-json-strings',
    'add-react-displayname',
    [
      '@babel/plugin-proposal-decorators',
      {
        'legacy': true,
      },
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        'proposal': 'minimal',
      },
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-function-bind',
    ['@babel/plugin-transform-regenerator', {
      'asyncGenerators': false,
      'generators': false,
      'async': false,
    }],
  ],
}
