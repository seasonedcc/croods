import get from 'lodash/get'

const KEY = 'authCredentials'

export const saveHeaders = (response, storage, key = KEY) => {
  const credentials = {
    accessToken: get(response, 'headers.access-token'),
    client: get(response, 'headers.client'),
    expiry: get(response, 'headers.expiry'),
    tokenType: get(response, 'headers.token-type'),
    uid: get(response, 'headers.uid'),
  }

  if (credentials.accessToken) {
    storage.setItem(key, JSON.stringify(credentials))
  }
}

export const getHeaders = async (storage, key = KEY) => {
  try {
    const credentials = await JSON.parse(storage.getItem(key))

    return {
      'Access-Token': credentials.accessToken,
      Client: credentials.client,
      Expiry: credentials.expiry,
      'Token-Type': credentials.tokenType,
      Uid: credentials.uid,
    }
  } catch (error) {
    return {}
  }
}
