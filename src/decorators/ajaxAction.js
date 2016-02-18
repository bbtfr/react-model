import getAjaxConstants from '../utils/getAjaxConstants'

export default function ajaxAction(target, key, descriptor) {
  const ajaxMethod = descriptor.value

  descriptor.value = function() {
    const { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE } =
      getAjaxConstants(this.constructor, key)

    this.dispatch({ type: AJAX_REQUEST })
    return ajaxMethod.apply(this, arguments)
      .then(data => this.dispatch({ type: AJAX_SUCCESS, data }))
      .catch(error => this.dispatch({ type: AJAX_FAILURE, error }))
  }

  return descriptor
}
