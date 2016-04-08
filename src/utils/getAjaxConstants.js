import toUpper from 'lodash/toUpper'
import snakeCase from 'lodash/snakeCase'

export default function getAjaxConstants(Class, action) {
  const PREFIX = toUpper(snakeCase(Class.name))
  const ACTION = toUpper(snakeCase(action))

  const AJAX_REQUEST = `${PREFIX}_${ACTION}_REQUEST`
  const AJAX_SUCCESS = `${PREFIX}_${ACTION}_SUCCESS`
  const AJAX_FAILURE = `${PREFIX}_${ACTION}_FAILURE`

  return { AJAX_REQUEST, AJAX_SUCCESS, AJAX_FAILURE, action }
}
