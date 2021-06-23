import initStoryshots from '@storybook/addon-storyshots'
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer'

const getMatchOptions = ({ context: { kind, story }, url }) => {
  return {
    // The type is actually ratio even though it says percent
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
  }
}

let first = true
const beforeScreenshot = () => {
  if (!first) {
    return Promise.resolve()
  }
  first = false

  // give the first test extra time to load
  return new Promise(resolve =>
    setTimeout(() => {
      resolve()
    }, 10000)
  )
}

jest.setTimeout(1000 * 15)

initStoryshots({ suite: 'Image storyshots',
  test: imageSnapshot({
    storybookUrl: 'http://localhost:50002',
    getMatchOptions,
    beforeScreenshot,
  }),
})
