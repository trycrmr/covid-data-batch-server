const config = require('./configs/aws')
const aws = require('aws-sdk')
aws.config.update(config.aws.creds)
const s3 = new aws.S3()

module.exports = data => { 
  s3.putObject(config.aws.s3.getParams(data), function(err, data) {
    if (err) console.error(err, err.stack); // an error occurred
    else     console.info(data);           // successful response 
  })
}