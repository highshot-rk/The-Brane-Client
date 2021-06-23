import React from 'react'

import overlayCloseX from './icons/overlay-close-x.svg'

const ConfidenceOverlay = ({ color, toggleConfidenceInfo }) => {
  return (
    <div className='node-preview-window__confidence-overlay'
      style={{ backgroundColor: color }}
    >
      <img src={overlayCloseX}
        className='node-preview-window__confidence-overlay-close'
        onClick={toggleConfidenceInfo}
      />
      <p className='node-preview-window__confidence-overlay-header'>
        What is The Brane&#8217;s confidence score?
      </p>
      <p className='node-preview-window__confidence-overlay-paragraph'>
        A confidence score reflects the level of trustworthiness
        experts allocate to a given topic. The score is based on the
        following scale:
      </p>
      <ul className='node-preview-window__confidence-overlay-list'>
        <li>5: Scientific fact - consensus</li>
        <li>4: Strong evidence</li>
        <li>3: Some evidence</li>
        <li>2: Plausible - lacks evidence</li>
        <li>1: Not plausible - absolutely no evidence</li>
      </ul>
      <button className='node-preview-window__confidence-overlay-button'>
        Learn more
      </button>
    </div>
  )
}

export default ConfidenceOverlay
