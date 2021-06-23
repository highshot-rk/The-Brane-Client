import std from 'math-standard-deviation'

export function pythagorean (a, b) {
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
}

export function radiansToDegrees (angle) {
  return angle * (180 / Math.PI)
}

export function degreesToRadians (angle) {
  return angle * (Math.PI / 180)
}

/**
 * The angle returned by the Math.atan2 or circlePointFromAngle
 * has 0 radians at the right. The fixed path expects it to be
 * at the top.
 * @param {Number} angle in radians
 */
export function circleTop0 (angle) {
  let result = angle
  if (result < 0) {
    result += Math.PI * 2
  }

  result += Math.PI / 2

  if (result > Math.PI * 2) {
    result = result - Math.PI * 2
  }

  return result
}

/**
 * The fixed path expects 0 radians to be at the top of the circle, while
 * many of the trig functions expects it to be on the right. This undoes
 * the changes from circleTop0.
 * @param {Number} angle in radians
 */
export function circleRight0 (angle) {
  let result = angle

  result -= Math.PI / 2

  if (result > Math.PI) {
    result -= Math.PI * 2
  }

  return result
}

/**
 * Calculates location of point on circle from angle
 * @param {Number} angle in radians
 * @param {Number} radius of the circle
 */
export function circlePointFromAngle (angle, radius) {
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  }
}

/**
 * Finds the number in answers closest to the given number
 * @export
 * @param {Number} number
 * @param {Number[]} answers
 * @returns the answer closest to the number
 */
export function closest (number, answers) {
  return answers.reduce((answer, current) => {
    return Math.abs(current - number) < (Math.abs(answer - number)) ? current : answer
  }, answers[0])
}

/**
 * Moves the number closer to zero
 * @param {Number} number
 * @param {Number} subtract
 */
export function absoluteSubtract (number, subtract) {
  if (number < 0) {
    return number + subtract
  } else {
    return number - subtract
  }
}

export function median (numbers) {
  const sorted = numbers.slice().sort()
  const middleIndex = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2
  }

  return sorted[middleIndex]
}

export function mean (numbers) {
  let total = 0

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i]
  }

  return total / numbers.length
}

export function stdPopulation (numbers) {
  return std.populationStandardDeviation(numbers)
}
