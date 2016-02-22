import getAjaxConstants from '../utils/getAjaxConstants'

export function ajaxMethodDecorator(ajaxMethod, key) {
  return function() {
    if (this.dispatch) {
      const { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE } =
      getAjaxConstants(this.constructor, key)

      this.dispatch({ type: AJAX_REQUEST, next: this.clone(), key })
      return ajaxMethod.apply(this, arguments)
        .then(data => this.dispatch({ type: AJAX_SUCCESS, next: this.clone(), key, data }))
        .catch(error => this.dispatch({ type: AJAX_FAILURE, next: this.clone(), key, error }))
    } else {
      return ajaxMethod.apply(this, arguments)
    }
  }
}

export default function ajaxAction(target, key, descriptor) {
  descriptor.value = ajaxMethodDecorator(descriptor.value, key)
  return descriptor
}
