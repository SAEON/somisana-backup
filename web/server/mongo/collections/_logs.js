export default {
  name: 'logs',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['clientSession', 'type', 'info', 'clientInfo', 'createdAt'],
      additionalProperties: true,
      properties: {
        // Required
        clientSession: {
          bsonType: 'string',
          description: 'Browser session cookie',
        },
        type: {
          enum: ['appRender', 'interaction'],
          description: 'The type of event being logged',
        },
        info: {
          bsonType: 'object',
          description: 'Log information - specific to each type',
        },
        clientInfo: {
          bsonType: 'object',
          properties: {
            ipAddress: {
              description: 'IP address',
            },
            ipAddress: {
              bsonType: 'string',
              description: 'IP address of client user',
            },
            ipInfo: {
              bsonType: 'object',
              description: 'Information about IP address, retrieved from 3rd party service',
            },
          },
        },
        createdAt: {
          bsonType: 'date',
          description: 'Log creation timestamp',
        },

        // Not required (Can't specify types here as the Node.js client throws in that case')
        r: { description: 'Link referrer, passed as a URL parameter (?r=...)' },
        clientVersion: { description: 'Version of the client defined in package.json' },
        userId: { description: 'ID of logged in user' },
      },
    },
  },
  indices: [
    {
      index: 'type',
      options: {
        name: 'logType',
        unique: false,
      },
    },
    {
      index: 'r',
      options: {
        name: 'referrer',
        unique: false,
        sparse: true,
      },
    },
  ],
}
