import api from './'

export function addPublication ({
  type,
  title,
  date,
  DOI,
  files,
  authors,
  nodes,
}) {
  return api.post('publications', {
    type,
    title,
    date,
    DOI,
    files,
    authors,
    nodes,
  })
}
