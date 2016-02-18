import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import Model from './Model'
import ajaxAction from './decorators/ajaxAction'
import updateAction from './decorators/updateAction'
import cloneInstance from './utils/cloneInstance'

export default class Collection {

  constructor(models = []) {
    this.resetWithoutDispatch(models)
    this.model = Model
    this.url = this.model.urlRoot
  }

  create(model) {
    return model instanceof this.model ? model : new this.model(model)
  }

  @updateAction
  reset(models) {
    this.resetWithoutDispatch(models)
  }

  resetWithoutDispatch(models) {
    this.models = _.map(models, model => this.create(model))
  }

  @ajaxAction
  fetch() {
    return fetch(this.url)
      .then(this.parse)
  }

  parse(response) {
    return response.json()
  }
}

function bindLodashFunctions(...names) {
  for (let name of names) {
    Collection.prototype[name] = function() {
      return _[name].call(this, this.models, ...arguments)
    }
  }
}

bindLodashFunctions("forEach", "each", "map", "collect", "reduce", "foldl",
  "inject", "reduceRight", "foldr", "find", "detect", "filter", "select",
  "reject", "every", "all", "some", "any", "contains", "includes", "invoke",
  "max", "min", "sortBy", "groupBy", "shuffle", "toArray", "size", "first",
  "head", "take", "initial", "rest", "tail", "drop", "last", "without",
  "indexOf", "lastIndexOf", "isEmpty", "chain", "difference", "sample",
  "partition", "countBy", "indexBy", "get", "at", "slice")

Collection.prototype.clone = cloneInstance
Collection.prototype.dispatch = _.noop
