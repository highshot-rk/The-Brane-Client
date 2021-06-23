/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react'

import './styles.sass'
import NotificationPopup from 'components/NotificationPopup'
import { connect } from 'react-redux'
import { selectPopupMessage } from './selectors'
import { cleanPopupMessage, setPopupMessage } from './actions'
import { createStructuredSelector } from 'reselect'
import { hot } from 'react-hot-loader'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loadable from 'react-loadable'
import { featureEnabled } from 'utils/features'
import { getData } from 'utils/injectData'
import { compose } from 'redux'
import { composeAppReducer } from './reducer'
import { selectLoggedIn, selectEmailConfirmed, selectOnboardingStarted, selectAllowedGraphs, selectAuth } from 'containers/Auth/selectors'
import { composeAuthReducer } from 'containers/Auth/reducer'
import { BRANE_NODE_ID } from '../../constants'
import { ErrorWrapper, Wrapper, GraphBtn } from './elements'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

class BlankLoader extends React.Component {
  static propTypes = {
    error: PropTypes.object,
    retry: PropTypes.func,
  }
  render () {
    const props = this.props

    if (props.error) {
      console.log(props.error)
      return <div style={{ color: 'white', margin: 50 }}>
        {process.env !== 'production' ? <pre>{props.error.stack}</pre> : null}
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    }

    return null
  }
}

class GraphErrors extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      navigate: false,
      referrer: null,
    }
  }
  onClick = (graph) => {
    this.setState({
      referrer: `/graph/${graph}`,
    })
  }
  render () {
    const errors = getData('inject-data-errors')
    const { referrer } = this.state
    if (referrer) {
      window.location.reload()
      return <Redirect to={referrer} />
    }
    return (
      <ErrorWrapper>
        <h2>Failed Loading Graph</h2>
        <p>Please try again in a few minutes. If this continues, please let us know.</p>
        {errors.length ? <p>Errors:</p> : null}
        {errors.map(error => {
          return (<p>{error}</p>)
        })}
        <h2>Available Graphs:</h2>
        <br />
        <div className='graphs'>
          {this.props.allowedGraphs.map(graph => {
            return (<GraphBtn className='login-error social-margin' onClick={() => this.onClick(graph)}>{graph + ' graph'}</GraphBtn>)
          })}
        </div>
      </ErrorWrapper>
    )
  }
}

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    loggedIn: PropTypes.bool,
    emailConfirmed: PropTypes.bool,
    onBoardingStarted: PropTypes.bool,
    wasInvited: PropTypes.bool,
    popupMessage: PropTypes.shape({
      show: PropTypes.bool,
      message: PropTypes.string,
      bgColor: PropTypes.string,
      textColor: PropTypes.string,
      closePopup: PropTypes.func,
    }),
    cleanPopupMessage: PropTypes.func,
  }
  injectedReducers = [];
  injectedSagas = [];
  createRender = ({ component, authRequired, authProhibited, requireGraph }) => {
    authRequired = authRequired && featureEnabled('accounts')
    let loader = component
    const Loader = Loadable({ loader, loading: BlankLoader })
    return (props) => {
      if (authRequired && !this.props.loggedIn) {
        return <Redirect to='/hello' />
      }
      const atVerifyUser = props.match.path === '/verify-user/:token'
      const atVerifyEmail = props.location.pathname === '/verify-email'
      const atWelcome = props.location.pathname === '/welcome'

      // Redirect if the user hasn't finished onboarding
      if (this.props.loggedIn && !atVerifyUser) {
        if (
          !this.props.emailConfirmed &&
          !this.props.wasInvited &&
          !atVerifyEmail
        ) {
          return <Redirect to='/verify-email' />
        } else if (
          !this.props.auth.onBoardingStarted &&
          !atWelcome
        ) {
          return <Redirect to='/welcome' />
        }
      }

      // If the graph was not injected
      // show the user an error message instead of crashing.
      // Checking for the root node id doesn't cover all failures
      // but as long as it was injected the basic features should work
      if (requireGraph && !BRANE_NODE_ID) {
        return <GraphErrors allowedGraphs={this.props.allowedGraphs} />
      }

      if (authProhibited && this.props.loggedIn && this.props.emailConfirmed && this.props.auth.onBoardingStarted) {
        return <Redirect to='/' />
      }

      return <Loader {...props} />
    }
  }

  render () {
    const { popupMessage, cleanPopupMessage, allowedGraphs } = this.props
    const landingConfig = {
      component: () => import('containers/LandingPage'),
      authProhibited: true,
    }
    const location = this.props.location.location
    return (
      <div className='container'>
        <NotificationPopup
          show={popupMessage.show}
          message={popupMessage.message}
          bgColor={popupMessage.bgColor}
          textColor={popupMessage.textColor}
          closePopup={cleanPopupMessage} />
        <Wrapper>
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              timeout={{ enter: 300, exit: 300 }}
              classNames='fade'
            >
              <section className='route-section'>
                <Switch location={location}>
                  <Route exact path={['/join', '/log-in', '/hello']} render={this.createRender(landingConfig)} />
                  <Route path='/verify-user/:token' render={this.createRender({ ...landingConfig })} />
                  <Route exact path={['/verify-email', '/error']} render={this.createRender({ ...landingConfig, authRequired: true })} />
                  <Route exact path='/welcome' render={this.createRender({
                    component: () => import('containers/OnBoard'),
                    authRequired: true,
                  })} />
                  <Route path='/graph/:graphName' render={this.createRender({
                    component: () => import('containers/HomePage').then(({ default: HomePage }) => (props) => (
                      <HomePage {...props}>
                        <Switch>
                          <Route path='/graph/:graphName/profile/:userId' render={
                            this.createRender({
                              component: () => import('components/Profile'),
                              authRequired: true,
                            })
                          } />
                        </Switch>
                      </HomePage>
                    )),
                    authRequired: true,
                    requireGraph: true,
                  })} />
                  <Route path='/' render={() => {
                    if (allowedGraphs && this.props.loggedIn) {
                      return <Redirect to={`/graph/${allowedGraphs[0]}`} />
                    } else {
                      return <Redirect to={`/hello`} />
                    }
                  }} />
                </Switch>
              </section>
            </CSSTransition>
          </TransitionGroup>
        </Wrapper>
      </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    cleanPopupMessage: () => {
      dispatch(cleanPopupMessage())
    },
    setPopupMessage: payload => {
      dispatch(setPopupMessage(payload))
    },
    dispatch,
  }
}

const mapStateToProps = createStructuredSelector({
  popupMessage: selectPopupMessage(),
  loggedIn: selectLoggedIn,
  emailConfirmed: selectEmailConfirmed,
  onBoardingStarted: selectOnboardingStarted,
  allowedGraphs: selectAllowedGraphs,
  auth: selectAuth,
})

const AppContainer = compose(
  ...composeAppReducer,
  ...composeAuthReducer
)(connect(mapStateToProps, mapDispatchToProps)(
  App
))

export default hot(module)(AppContainer)
