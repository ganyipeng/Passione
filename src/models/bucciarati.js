export default {
    namespace: 'bucciarati',
    state: {
        template: {
            document: {
              nodes: [
                {
                  object: 'block',
                  type: 'paragraph',
                  nodes: [
                    {
                      object: 'text',
                      text: '',
                    },
                  ],
                },
              ],
            },
          },
        schema: {
            type: 'object',
            title: 'empty object',
            properties: {},
        }
    },
    reducers: {
        updateTemplate(state,{payload}){
            return {
                ...state,
                template: payload
            }
        },
        updateData(state,{payload}){
            return {
                ...state,
                data: payload
            }
        },
        updateSchema(state,{payload}){
            return {
                ...state,
                schema: payload
            }
        }
    }
}