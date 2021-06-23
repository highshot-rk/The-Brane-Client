import React from 'react'
import { IconInput } from './elements'
import { validateEmail } from 'utils/formInputs'
import { featureEnabled } from 'utils/features'

export default ({
  attemptedLogin,
  firstName,
  lastName,
  email,
  password,
  passwordConfirmation,
  newsletter,
  onInputChange,
  onCheckChange }) => {
  return (
    <div className='layout-column-width'>
      <form>
        <label htmlFor='firstName' className='layout-column'>
          First name
          <IconInput
            valid={!attemptedLogin || firstName.length > 0}
            onChange={onInputChange}
            value={firstName}
            name='firstName'
            placeholder='First Name' />
        </label>
        <label htmlFor='lastName' className='layout-column'>
          Last name
          <IconInput
            onChange={onInputChange}
            valid={!attemptedLogin || lastName.length > 0}
            value={lastName}
            name='lastName'
            placeholder='Last Name' />
        </label>
        <label htmlFor='email' className='layout-column'>
          Email
          <IconInput
            onChange={onInputChange}
            valid={!attemptedLogin || validateEmail(email)}
            value={email}
            name='email'
            type='email'
            placeholder='Email Address' />
        </label>
        <label htmlFor='password' className='layout-column'>
          Password
          <IconInput
            onChange={onInputChange}
            value={password}
            valid={!attemptedLogin || password.length > 7}
            name='password'
            placeholder='Password'
            type='password' />
        </label>
        <label htmlFor='passwordConfirmation' className='layout-column'>
          Retype password
          <IconInput
            onChange={onInputChange}
            valid={!attemptedLogin || (password.length > 7 && passwordConfirmation === password)}
            value={passwordConfirmation}
            name='passwordConfirmation'
            placeholder='Retype Password'
            type='password' />
        </label>
        {featureEnabled('newsletter') &&
          <label>
            <input
              type='checkbox'
              checked={newsletter}
              onChange={onCheckChange}
              value={newsletter}
            />
            Keep me informed about The Brane's service
          </label>
        }
      </form>
    </div>
  )
}
