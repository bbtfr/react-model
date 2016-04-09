import getAjaxConstants from '../utils/getAjaxConstants'

export function ajaxMethodDecorator(ajaxMethod, key) {
  return function() {
    if (this.dispatch) {
      const { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE } =
        getAjaxConstants(this.constructor, key)

      if (this.isModel) {
        const cid = this.cid
        this.dispatch({ type: AJAX_REQUEST, cid })
        return ajaxMethod.apply(this, arguments)
          .then(data => this.dispatch({ type: AJAX_SUCCESS, data, cid }))
          .catch(error => this.dispatch({ type: AJAX_FAILURE, error, cid }))
      } else {
        this.dispatch({ type: AJAX_REQUEST })
        return ajaxMethod.apply(this, arguments)
          .then(data => this.dispatch({ type: AJAX_SUCCESS, data }))
          .catch(error => this.dispatch({ type: AJAX_FAILURE, error }))
      }
    } else {
      return ajaxMethod.apply(this, arguments)
    }
  }
}

export default function ajaxAction(target, key, descriptor) {
  descriptor.value = ajaxMethodDecorator(descriptor.value, key)
  return descriptor
}
