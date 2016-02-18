import toUpper from 'lodash/toUpper'

export default function getAjaxConstants(Class, action) {
  const PREFIX = toUpper(Class.name)
  const ACTION = toUpper(action)

  const AJAX_REQUEST = `${PREFIX}_${ACTION}_REQUEST`
  const AJAX_SUCCESS = `${PREFIX}_${ACTION}_SUCCESS`
  const AJAX_FAILURE = `${PREFIX}_${ACTION}_FAILURE`

  return { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE }
}
