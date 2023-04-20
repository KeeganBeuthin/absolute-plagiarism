import {OpenAPIBackend} from 'openapi-backend';;
import express from 'express';
const app = express();
app.use(express.json());
// define api
const api = new OpenAPIBackend({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    paths: {
      '/transactions': {
        get: {
          operationId: 'getTransactions',
          responses: {
            200: { description: 'ok' },
          },
        },
      },
      '/transactions/{id}': {
        get: {
          operationId: 'getTransactionById',
          responses: {
            200: { description: 'ok' },
          },

        },
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
      },
    },
  },
  handlers: {
    getTransactions: async (c, req, res) => res.status(200).json({ operationId: c.operation.operationId }),
    getTransactionById: async (c, req, res) => {
      const transactions = [{id: 789465}, {id: 122356}, {id: 556753}, {id: 556753}, {id: 909657}, {id: 888234}, {id: 768999}, {id: 467124}];
      const transactionId = c.request.params.id;
      const transactionIdName = transactions[transactionId - 1]?.id;
    
      if (!transactions) {
        return res.status(404).json({ error: 'Transaction Not Found' });
      }
    
      const responseData = {
        operationId: c.operation.operationId,
        transaction: transactionIdName
      };
      
      return res.status(200).json(responseData);
    } ,
    validationFail: async (c, req, res) => res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req, res) => res.status(404).json({ err: 'not found' }),

  },
});


api.init();

// use as express middleware
app.use((req, res) => api.handleRequest(req, req, res));

// start server
app.listen(9000, () => console.info('api listening at http://localhost:9000'));
