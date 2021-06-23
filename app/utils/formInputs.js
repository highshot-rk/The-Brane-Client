/**
 * Collection of useful functions to validate inputs
 */

const EMAILREGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * Returns true if the email is valid
 * @param {String} email Email string to validate
 */
export const validateEmail = email => EMAILREGEX.test(email)
