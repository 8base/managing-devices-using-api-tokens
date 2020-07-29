const gql = require('graphql-tag')

const api = require('../utils/api')
const storage = require('../storage')

/* GraphQL Mutation */
const CREATE_DATA_ENTRY = gql`
  mutation($id: ID!, $val: Int!) {
    deviceUpdate(data: { id: $id, dataEntries: { create: { value: $val } } }) {
      id
    }
  }
`

module.exports = input => {
  /* Get the device ID */
  const id = storage.get('id')
  const val = parseInt(input)

  /* Run the mutation */
  return api
    .mutate({
      mutation: CREATE_DATA_ENTRY,
      variables: { id, val }
    })
    .then(
      ({
        data: {
          deviceUpdate: { id }
        }
      }) => {
        return `Entry ${val} saved to device ${id}`
      }
    )
    .catch(error => {
      console.error(error)
    })
}
