import _ from 'lodash'

import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'

function ajaxConstantsInclude(CONSTANTS, type) {
  return CONSTANTS.AJAX_REQUEST === type ||
    CONSTANTS.AJAX_SUCCESS === type ||
    CONSTANTS.AJAX_FAILURE === type
}

function handleModelUpdate(collection, cid, model) {
  if (collection.has(cid)) {
    collection = collection.clone()
    collection.setWithoutDispatch(model.cid, model)
    return collection
  } else {
    return collection
  }
}

function handleAjaxAction(state, action, CONSTANTS) {
  const { type, data, error, cid } = action
  const next = state.clone()

  switch (type) {
    case CONSTANTS.AJAX_REQUEST:
      next.loadingState = `${CONSTANTS.action}Request`
      delete next.loadingError
      return next

    case CONSTANTS.AJAX_SUCCESS:
      next.loadingState = `${CONSTANTS.action}Success`
      next.resetWithoutDispatch(data)
      return next

    case CONSTANTS.AJAX_FAILURE:
      next.loadingState = `${CONSTANTS.action}Failure`
      next.loadingError = error
      return next
  }
}

function handleModelAjaxAction(state, action, cid, CONSTANTS) {
  const next = state.get(cid)
  if (next) {
    return handleModelUpdate(state, cid,
      handleAjaxAction(next, action, CONSTANTS))
  }
}

export default function createReducer(Collection) {
  const initialState = new Collection()
  const Model = Collection.Model

  const COLLECTION_FETCH = getAjaxConstants(Collection, "fetch")
  const COLLECTION_UPDATE = getUpdateConstant(Collection)
  const MODEL_FETCH = getAjaxConstants(Model, "fetch")
  const MODEL_SYNC = getAjaxConstants(Model, "sync")
  const MODEL_UPDATE = getUpdateConstant(Model)

  return function(state = initialState, action) {
    const { type, next, cid } = action

    switch (type) {
      case 'INIT_DISPATCH':
        const { dispatch } = action
        state.dispatch = dispatch
        state.modelDispatch = function(action) {
          return dispatch({ ...action, cid: this.cid })
        }
        return state

      case COLLECTION_UPDATE:
        return next

      case MODEL_UPDATE:
        return handleModelUpdate(state, cid, next)

      default:

        if (ajaxConstantsInclude(COLLECTION_FETCH, type)) {
          return handleAjaxAction(state, action, COLLECTION_FETCH)
        }

        if (ajaxConstantsInclude(MODEL_FETCH, type)) {
          return handleModelAjaxAction(state, action, cid, MODEL_FETCH) || state
        }

        if (ajaxConstantsInclude(MODEL_SYNC, type)) {
          return handleModelAjaxAction(state, action, cid, MODEL_SYNC) || state
        }

    }

    return state
  }
}
