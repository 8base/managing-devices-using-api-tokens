import gql from 'graphql-tag'
/**
 * To invoke this function locally, run:
 *  8base invoke-local registerDevice -m request
 */

/* Disable permissions when making server-side API calls */
const NoCheck = {
  checkPermissions: false
}

/**
 * Query for the registration code.
 */
const REGISTRATION_CODE_QUERY = gql`
  query($code: String!) {
    registrationCode(code: $code) {
      id
      code
      device {
        id
      }
    }
  }
`

/**
 * Create the API Token Mutation. When creating the api token
 * we also go ahead and connect our Device role to it.
 */
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

/**
 * Create the device Device and connect it with the
 * token and registration code.
 */
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
  /* Get registration code from mutation args */
  const { code } = event.data

  /* Query the code to see if it actually exists */
  const { registrationCode } = await ctx.api.gqlRequest(
    REGISTRATION_CODE_QUERY,
    { code },
    NoCheck
  )

  /* Variable */
  let tokenId = ''
  let apiToken = ''

  /* If no code is found, return not found error */
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
    /* If code is already assigned to device, return code assigned error */
  } else if (registrationCode.device) {
    return {
      data: {
        apiToken
      },
      errors: [
        {
          message: 'The submitted registration code was already used.',
          code: 'code_assigned'
        }
      ]
    }
    /* If the code is valid, create a new API Token */
  } else {
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
  /**
   * Create a new device and connext it to
   * the API Token and Registration code.
   */
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
  /**
   * Return device id and apiToken in response
   */
  return {
    data: {
      id,
      apiToken
    },
    errors: []
  }
}
