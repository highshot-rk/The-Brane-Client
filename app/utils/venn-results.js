function checkNextQueryInParens (currentIndex, queryOperators) {
  const currentType = queryOperators[currentIndex].type
  let queriesToCheck = currentType === null ? 3 : 2
  let maxIndex = Math.min(queryOperators.length, currentIndex + queriesToCheck)

  for (let i = currentIndex; i < maxIndex; i++) {
    let operator = queryOperators[i].type

    if (operator === 'open-parenthesis') {
      return true
    }
  }
}

// TODO: handle multiple depths when locating end-parenthesis
function findOperator (currentIndex, queryOperators, operator) {
  for (let i = 0; i < queryOperators.length; i++) {
    if (queryOperators[i].type === operator) {
      return i
    }
  }

  return queryOperators.length
}

function createInput (...args) {
  return args.map(arg => {
    if (typeof arg === 'string') {
      return {
        type: 'id',
        value: arg,
      }
    } else {
      return {
        type: 'result',
        value: arg,
      }
    }
  })
}

function parseLevel (queryOperators, startResultId) {
  console.log('handling level', queryOperators)
  let steps = []
  let resultId = startResultId + 1

  // Creates list of steps to follow to get the end result
  for (let i = 0; i < queryOperators.length; i++) {
    let operator = queryOperators[i].type
    let nextOperator = queryOperators[i + 1] && queryOperators[i + 1].type
    let nextQueryInParens = checkNextQueryInParens(i, queryOperators)

    if (operator === null && !nextQueryInParens) {
      steps.push({
        operation: nextOperator,
        input: createInput(queryOperators[i].id, queryOperators[i + 1].id),
        result: resultId++,
      })
      i += 1
      continue
    }

    if (nextQueryInParens) {
      let endIndex = findOperator(i, queryOperators, 'close-parenthesis')
      let nextLevelOperators = queryOperators.slice(i, endIndex)

      if (endIndex === queryOperators.length) {
        queryOperators.push({ id: null, type: 'close-parenthesis' })
      }

      nextLevelOperators[0].type = null
      nextLevelOperators.splice(1, 1)

      steps.push(parseLevel(nextLevelOperators, resultId++))
      i = endIndex
      if (operator !== null) {
        steps.push({
          operation: operator,
          input: createInput(resultId - 2, queryOperators[i].id === null ? queryOperators[i].id : resultId - 1),
          result: resultId + endIndex,
        })
      }
      resultId += endIndex + 1
      continue
    }

    steps.push({
      operation: operator,
      input: createInput(resultId - 1, queryOperators[i].id),
    })
  }

  return {
    operation: 'level',
    input: steps,
    result: startResultId,
  }
}

export function allInputIds (input) {
  return input.filter(info => info.type === 'id').length === input.length
}

async function fillInput (input, operator, results, getRelatives) {
  if (operator === 'level') {
    return input
  }

  const allIds = allInputIds(input)

  return Promise.all(input.map(async info => {
    if (allIds && operator === 'intersection') {
      return info
    } else if (info.type === 'id') {
      return {
        ...info,
        type: 'result',
        value: await getRelatives(info.value),
      }
    }

    return {
      ...info,
      value: results[info.value],
    }
  })
  )
}

async function handleStep (step, input, handleOperator, getRelatives) {
  switch (step.operation) {
    case 'level':
      return runStepList(input, handleOperator, getRelatives)
    default:
      let result = handleOperator(step.operation, input)
      if (!result) {
        console.log('unknown step operation', step)
      }
      return result
  }
}

async function runStepList (list, handleOperator, getRelatives) {
  let results = {}

  for (let i = 0; i < list.length; i++) {
    let step = list[i]
    console.log('filing input')
    const input = await fillInput(step.input, step.operation, results, getRelatives)
    console.log('running step', step.operation, input)
    const result = await handleStep(step, input, handleOperator, getRelatives)
    console.log('finished step', step.operation, result)
    results[step.result] = result
  }

  return results[list[list.length - 1].result]
}

/**
 * Takes an array of queries from search and returns final results
 *
 * @param {Function} handleStep Takes data from fillInput and executes the operator
 * @param {Function} fillInput Retrieves relatives of a node
 */
export async function vennResults (queryOperators, handleOperator, fillInput) {
  queryOperators = queryOperators.slice().map(query => {
    query.id = query.id === null ? null : query.id.split('/')[1]

    return query
  })

  const stepList = [parseLevel(queryOperators, 0)]

  return runStepList(stepList, handleOperator, fillInput)
}
