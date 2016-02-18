import lodash from 'lodash'
import fetch from 'isomorphic-fetch'

import ajaxAction from './decorators/ajaxAction'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Model {

  constructor(attributes = {}) {
    this.reset(attributes)
  }

  reset(attributes) {
    this.attributes = attributes
  }

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
    const url = lodash.result(this.url)
    return fetch(this.url, { method: method }).then(this.parse)
  }

  parse(response) {
    return response.json()
  }

}


lodash.forEach([
  "keys", "values", "pairs", "invert", "pick", "omit", "chain", "isEmpty",
  "get", "has"
], function(name) {
  Model.prototype[name] = function() {
    return lodash[name](this.attributes, ...arguments)
  }
})

Model.prototype.clone = cloneInstance
Model.prototype.cloneFrom = cloneInstanceFrom
Model.prototype.idAttribute = "id"
