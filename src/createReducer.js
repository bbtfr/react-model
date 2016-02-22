import _ from 'lodash'

import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'

function handleModelUpdate(model, collection) {
  collection = collection.clone()
  collection.setWithoutDispatch(model.cid, model)
  return collection
}

function handleAjaxAction(CONSTANTS, action) {
  const { type, key, next, data, error } = action

  switch (type) {
    case CONSTANTS.AJAX_REQUEST:
      next.loadingState = `${key}Request`
      delete next.loadingError
      return next

    case CONSTANTS.AJAX_SUCCESS:
      next.loadingState = `${key}Success`
      next.resetWithoutDispatch(data)
      return next

    case CONSTANTS.AJAX_FAILURE:
      next.loadingState = `${key}Failure`
      next.loadingError = error
      return next
  }
}

export default function createReducer(Collection) {
  const initialState = new Collection()
  const Model = initialState.model
  const rid = initialState.rid = _.uniqueId('r')

  const COLLECTION_FETCH = getAjaxConstants(Collection, "fetch")
  const COLLECTION_UPDATE = getUpdateConstant(Collection)
  const MODEL_FETCH = getAjaxConstants(Model, "fetch")
  const MODEL_SYNC = getAjaxConstants(Model, "sync")
  const MODEL_UPDATE = getUpdateConstant(Model)

  return function(state = initialState, action) {
    const { type, next } = action

    if (next && next.rid !== rid) return state

    switch (type) {
      case 'INIT_DISPATCH':
        state.dispatch = action.dispatch
        return state

      case COLLECTION_UPDATE:
        return next

      case MODEL_UPDATE:
        return handleModelUpdate(next, state)

      default:
        let nextState

        // Collection fetch
        nextState = handleAjaxAction(COLLECTION_FETCH, action)
        if (nextState) return nextState

        // Model fetch
        nextState = handleAjaxAction(MODEL_FETCH, action) ||
          handleAjaxAction(MODEL_SYNC, action)
        if (nextState) return handleModelUpdate(nextState, state)
    }

    return state
  }
}
