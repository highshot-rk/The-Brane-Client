/**
 * Component Generator
 */

const componentExists = require('../utils/componentExists')

module.exports = {
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return componentExists(value) ? 'A component or container with this name already exists' : true
        }

        return 'The name is required'
      },
    },
  ],
  actions: ({
    type = 'ES6 Class',
    wantStyles = true,
    wantMessages = false,
  }) => {
    // Generate index.js and index.test.js
    const actions = [{
      type: 'add',
      path: '../../app/components/{{properCase name}}/index.js',
      templateFile: type === 'ES6 Class' ? './component/es6.js.hbs' : './component/stateless.js.hbs',
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/components/{{properCase name}}/tests/index.test.js',
      templateFile: './component/test.js.hbs',
      abortOnFail: true,
    }]

    // If they want a CSS file, add styles.css
    if (wantStyles) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/elements.js',
        templateFile: './component/elements.js.hbs',
        abortOnFail: true,
      })
    }

    // If they want a i18n messages file
    if (wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/messages.js',
        templateFile: './component/messages.js.hbs',
        abortOnFail: true,
      })
    }

    return actions
  },
}
