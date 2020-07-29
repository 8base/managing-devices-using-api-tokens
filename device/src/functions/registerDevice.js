const gql = require('graphql-tag')

const api = require('../utils/api')
const storage = require('../storage')

/* GraphQL Mutation */
const REGISTER_DEVICE = gql`
  mutation($code: String!) {
    registerDevice(code: $code) {
      id
      apiToken
    }
  }
`

module.exports = code => {
  /* Run the mutation */
  return api
    .mutate({
      mutation: REGISTER_DEVICE,
      variables: { code }
    })
    .then(
      ({
        data: {
          registerDevice: { id, apiToken }
        }
      }) => {
        storage.set({ id, apiToken })

        return 'Device registered'
      }
    )
    .catch(error => {
      console.log(error.graphQLErrors)
    })
}
