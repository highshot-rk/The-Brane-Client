import React from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'

const AddPublication = ({ showAvanced, onAddPublicationAvanced, onAddPublication }) => showAvanced
  ? (
    <div>
      <p>Avanced</p>
    </div>
  )
  : (
    <e.AddPublicationModal>
      <article onClick={onAddPublication} />
      <section>
        <span>Add Reference </span>
        <input type='text' placeholder='Enter URL' />
        <hr data-content='or' />
        <button > Add Scientific Publication</button>
      </section>
    </e.AddPublicationModal>
  )

AddPublication.propTypes = {
  showAvanced: PropTypes.bool,
  onAddPublicationAvanced: PropTypes.func,
  onAddPublication: PropTypes.func,
}

export default AddPublication
