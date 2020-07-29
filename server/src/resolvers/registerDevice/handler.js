/**
 * This file was generated using 8base CLI.
 *
 * To learn more about writing custom GraphQL resolver functions, visit
 * the 8base documentation at:
 *
 * https://docs.8base.com/8base-console/custom-functions/resolvers
 *
 * To update this functions invocation settings, update its configuration block
 * in the projects 8base.yml file:
 *  functions:
 *    registerDevice:
 *      ...
 *
 * Data that is sent to this function can be accessed on the event argument at:
 *  event.data[KEY_NAME]
 *
 * To invoke this function locally, run:
 *  8base invoke-local registerDevice -p src/resolvers/registerDevice/mocks/request.json
 */

import gql from 'graphql-tag'
/**
 * To invoke this function locally, run:
 *  8base invoke-local registerDevice -m request
 */

/* Defauly query options */
const NoCheck = {
  checkPermissions: false
}

/* Query the registration code */
const REGISTRATION_CODE_QUERY = gql`
  query($code: String!) {
    registrationCode(code: $code) {
      id
      code
    }
  }
`

/* Create API Token Mutation */
const CREATE_API_TOKEN_MUTATION = gql`
  mutation($name: String!) {
    apiTokenCreate(
      data: { name: $name, roles: { connect: { name: "Device" } } }
    ) {
      id
      token
    }
  }
`

/* Connect Device with Token and Mark as Registered */
const CREATE_DEVICE_MUTATION = gql`
  mutation($tokenId: ID!, $codeId: ID!, $name: String!) {
    deviceCreate(
      data: {
        name: $name
        apiToken: { connect: { id: $tokenId } }
        registrationCode: { connect: { id: $codeId } }
      }
    ) {
      id
      createdAt
    }
  }
`

export default async (event, ctx) => {
  /* Get registration code */
  const { code } = event.data

  /* Check if token exists and is valid */
  const { registrationCode } = await ctx.api.gqlRequest(
    REGISTRATION_CODE_QUERY,
    { code },
    NoCheck
  )

  /* API token variable */
  let tokenId = ''
  let apiToken = ''

  /* If no token is found */
  if (!registrationCode) {
    return {
      data: {
        apiToken
      },
      errors: [
        {
          message: 'The submitted registration code was not found.',
          code: 'code_not_found'
        }
      ]
    }
  } else {
    /* Code is valid */
    ;({
      apiTokenCreate: { id: tokenId, token: apiToken }
    } = await ctx.api.gqlRequest(
      CREATE_API_TOKEN_MUTATION,
      {
        name: `DEVICE_${code}_TOKEN`
      },
      NoCheck
    ))
  }

  /* Connect the device with the token and set as registered */
  const {
    deviceCreate: { createdAt, id }
  } = await ctx.api.gqlRequest(
    CREATE_DEVICE_MUTATION,
    {
      codeId: registrationCode.id,
      name: `DEVICE_${code}`,
      tokenId
    },
    NoCheck
  )

  /* eslint-disable-next-line no-console */
  console.log(`Token added to device with ID ${id} at ${createdAt}`)

  /* Return response */
  return {
    data: {
      id,
      apiToken
    },
    errors: []
  }
}
