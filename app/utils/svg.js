import { select, selectAll } from 'd3-selection'
import LRU from 'lru-cache'
import createHyphenator from 'hyphen'
import enGbHyphenationPatterns from './en-gb-hyphenations'
import { waitUntilIdle } from './scheduling'

const HYPHEN_CHAR = '\\u00AD'
const hyphenate = createHyphenator(enGbHyphenationPatterns, { hyphenChar: HYPHEN_CHAR })
const wrapCache = new LRU({
  max: 1000,
})

export function calculateTextWidth (text, fontSize) {
  let textEl = select('body')
    .append('svg')
    .attr('id', 'word-wrap')
    .append('text')
    .attr('font-size', `${fontSize}px`)
    .attr('class', 'text-calculator')
  textEl.text(text)

  const width = textEl.node().getComputedTextLength()
  selectAll('#word-wrap').remove()

  return width
}

const randomId = () => {
  return `word-wrap-${Math.floor(Math.random() * 1000000)}`
}

export function wrapText (text, fontSize, width) {
  let lines = []
  let line = []
  let words
  let textEl
  const key = `${text}-${fontSize}-${width}`
  const id = randomId()

  if (wrapCache.has(key)) {
    return wrapCache.get(key)
  }

  // split at spaces
  words = text.split(/\s+/)

  textEl = select('body')
    .append('svg')
    .attr('id', id)
    .attr('style', 'position: absolute; z-index: -1000; opacity: 0; pointer-events: none;')
    .append('text')
    .attr('font-size', `${fontSize}px`)
    .attr('class', 'text-calculator')

  function tryHyphenateLastWord (word) {
    const hyphenated = hyphenate(word).split(HYPHEN_CHAR)
    const result = []

    for (let i = 0; i < hyphenated.length; i++) {
      let wordSection = `${hyphenated.slice(0, i + 1).join('')}-`
      textEl.text([...line, wordSection].join(' '))

      let lineWidth = textEl.node().getComputedTextLength()

      if (lineWidth > width) {
        break
      } else {
        result.push(hyphenated[i])
      }
    }

    return {
      thisLine: result.length > 0 ? `${result.join('')}-` : '',
      nextLine: hyphenated.slice(result.length).join(''),
    }
  }

  for (let i = 0; i < words.length; i++) {
    let word = words[i]

    line.push(word)
    textEl.text(line.join(' '))

    let lineWidth = textEl.node().getComputedTextLength()
    if (lineWidth > width) {
      let nextLine = []

      if (line.length === 1) {
        let hyphenatedResult = tryHyphenateLastWord(line.pop())

        if (hyphenatedResult.thisLine.length > 0) {
          line.push(hyphenatedResult.thisLine)
          nextLine.push(hyphenatedResult.nextLine)
        } else {
          // There is only one word, it is too long, and hyphenating it did not help. Truncate it.
          let overflowProportion = width / lineWidth
          let charIndex = word.length * overflowProportion
          word = word.slice(0, charIndex - 3)
          word += '...'
          line = [word]
        }
      } else {
        nextLine = [line.pop()]
        if (i === words.length - 1 && words[i] === nextLine[0]) {
          // Normally, the loop would run again and process this word.
          // But in this case, we already tried the last word, but
          // it didn't get truncated or hyphenated
          i -= 1

          // We don't want the word to appear twice
          nextLine = []
        }
      }

      lines.push(line.join(' '))
      line = nextLine
    }
  }
  if (line.length > 0) {
    lines.push(line.join(' '))
  }

  waitUntilIdle(() => {
    selectAll(id).remove()
  })

  wrapCache.set(key, lines)

  return lines
}
