import React, { Component } from 'react'
import { connect } from 'react-redux'
import { onBoardFinish } from 'containers/Auth/reducer'
import { QuestionsContainer, LogoContainer, ContentContainer } from './elements'
import { setPopupMessage, cleanPopupMessage } from '../App/actions'
import { push } from 'react-router-redux'
import { getNode } from 'api/node'
import { Redirect } from 'react-router-dom'

import Mission from './Mission'
import Welcome from './Welcome'
import Thanks from './Thanks'
import Location from '../../components/OnboardingQuestions/Location'
import School from '../../components/OnboardingQuestions/School'
import Discipline from '../../components/OnboardingQuestions/Discipline'
import Org from '../../components/OnboardingQuestions/Org'
import Occupation from '../../components/OnboardingQuestions/Occupation'
import Skills from '../../components/OnboardingQuestions/Skills'
import Projects from '../../components/OnboardingQuestions/Projects'
import Collegues from '../../components/OnboardingQuestions/Collegues'

import { createStructuredSelector } from 'reselect'
import { selectFirstName, selectAuthErrorLogin, selectAuth, selectOnboardingStarted, selectAllowedGraphs } from 'containers/Auth/selectors'

const steps = {
  WELCOME: 0,
  MISSION: 1,
  LOCATION: 2,
  SCHOOL: 3,
  DISCIPLINES: 4,
  ORGANISATION: 5,
  OCCUPATION: 6,
  SKILLS: 7,
  PROJECTS: 8,
  COLLEGUES: 9,
  THANKS: 10,
  FINISH: 11,
}

const lastItem = array => array[array.length - 1]

class OnBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      profileImage: null,
      username: '',
      groups: [],
      step: steps.WELCOME,
      showTitle: true,
      nodeCount: {},
      location: '',
      institutions: [],
      disciplines: [],
      organisation: [],
      occupation: [],
      skills: [],
      projects: [{ name: '', description: '', tags: [] }],
      colleagues: [],
    }
  }

  onDismiss = () => {
    throw new Error('not implemented')
  }

  handleChange = (e) => {
    this.setState({ location: e })
  }

  // School Logic

  onSchoolChange = (e) => {
    this.setState({
      institutions: [ ...this.state.institutions.filter((_, index) => index !== e) ],
    })
  }

  addSchoolTag = (e) => {
    this.setState({
      institutions: [ ...this.state.institutions, e ],
    })
  }

  // Discipline Logic

  onDisciplineChange = (e) => {
    this.setState({
      disciplines: [ ...this.state.disciplines.filter((_, index) => index !== e) ],
    })
  }

  addDisciplineTag = (e) => {
    this.setState({
      disciplines: [ ...this.state.disciplines, e ],
    })
  }

  // Organisation Logic

  onOrgChange = (e) => {
    this.setState({
      organisation: [ ...this.state.organisation.filter((_, index) => index !== e) ],
    })
  }

  addOrgTag = (e) => {
    this.setState({
      organisation: [ ...this.state.organisation, e ],
    })
  }

  // Occupation Logic

  onOccupationChange = (e) => {
    this.setState({
      occupation: [ ...this.state.occupation.filter((_, index) => index !== e) ],
    })
  }

  addOccupationTag = (e) => {
    this.setState({
      occupation: [ ...this.state.occupation, e ],
    })
  }

  // Skills Logic

  onSkillChange = (e) => {
    this.setState({
      skills: [ ...this.state.skills.filter((_, index) => index !== e) ],
    })
  }

  addSkillTag = (e) => {
    this.setState({
      skills: [ ...this.state.skills, e ],
    })
  }

  // Project Logic

  onProjectAddChild = () => {
    this.setState(prevState => ({
      projects: [ ...prevState.projects, { name: '', description: '', tags: [] } ],
    }))
  }

  onProjectRemoveChild = (i) => {
    let users = [...this.state.projects]
    users.splice(i, 1)
    this.setState({ projects: users })
  }

  onProjectTextChange = (event, i) => {
    let projects = [...this.state.projects]
    projects[i].name = event.target.value
    this.setState({ projects })
  }

  onProjectDescriptionChange = (event, i) => {
    let projects = [...this.state.projects]
    projects[i].description = event.target.value
    this.setState({ projects })
  }

  onProjectAddTag = (tag, i) => {
    let newTag = [...this.state.projects]
    newTag[i].tags.push(tag)
    this.forceUpdate()
  }

  // Colleague Logic

  onColleagueChange = (e) => {
    this.setState({
      colleagues: [ ...this.state.colleagues.filter((_, index) => index !== e) ],
    })
  }

  addColleagueTag = (e) => {
    this.setState({
      colleagues: [ ...this.state.colleagues, e ],
    })
  }

  onContinue = () => {
    const step = this.state.step

    switch (step) {
      case steps.WELCOME:
        return this.setState({
          step: steps.MISSION,
        })
      case steps.MISSION:
        return this.setState({
          step: steps.LOCATION,
        })
      case steps.LOCATION:
        return this.setState({
          step: steps.SCHOOL,
        })
      case steps.SCHOOL:
        return this.setState({
          step: steps.DISCIPLINES,
        })
      case steps.DISCIPLINES:
        return this.setState({
          step: steps.ORGANISATION,
        })
      case steps.ORGANISATION:
        return this.setState({
          step: steps.OCCUPATION,
        })
      case steps.OCCUPATION:
        return this.setState({
          step: steps.SKILLS,
        })
      case steps.SKILLS:
        return this.setState({
          step: steps.PROJECTS,
        })
      case steps.PROJECTS:
        return this.setState({
          step: steps.COLLEGUES,
        })
      case steps.COLLEGUES:
        return this.setState({
          step: steps.THANKS,
        })
      case steps.THANKS:
        this.onFinish()
        return this.setState({
          step: steps.FINISH,
        })
    }
  }

  onPrevious = () => {
    const step = this.state.step

    switch (step) {
      case steps.LOCATION:
        return this.setState({
          step: steps.MISSION,
        })
      case steps.SCHOOL:
        return this.setState({
          step: steps.LOCATION,
        })
      case steps.DISCIPLINES:
        return this.setState({
          step: steps.SCHOOL,
        })
      case steps.ORGANISATION:
        return this.setState({
          step: steps.DISCIPLINES,
        })
      case steps.OCCUPATION:
        return this.setState({
          step: steps.ORGANISATION,
        })
      case steps.SKILLS:
        return this.setState({
          step: steps.OCCUPATION,
        })
      case steps.PROJECTS:
        return this.setState({
          step: steps.SKILLS,
        })
      case steps.COLLEGUES:
        return this.setState({
          step: steps.PROJECTS,
        })
    }
  }

  updateUsername = (username) => {
    if (username.length > 0 && username[0] !== '@') {
      username = `@${username}`
    }

    this.setState({
      username,
    })
  }

  onLinksChange = (name, links) => {
    this.setState({
      [name]: links,
    })

    this.checkNodesCached(links.map(link => {
      if (link instanceof Array) {
        return lastItem(link)._key
      }

      return link._key
    }))
  }
  checkNodesCached = (nodeKeys) => {
    nodeKeys.forEach(key => {
      if (key in this.state.nodeCount) {
        return
      }

      getNode(key).then(result => {
        this.setState({
          nodeCount: {
            ...this.state.nodeCount,
            [key]: result.data.count,
          },
        })
      })
    })
  }
  createChildren = () => {
    const childrenArray = [
      ...this.state.groups.map(tagFilter => {
        const group = lastItem(tagFilter)
        const count = this.state.nodeCount[group._key] || 0
        return {
          ...group,
          _id: group._key,
          // put count in title so the nodes aren't sorted by count
          name: `${group.title} ${count && `(${count})`}`,
          cl: false,
          count: 0,
        }
      }),
      ...this.state.institutions.map(institution => {
        const count = this.state.nodeCount[institution._key]

        return {
          ...institution,
          _id: institution._key,
          name: `${institution.title} ${count && `(${count})`}`,
          cl: false,
          count: 0,
        }
      }),
      ...this.state.disciplines.map(discipline => {
        const count = this.state.nodeCount[discipline._key] || 0

        return {
          ...discipline,
          name: `${discipline.title} ${count && `(${count})`}`,
          _id: discipline._key,
          cl: false,
          count: 0,
        }
      }),
    ]

    return childrenArray.reduce((result, child) => {
      result[child._id] = child

      return result
    }, {})
  }

  calculateCollapsedPosition () {
    const width = this.svgWidth()
    const currentX = window.innerWidth * 0.5 < width
      ? window.innerWidth * 0.5 + width / 2
      : window.innerWidth * 0.75
    const currentY = window.innerHeight * 0.5

    const desiredX = window.innerWidth - 55
    const desiredY = window.innerHeight - 45

    return {
      x: desiredX - currentX,
      y: desiredY - currentY,
    }
  }

  svgWidth () {
    // TODO: create an HOC that provides innerWidth/innerHeight and listens to
    // window resize event
    return Math.max(window.innerWidth / 2, 600)
  }

  onFinish = async () => {
    const metaData = {
      'Location': this.state.location,
      'Institution': this.state.institutions,
      'Discipline': this.state.disciplines,
      'Organisations': this.state.organisation,
      'Occupations': this.state.occupation,
      'Skills': this.state.skills,
      'Projects': this.state.projects,
      'Colleagues': this.state.colleagues,
    }
    await this.props.onBoardFinish(metaData)
  }

  render () {
    // Redirects after the user has either finished the onboarding, or has clicked on "I will finish this later"
    if (this.props.auth.onBoardingStarted) {
      window.location.reload()
      return <Redirect to={`/graph/${this.props.allowedGraphs[0]}`} />
    }
    return (
      <div>
        <QuestionsContainer>
          <LogoContainer>
            <svg className='logo-svg' width='192' height='48' viewBox='0 0 141 35' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M47.7436 11.448V10.5948H37.1V11.448H41.9869V25.1405H42.8566V11.448H47.7436Z' fill='white' />
              <path d='M54.1971 14.2781C52.0229 14.3197 50.4905 15.2977 49.7658 17.1289V9.7H48.896V25.1405H49.7658V19.8341C49.7658 17.0041 51.3188 15.2145 53.99 15.152C56.2057 15.152 57.5103 16.463 57.5103 18.6896V25.1405H58.38V18.5232C58.38 15.8804 56.827 14.2781 54.1971 14.2781Z' fill='white' />
              <path d='M66.4413 14.2781C63.3973 14.2781 61.1816 16.5463 61.1816 19.7301C61.1816 22.9139 63.3973 25.1613 66.4413 25.1613C68.16 25.1613 69.6302 24.5162 70.6242 23.4342L70.1272 22.8723C69.2575 23.8295 67.9529 24.3706 66.4827 24.3706C63.9771 24.3706 62.1549 22.6018 62.0306 19.959H71.4525C71.5146 16.6087 69.6095 14.2781 66.4413 14.2781ZM62.0513 19.1891C62.2584 16.7336 64.0185 15.0688 66.4413 15.0688C68.9055 15.0688 70.4999 16.7336 70.6656 19.1891H62.0513Z' fill='white' />
              <path d='M80.8926 10.5948V25.1405H86.8563C90.1487 25.1405 92.0538 23.7047 92.0538 21.2284C92.0538 19.1891 90.7493 17.8156 88.5336 17.5451C90.3144 17.2122 91.3291 15.9844 91.3291 14.1948C91.3291 11.9266 89.6518 10.5948 86.8149 10.5948H80.8926ZM81.7623 11.448H86.7942C89.1134 11.448 90.4593 12.4884 90.4593 14.2989C90.4593 16.1509 89.1134 17.1914 86.7942 17.1914H81.7623V11.448ZM81.7623 18.0445H86.7942C89.5896 18.0445 91.1841 19.1682 91.1841 21.1243C91.1841 23.1428 89.5896 24.2873 86.7942 24.2873H81.7623V18.0445Z' fill='white' />
              <path d='M96.4357 14.2989H95.566V25.1405H96.4357V19.2723C96.622 16.7544 98.0715 15.1729 100.453 15.1729V14.2781C98.5271 14.3197 97.119 15.2769 96.4357 17.0249V14.2989Z' fill='white' />
              <path d='M109.156 25.1405H110.005L109.964 17.9405C109.943 15.6931 108.555 14.2781 106.008 14.2781C104.373 14.2781 103.13 14.8815 101.846 15.8179L102.26 16.4838C103.399 15.6098 104.538 15.0688 105.884 15.0688C108.038 15.0688 109.094 16.1717 109.115 18.0029V19.0642H105.284C102.799 19.0642 101.266 20.1671 101.266 21.9775C101.266 23.8087 102.695 25.1613 104.828 25.1613C106.692 25.1613 108.224 24.4954 109.135 22.9972L109.156 25.1405ZM104.952 24.3706C103.192 24.3706 102.095 23.3925 102.095 21.9567C102.095 20.5625 103.254 19.8341 105.367 19.8341H109.135V21.6029C108.473 23.4966 106.961 24.3706 104.952 24.3706Z' fill='white' />
              <path d='M119.248 14.2781C117.095 14.3197 115.562 15.2769 114.838 17.0665V14.2989H113.968V25.1405H114.838V19.2723C115.024 16.7752 116.556 15.2145 119.041 15.152C121.257 15.152 122.562 16.463 122.562 18.6896V25.1405H123.431V18.5232C123.431 15.8804 121.878 14.2781 119.248 14.2781Z' fill='white' />
              <path d='M131.495 14.2781C128.451 14.2781 126.236 16.5463 126.236 19.7301C126.236 22.9139 128.451 25.1613 131.495 25.1613C133.214 25.1613 134.684 24.5162 135.678 23.4342L135.181 22.8723C134.312 23.8295 133.007 24.3706 131.537 24.3706C129.031 24.3706 127.209 22.6018 127.085 19.959H136.507C136.569 16.6087 134.664 14.2781 131.495 14.2781ZM127.105 19.1891C127.313 16.7336 129.073 15.0688 131.495 15.0688C133.96 15.0688 135.554 16.7336 135.72 19.1891H127.105Z' fill='white' />
              <path opacity='0.9' fillRule='evenodd' clipRule='evenodd' d='M28.0547 18.0957L19.099 3.02106L14.2364 11.206L9.37411 3.0215L0.418419 18.0961L9.37411 33.1711L14.2367 24.9859L19.099 33.1706L28.0547 18.0957ZM13.6551 24.007L9.37411 31.2132L1.58158 18.0961L9.37411 4.97939L13.6549 12.185L10.1434 18.0957L13.6551 24.007ZM14.8183 24.007L19.099 31.2127L26.8916 18.0957L19.099 4.97894L14.818 12.185L18.3298 18.0961L14.8183 24.007ZM14.2364 13.1639L17.1666 18.0961L14.2367 23.028L11.3065 18.0957L14.2364 13.1639Z' fill='white' />
            </svg>
          </LogoContainer>
          <ContentContainer>
            {
              this.state.step === steps.WELCOME
                ? <Welcome
                  fn={this.props.auth.firstName}
                  onContinue={this.onContinue}
                  later={this.onFinish} />
                : this.state.step === steps.MISSION
                  ? <Mission
                    fn={this.props.auth.firstName}
                    onContinue={this.onContinue}
                    className='mission'
                    later={this.onFinish} />
                  : this.state.step === steps.LOCATION
                    ? <Location
                      fn={this.props.firstName}
                      location={this.state.location}
                      onChange={this.handleChange}
                      onContinue={this.onContinue}
                      onPrevious={this.onPrevious}
                      later={this.onFinish} />
                    : this.state.step === steps.SCHOOL
                      ? <School
                        fn={this.props.firstName}
                        institutions={this.state.institutions}
                        addTag={this.addSchoolTag}
                        onChange={this.onSchoolChange}
                        onContinue={this.onContinue}
                        onPrevious={this.onPrevious}
                        later={this.onFinish} />
                      : this.state.step === steps.DISCIPLINES
                        ? <Discipline
                          fn={this.props.firstName}
                          disciplines={this.state.disciplines}
                          addTag={this.addDisciplineTag}
                          onChange={this.onDisciplineChange}
                          onContinue={this.onContinue}
                          onPrevious={this.onPrevious}
                          groups={this.state.groups}
                          onGroupsChange={groups => this.onLinksChange('groups', groups)}
                          later={this.onFinish} />
                        : this.state.step === steps.ORGANISATION
                          ? <Org
                            fn={this.props.firstName}
                            organisation={this.state.organisation}
                            addTag={this.addOrgTag}
                            onChange={this.onOrgChange}
                            onContinue={this.onContinue}
                            onPrevious={this.onPrevious}
                            later={this.onFinish} />
                          : this.state.step === steps.OCCUPATION
                            ? <Occupation
                              fn={this.props.firstName}
                              occupation={this.state.occupation}
                              addTag={this.addOccupationTag}
                              onChange={this.onOccupationChange}
                              onContinue={this.onContinue}
                              onPrevious={this.onPrevious}
                              later={this.onFinish} />
                            : this.state.step === steps.SKILLS
                              ? <Skills
                                fn={this.props.firstName}
                                skills={this.state.skills}
                                addTag={this.addSkillTag}
                                onChange={this.onSkillChange}
                                onContinue={this.onContinue}
                                onPrevious={this.onPrevious}
                                later={this.onFinish} />
                              : this.state.step === steps.PROJECTS
                                ? <Projects
                                  fn={this.props.firstName}
                                  projects={this.state.projects}
                                  onAddChild={this.onProjectAddChild}
                                  onRemoveChild={this.onProjectRemoveChild}
                                  onTextChange={this.onProjectTextChange.bind(this)}
                                  onDescriptionChange={this.onProjectDescriptionChange}
                                  onAddTag={this.onProjectAddTag}
                                  onContinue={this.onContinue}
                                  onPrevious={this.onPrevious}
                                  later={this.onFinish} />
                                : this.state.step === steps.COLLEGUES
                                  ? <Collegues
                                    fn={this.props.firstName}
                                    colleagues={this.state.colleagues}
                                    addTag={this.addColleagueTag}
                                    onChange={this.onColleagueChange}
                                    onContinue={this.onContinue}
                                    onPrevious={this.onPrevious}
                                    later={this.onFinish} />
                                  : this.state.step === steps.THANKS
                                    ? <Thanks
                                      fn={this.props.auth.firstName}
                                      finish={this.onFinish} />
                                    : null
            }
          </ContentContainer>
        </QuestionsContainer>
      </div>
    )
  }
}
export function mapDispatchToProps (dispatch) {
  return {
    setPopupMessage: payload => dispatch(setPopupMessage(payload)),
    cleanPopupMessage: () => dispatch(cleanPopupMessage()),
    push: path => dispatch(push(path)),
    dispatch,
    onBoardFinish: payload => dispatch(onBoardFinish(payload)),
  }
}

const structuredSelector = createStructuredSelector({
  firstname: selectFirstName,
  authError: selectAuthErrorLogin,
  auth: selectAuth,
  onBoardingStarted: selectOnboardingStarted,
  allowedGraphs: selectAllowedGraphs,
})

const OnBoardPage = connect(structuredSelector, mapDispatchToProps)(
  OnBoard
)

export default OnBoardPage
