import get from 'lodash/get'
import find from 'lodash/find'
import initialState from '../initialState'

const findStatePiece = (state, name, parentId) => {
  const piece = get(state, name, initialState)
  return piece
}

const fetchMap = type => (type === 'list' ? 'fetchingList' : 'fetchingInfo')

const addToItem = (item, id, attrs) =>
  item && item.id === id ? { ...item, ...attrs } : item

export default {
  createRequest: ({ state, setState }, { name, parentId }) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = { ...piece, creating: true, createError: null }
    setState({ [name]: newState })
  },
  createSuccess: (
    { state, setState },
    { name, parentId },
    data,
    addCreatedToTop,
  ) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = {
      ...piece,
      creating: false,
      createError: null,
      created: data,
      list: addCreatedToTop ? [data, ...piece.list] : [...piece.list, data],
      info: data,
    }
    setState({ [name]: newState })
  },
  createFail: ({ state, setState }, { name, parentId }, error) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = { ...piece, creating: false, createError: error.message }
    setState({ [name]: newState })
  },
  getRequest: ({ state, setState }, { name, operation, parentId }) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = {
      ...piece,
      [fetchMap(operation)]: true,
      [`${operation}Error`]: null,
    }
    setState({ [name]: newState })
  },
  getSuccess: ({ state, setState }, { name, operation, parentId }, data) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = {
      ...piece,
      [fetchMap(operation)]: false,
      [`${operation}Error`]: null,
      [operation]: data,
    }
    setState({ [name]: newState })
  },
  getFail: ({ state, setState }, { name, operation, parentId }, error) => {
    const piece = findStatePiece(state, name, parentId)
    const newState = {
      ...piece,
      [fetchMap(operation)]: false,
      [`${operation}Error`]: error.message,
    }
    setState({ [name]: newState })
  },
  updateRequest: ({ state, setState }, { name, parentId }, id) => {
    const piece = findStatePiece(state, name, parentId)
    const status = { updating: true, updateError: null }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState({ [name]: newState })
  },
  updateSuccess: ({ state, setState }, { name, parentId }, { id, data }) => {
    const piece = findStatePiece(state, name, parentId)
    const status = { updating: false, updateError: null }
    const old = find(piece.list, item => item.id === id)
    const updated = { ...old, ...data, ...status }
    const newState = {
      ...piece,
      ...status,
      updated,
      list: piece.list.map(item =>
        item.id === id ? updated : item,
      ),
      info: updated,
    }
    setState({ [name]: newState })
  },
  updateFail: ({ state, setState }, { name, parentId }, { error, id }) => {
    const piece = findStatePiece(state, name, parentId)
    const status = { updating: false, updateError: error.message }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState({ [name]: newState })
  },
  destroyRequest: ({ state, setState }, { name, parentId }, id) => {
    const piece = findStatePiece(state, name, parentId)
    const status = { destroying: true, destroyError: null }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState({ [name]: newState })
  },
  destroySuccess: ({ state, setState }, { name, parentId }, id) => {
    const piece = findStatePiece(state, name, parentId)
    const destroyed = find(piece.list, item => item.id === id)
    const newState = {
      ...piece,
      destroyed,
      destroying: false,
      list: piece.list.filter(item => item.id !== id),
      info: piece.info && piece.info.id === id ? null : piece.info,
    }
    setState({ [name]: newState })
  },
  destroyFail: ({ state, setState }, { name, parentId }, { error, id }) => {
    const piece = findStatePiece(state, name, parentId)
    const status = { destroying: false, destroyError: error.message }
    const newState = {
      ...piece,
      ...status,
      info: addToItem(piece.info, id, status),
      list: piece.list.map(item => addToItem(item, id, status)),
    }
    setState({ [name]: newState })
  },
}
