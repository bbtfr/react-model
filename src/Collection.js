import lodash from 'lodash'
import fetch from 'isomorphic-fetch'

import Model from './Model'
import ajaxAction from './decorators/ajaxAction'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Collection {

  constructor(models = []) {
    this.model = Model
    this.url = this.model.urlRoot

    if (models instanceof Collection) {
      this.cloneFrom(models)
    } else {
      this.resetWithoutDispatch(models)
    }
  }

  create(model) {
    return model instanceof this.model ? model : new this.model(model)
  }

  @updateAction
  reset(models) {
    this.resetWithoutDispatch(models)
  }

  resetWithoutDispatch(models) {
    this.models = lodash.map(models, model => this.create(model))
  }

  @ajaxAction
  fetch() {
    return fetch(this.url)
      .then(this.parse)
      .then(data => (this.resetWithoutDispatch(data), data))
  }

  parse(response) {
    return response.json()
  }
}

lodash.forEach([
  "forEach", "each", "map", "collect", "reduce", "foldl", "inject",
  "reduceRight", "foldr", "find", "detect", "filter", "select", "reject",
  "every", "all", "some", "any", "contains", "includes", "invoke", "max", "min",
  "sortBy", "groupBy", "shuffle", "toArray", "size", "first", "head", "take",
  "initial", "rest", "tail", "drop", "last", "without", "indexOf",
  "lastIndexOf", "isEmpty", "chain", "difference", "sample", "partition",
  "countBy", "indexBy", "get", "at", "slice"
], function(name) {
  Collection.prototype[name] = function() {
    return lodash[name](this.models, ...arguments)
  }
})

lodash.forEach([
  "concat", "remove", "set"
], function(name) {
  Collection.prototype[name] = updateMethodDecorator(function() {
    return this.resetWithoutDispatch(lodash[name](this.models, ...arguments))
  })
})

lodash.forEach([
  "push", "pop", "unshift", "shift"
], function(name) {
  Collection.prototype[name] = updateMethodDecorator(function() {
    const models = this.models.slice()
    models[name](...arguments)
    return this.resetWithoutDispatch(models)
  })
})

Collection.prototype.clone = cloneInstance
Collection.prototype.cloneFrom = cloneInstanceFrom
Collection.prototype.add = Collection.prototype.concat
Collection.prototype.pluck = Collection.prototype.map
