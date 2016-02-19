import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'

export default function createReducer(Collection) {
  const initialState = new Collection()

  const COLLECTION_FETCH = getAjaxConstants(Collection, "fetch")
  const COLLECTION_UPDATE = getUpdateConstant(Collection)
  const MODEL_UPDATE = getUpdateConstant(initialState.model)

  return function(state = initialState, action) {
    const { type, next, data, error } = action

    switch (type) {
      case 'INIT_DISPATCH':
        state.dispatch = action.dispatch
        return state

      case COLLECTION_FETCH.AJAX_REQUEST:
        next.loading = true
        delete next.error
        return next

      case COLLECTION_FETCH.AJAX_SUCCESS:
        next.resetWithoutDispatch(data)
        next.loading = false
        return next

      case COLLECTION_FETCH.AJAX_FAILURE:
        next.loading = false
        next.error = error
        return next

      case COLLECTION_UPDATE:
        return next

      case MODEL_UPDATE:
        if (state.has(next.cid)) {
          let nextState = state.clone()
          nextState.setWithoutDispatch(next.cid, next)
          return nextState
        } else {
          return state
        }

      default:
        return state
    }
  }
}
