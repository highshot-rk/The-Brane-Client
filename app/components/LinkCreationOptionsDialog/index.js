import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { getLink } from 'api/link'
import { HiddenLink, SectionTitle } from 'elements/form'
import Dialog from '../Dialog'

class LinkCreationOptionsDialog extends Component {
  state = {
    predicateAB: 'is related to',
    loading: true,
  }
  componentWillMount = () => {
    const { draggedChild } = this.props
    getLink(draggedChild.parentId, draggedChild._id).then(({ data }) => {
      if (data.u) {
        return this.setState({ predicateAB: data.u, loading: false })
      }
      return this.setState({ loading: false })
    })
  }

  render () {
    /**
     * This component is rendered when you move a Child A
     * from Parent B to a node C present on the path.
     */
    const { draggedChild, target, nodes } = this.props
    const parent = nodes[draggedChild.parentId]
    const nodeA = draggedChild.name || draggedChild.title
    const nodeB = parent.title || parent.name
    const nodeC = target.title || target.name
    const base = `Create a link between ${nodeA} and ${nodeC}`
    return (
      <div>
        {this.state.loading ? <p>loading...</p>
          : <Dialog
            text={<SectionTitle>What do you want to do?</SectionTitle>}
            onClick={this.props.onSelectOption}
            buttons={[{
              text: 'Cancel',
              style: 'normal',
              negative: true,
            }]}
            children={
              <div>
                <HiddenLink spacious onClick={() => this.props.onSelectOption(1)}>{`${base}`}</HiddenLink>
                <HiddenLink spacious onClick={() => this.props.onSelectOption(2)}>{`${base} and delete link [${nodeA} ${this.state.predicateAB} ${nodeB}]`}</HiddenLink>
              </div>
            }
          />
        }
      </div>
    )
  }
}

export default LinkCreationOptionsDialog

LinkCreationOptionsDialog.propTypes = {
  draggedChild: PropTypes.object,
  target: PropTypes.object,
  nodes: PropTypes.object,
  onSelectOption: PropTypes.func,
}
