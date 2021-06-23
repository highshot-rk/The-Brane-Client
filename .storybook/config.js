import { configure, addDecorator } from '@storybook/react'
import React from 'react'
// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css'
import '../app/styles/main.scss'
import '../app/styles/index'
import './styles.css'
import GlobalStyle from '../app/styles/base'

function loadStories () {
  require('../stories')
  require('../stories/node')
  require('../stories/windowElements')
  require('../stories/formElements')
  require('../stories/contentWindow')
  require('../stories/search')
  require('../stories/accordion')
}
const withGlobal = (cb) => (
  <React.Fragment>
    <GlobalStyle />
    {cb()}
  </React.Fragment>
);

addDecorator(withGlobal);
configure(loadStories, module)
