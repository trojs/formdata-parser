
/**
 * @typedef {import('./form-data.js').FormData} FormData
 */

/**
 * Parse multipart/form-data
 * @param {string} data
 * @param {string} header
 * @returns {FormData[]}
 */
export default (data, header) => {
  const isMultipart = header.startsWith('multipart/form-data')
  if (!isMultipart) {
    throw new Error('Header is not multipart')
  }
  const boundary = header.split('boundary=')[1]
  const files = data.split(`--${boundary}`)
  return files.map(file => {
    if (file === '' || file === '--\r\n') {
      return undefined
    }
    return {
      fileName: file.split(`filename="`)[1].split(`"\r\n`)[0],
      fileData: file.split(`\r\n\r\n`)[1].split(`\r\n`)[0],
      field: file.split(`name="`)[1].split(`";`)[0],
      contentType: file.split(`Content-Type: `)[1].split(`\r\n`)[0],
      boundary
    }
  }).filter(file => file !== undefined)
}
