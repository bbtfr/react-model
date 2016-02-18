import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'

export default function createReducer(Collection) {
  const initialState = new Collection()

  const COLLECTION_FETCH = getAjaxConstants(Collection, "fetch")
  const COLLECTION_UPDATE = getUpdateConstant(Collection)

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
        next.loading = false
        return next

      case COLLECTION_FETCH.AJAX_FAILURE:
        next.loading = false
        next.error = error
        return next

      case COLLECTION_UPDATE:
        return next

      default:
        return state
    }
  }
}
