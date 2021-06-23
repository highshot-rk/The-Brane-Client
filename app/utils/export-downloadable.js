import { clone } from 'lodash-es'

const utf8BOM = '\uFEFF'

export function download (filename, content, type = 'text/csv; charset=utf-18') {
  content = new Blob([utf8BOM + content], { type })
  const url = URL.createObjectURL(content)
  var element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)

  // We need to wait until the file has downloaded before
  // revoking it. 1 Min should be enough time.
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 60 * 1000)
  return 'success'
}

function escapeCSVField (field) {
  // Empty fields can be undefined
  if (typeof field !== 'string') {
    return field
  }

  // CSV escapes double quotes with a second double quotes
  // character
  return `"${field.replace(/"/, '""')}"`
}

export function generateCSV (props, items) {
  const content = []
  content.push(props.map(escapeCSVField).join(','))

  items.forEach(item => {
    let line = props.map(prop => item[prop]).map(escapeCSVField)
    content.push(line.join(','))
  })

  return content.join('\n')
}

export function makeCSV (properties, props) {
  let allContent = []
  allContent.push('ClusterID, ClusterTitle, ' + properties.join(', '))
  for (var i = 0; i < props.length; i++) {
    Object.values(props[i]).forEach((subProp) => {
      subProp.forEach((prop) => {
        const content = []
        prop.data.forEach((item) => {
          let line = properties.map(ele => item[ele])
          content.push(`${prop.clusterId}, ${prop.clusterTitle}, ` + line.join(','))
        })
        allContent.push(content.join('\n'))
      })
    })
  }
  return allContent.join('\n')
}

export function generateJSON (csv) {
  var lines = csv.split('\n')
  var result = []
  var headers = lines[0].split(',')
  for (var i = 1; i < lines.length; i++) {
    var obj = {}
    var currentline = lines[i].split(',')
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j]
    }
    result.push(obj)
  }
  return JSON.stringify(result)
}

export function generateData (focused, children, parents, properties, allProperty) {
  const propertyNames = allProperty
  const collected = [focused, ...Object.values(children), ...parents].map(node => {
    node = clone(node)
    const nodeProperties = properties[node._id]
    if (nodeProperties) {
      nodeProperties.forEach(property => {
        node[property.title] = property.value
        if (!propertyNames.includes(property.title)) {
          propertyNames.push(property.title)
        }
      })
    }
    return node
  })
  return { data: collected, property: propertyNames }
}
