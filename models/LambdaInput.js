const AWS = require('aws-sdk');

const invoke = async (funcName, payload) => {
    const client = new AWS.Lambda({ 
        region: 'ap-south-1',
        apiVersion: '2015-03-31'
     });
     let params = {
        FunctionName : funcName,
        InvocationType : 'RequestResponse',
        LogType : 'Tail',
        Payload : JSON.stringify(payload)
      };
    const request = client.invoke(params);
    const value = await request.promise();

    console.log("Lambda Invoke: ", value);

    if (value.FunctionError) {
        return null;
    }

    return JSON.parse(value.Payload).body;
};

module.exports = invoke;