import getAjaxConstants from '../utils/getAjaxConstants'

export function ajaxMethodDecorator(ajaxMethod, key) {
  return function() {
    const { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE } =
      getAjaxConstants(this.constructor, key)

    this.__dispatch({ type: AJAX_REQUEST })
    return ajaxMethod.apply(this, arguments)
      .then(data => this.__dispatch({ type: AJAX_SUCCESS, data }))
      .catch(error => this.__dispatch({ type: AJAX_FAILURE, error }))
  }
}

export default function ajaxAction(target, key, descriptor) {
  descriptor.value = ajaxMethodDecorator(descriptor.value, key)
  return descriptor
}
