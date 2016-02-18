import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import ajaxAction from './decorators/ajaxAction'
import updateAction from './decorators/updateAction'
import cloneInstance from './utils/cloneInstance'

export default class Model {

  constructor(attributes = {}) {
    this.reset(attributes)
  }

  reset(attributes) {
    this.attributes = attributes
  }

  idAttribute = "id"

  id() {
    return this.attributes[this.idAttribute]
  }

  isNew() {
    return !!this.id()
  }

  url() {
    const urlRoot = _.result(this.urlRoot)
    const id = this.id()
    return id ? `${urlRoot}/${id}` : urlRoot
  }

  @ajaxAction
  sync() {
    const method = this.isNew() ? 'post' : 'put'
    const url = _.result(this.url)
    return fetch(this.url, { method: method }).then(this.parse)
  }

  parse(response) {
    return response.json()
  }

}

function bindLodashFunctions(...names) {
  for (let name of names) {
    Model.prototype[name] = function() {
      return _[name].call(this, this.attributes, ...arguments)
    }
  }
}

bindLodashFunctions("keys", "values", "pairs", "invert", "pick", "omit",
  "chain", "isEmpty", "get", "has")

Model.prototype.clone = cloneInstance
Model.prototype.dispatch = _.noop
