import Imm from 'immutable'
import fetch from 'isomorphic-fetch'

import ajaxAction from './decorators/ajaxAction'
import keepWithoutDispatchMethod from './decorators/keepWithoutDispatchMethod'
import updateAction, { updateMethodDecorator } from './decorators/updateAction'
import { cloneInstance, cloneInstanceFrom } from './utils/cloneInstance'

export default class Model {

  constructor(attributes = {}) {
    this.attributes = Imm.Map(attributes)
  }

  get() {}

}

Model.prototype.clone = cloneInstance
Model.prototype.cloneFrom = cloneInstanceFrom
Model.prototype.idAttribute = "id"
Model.prototype.defaults = {}
