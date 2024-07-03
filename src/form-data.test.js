import assert from 'node:assert'
import test from 'node:test'
import parseFormData from './form-data.js'
const example = {
  body: '-----------------------------12946965154256166883262710838\r\n' +
    'Content-Disposition: form-data; name="fileName"; filename="test.txt"\r\n' +
    'Content-Type: text/plain\r\n' +
    '\r\n' +
    '42\n' +
    '\r\n' +
    '-----------------------------12946965154256166883262710838\r\n' +
    'Content-Disposition: form-data; name="fileName2"; filename="test.xml"\r\n' +
    'Content-Type: text/xml\r\n' +
    '\r\n' +
    '43\n' +
    '\r\n' +
    '-----------------------------12946965154256166883262710838--\r\n',
  type: 'multipart/form-data; boundary=---------------------------12946965154256166883262710838'
}

test('Test the form data helper', async (t) => {

  await t.test('It should catch wrong data', async () => {

    assert.throws(
      () => {
        parseFormData( example.body, 'wrong type')
      },
      'Error: Header is not multipart',
    );

  })
  await t.test('It should catch wrong data', async () => {

    assert.throws(
      () => {
        parseFormData( 'wrong data', example.type)
      },
      'Error: Wrong value',
    );
  })

  await t.test('It should get the data from the body', async () => {
    const response = parseFormData(example.body, example.type)

    assert.deepEqual(
      response[0].fileData,
      '42\n'
    )
    assert.deepEqual(
      response[0].fileName,
      'test.txt'
    )
    assert.deepEqual(
      response[0].boundary,
      '---------------------------12946965154256166883262710838'
    )
    assert.deepEqual(
      response[0].field,
      'fileName'
    )
    assert.deepEqual(
      response[0].contentType,
      'text/plain'
    )

    assert.deepEqual(
      response[1].fileData,
      '43\n'
    )
    assert.deepEqual(
      response[1].fileName,
      'test.xml'
    )
    assert.deepEqual(
      response[1].boundary,
      '---------------------------12946965154256166883262710838'
    )
    assert.deepEqual(
      response[1].field,
      'fileName2'
    )
    assert.deepEqual(
      response[1].contentType,
      'text/xml'
    )
  })
})
