import React from 'react'
import * as e from './elements'

const AddPublication = ({ onAddConfidence }) =>
  <e.AddConfidenceModal>
    <article onClick={onAddConfidence} />
    <section>
      <e.ConfidenceCard>
        <h6>Add Confidence Score </h6>
        <e.RangeSlider>
          <input type='range' min='0.01' max='5' defaultValue='0.01' step='0.01' />
          <ul>
            <li><div />1</li>
            <li><div />2</li>
            <li><div />3</li>
            <li><div />4</li>
            <li><div />5</li>
          </ul>
        </e.RangeSlider>
        <button>Moderate</button>
      </e.ConfidenceCard>
      <e.ConfidenceCard>
        <h6>Reasoning:</h6>
        <textarea rows='4' maxLength='500' />
      </e.ConfidenceCard>
      <h6 style={{ marginLeft: '32px' }}>Add Reference </h6>
      <input type='text' placeholder='Enter URL' />
      <hr data-content='or' />
      <button className='btn-confidence'>Manually Add Reference</button>
      <button className='btn-submit'>Submit</button>
    </section>
  </e.AddConfidenceModal>

export default AddPublication
