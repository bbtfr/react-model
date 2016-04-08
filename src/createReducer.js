import Collection from './Collection'

import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'
import UniqueID from './utils/UniqueID'

function handleModelUpdate(collection, model) {
  collection = collection.clone()
  collection.setWithoutDispatch(model.__collectionID, model)
  return collection
}

function handleCollectionUpdate(collection, models) {
  if (models instanceof Collection) {
    return models
  } else {
    collection = collection.clone()
    collection.resetWithoutDispatch(models)
    return collection
  }
}

function handleAjaxAction(state, action, CONSTANTS) {
  const { type, data, error } = action
  let next

  switch (type) {
    case CONSTANTS.AJAX_REQUEST:
      next = state.clone()
      next.loadingState = `${CONSTANTS.action}Request`
      delete next.loadingError
      return next

    case CONSTANTS.AJAX_SUCCESS:
      next = handleCollectionUpdate(state, data)
      next.loadingState = `${CONSTANTS.action}Success`
      return next

    case CONSTANTS.AJAX_FAILURE:
      next = state.clone()
      next.loadingState = `${CONSTANTS.action}Failure`
      next.loadingError = error
      return next
  }
}

export default function createReducer(Collection) {
  const initialState = new Collection()
  const Model = initialState.model
  const reducerID = initialState.__reducerID = new UniqueID()

  const COLLECTION_FETCH = getAjaxConstants(Collection, "fetch")
  const COLLECTION_UPDATE = getUpdateConstant(Collection)
  const MODEL_FETCH = getAjaxConstants(Model, "fetch")
  const MODEL_SYNC = getAjaxConstants(Model, "sync")
  const MODEL_UPDATE = getUpdateConstant(Model)

  return function(state = initialState, action) {
    const { type, data } = action

    if (state && state.__reducerID !== reducerID) return state

    switch (type) {
      case 'INIT_DISPATCH':
        state.__dispatch = action.dispatch
        return state

      case COLLECTION_UPDATE:
        return handleCollectionUpdate(state, data)

      case MODEL_UPDATE:
        return handleModelUpdate(state, data)

      default:
        let next

        // Collection fetch
        next = handleAjaxAction(state, action, COLLECTION_FETCH)
        if (next) return next

        // Model fetch
        next = handleAjaxAction(state, action, MODEL_FETCH) ||
          handleAjaxAction(state, action, MODEL_SYNC)
        if (next) return handleModelUpdate(state, next)
    }

    return state
  }
}
