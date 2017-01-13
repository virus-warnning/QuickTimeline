/**
 * JSON Schema 1.0 test script.
 *
 * - run: babel-node test.js
 * - preset: es2015
 */

import jsonfile from 'jsonfile';
import { validate } from 'jsonschema';

const WTF = 'timeline';
const PATH = '..';
const SCHEMA_FILE = PATH + '/schemas/' + WTF + '.schema.json';
const DATA_FILE = PATH + '/examples/' + WTF + '.tfj';

new Promise((resolve, reject) => {
  jsonfile.readFile(SCHEMA_FILE, (err, schema) => {
    if (err === null) {
      resolve(schema)
    }
  });
}).then((schema) => {
  return new Promise((resolve, rejcet) => {
    jsonfile.readFile(DATA_FILE, (err, data) => {
      if (err === null) {
        resolve({
          data: data,
          schema: schema
        });
      }
    });
  });
}).then((dest) => {
  const data = dest.data;
  const schema = dest.schema;
  const result = validate(data, schema);

  if (result.errors.length == 0) {
    console.log('Passed!');
  } else {
    for (const err of result.errors) {
      console.log(err.property + ' ' + err.message);
    }
  }
});
