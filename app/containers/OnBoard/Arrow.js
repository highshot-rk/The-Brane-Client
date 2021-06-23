import React from 'react'

export default function ({ isOpen }) {
  return (
    <svg width='20' height='20' viewBox='0 0 20 20' transform={isOpen ? 'rotate(90)' : 'rotate(-90)'}>
      <path d='M13.891 17.418c0.268 0.272 0.268 0.709 0 0.979s-0.701 0.271-0.969 0l-7.83-7.908c-0.268-0.27-0.268-0.707 0-0.979l7.83-7.908c0.268-0.27 0.701-0.27 0.969 0s0.268 0.709 0 0.979l-7.141 7.419 7.141 7.418z' />
    </svg>
  )
}
