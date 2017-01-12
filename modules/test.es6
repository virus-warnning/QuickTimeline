const jsonfile = require('jsonfile');
const validate = require('jsonschema').validate;

new Promise((resolve, reject) => {
  jsonfile.readFile('../schemas/timeline.schema.json', (err, schema) => {
    if (err === null) {
      resolve(schema)
    }
  });
}).then((schema) => {
  return new Promise((resolve, rejcet) => {
    jsonfile.readFile('../examples/timeline.tfj', (err, data) => {
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
    for (err of result.errors) {
      console.log(err.property + ' ' + err.message);
    }
  }
});
