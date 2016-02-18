import toUpper from 'lodash/toUpper'

import getAjaxConstants from './utils/getAjaxConstants'
import getUpdateConstant from './utils/getUpdateConstant'

export default function createReducer(Collection) {
  const initialState = new Collection()

  const { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE } =
    getAjaxConstants(Collection, "fetch")
  const UPDATE = getUpdateConstant(Collection)

  return function(state = initialState, action) {
    const { type, data, error } = action

    switch (type) {
      case 'INIT_DISPATCH':
        state.dispatch = action.dispatch
        return state

      case AJAX_REQUEST:
        state.loading = true
        state.error = undefined
        return state.clone()

      case AJAX_SUCCESS:
        state.loading = false
        state.resetWithoutDispatch(data)
        return state.clone()

      case AJAX_FAILURE:
        state.loading = false
        state.error = error
        return state.clone()

      case UPDATE:
        return data

      default:
        return state
    }
  }
}
