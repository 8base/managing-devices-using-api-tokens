/* Apollo Client dependencies */
const fetch = require('node-fetch')
const { ApolloClient } = require('apollo-client')
const { setContext } = require('apollo-link-context')
const { createHttpLink } = require('apollo-link-http')
const { InMemoryCache } = require('apollo-cache-inmemory')

/* Import storage module */
const storage = require('../storage')

const httpLink = createHttpLink({
  uri: '<EIGHTBASE_WORKSPACE_API_ENDPOINT>',
  fetch
})

/* Client cache */
const cache = new InMemoryCache()

/* Set the api token in the auth header */
const authLink = setContext((_, { headers }) => {
  const apiToken = storage.get('apiToken')

  if (apiToken) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${apiToken}`
      }
    }
  }

  return { headers }
})

module.exports = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})
