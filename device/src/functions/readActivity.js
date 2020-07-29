const gql = require('graphql-tag')

const api = require('../utils/api')
const storage = require('../storage')

/* GraphQL queries */
const READ_DATA_ENTRIES = gql`
  query {
    dataEntriesList {
      items {
        createdAt
        value
      }
    }
  }
`
module.exports = () => {
  /* Run the mutation */
  return api
    .query({
      query: READ_DATA_ENTRIES
    })
    .then(
      ({
        data: {
          dataEntriesList: { items }
        }
      }) => {
        return items
      }
    )
    .catch(error => {
      console.log(error.graphQLErrors)
    })
}
