ReactModel [WIP]
===

The missing Model for React.js

**Note: This project is still under development now, do not use it in production**

ReactModel provides a Model / Collection layer for React projects, it plays nice
with Flux, Redux or other Flux like system.
It's strongly inspired by Backbone.Model / Backbone.Collection

Installation
---

```bash
npm install --save react-model
```

The Gist
---

You can create your own models and collections by inheriting ReactModel.Model and
ReactModel.Collection, use it with Flux like stores.

For example, use it with Redux:

```javascript
// Create your own Model and Collection
import { Model, Collection } from 'react-model'

class MyModel extends Model {
  urlRoot = "/path/to/fetch/data"
}

class MyCollection extends Collection {
  model = MyModel
}


// Create your own React Component
import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(state => ({ collection: state.collection }))
class MyComponent extends Component {
  componentDidMount() {
    // This will dispatch an action
    this.props.collection.fetch()
  }

  render() {
    return (<div>{this.props.collection.map(model => model.get('name'))}</div>)
  }
}


// Create a Redux reducer with ReactModel.createReducer
import { combineReducers } from 'redux'
import { createReducer } from 'react-model'

let rootReducer = combineReducers({
  collection: createReducer(MyCollection)
})


// Create a Redux store holding the state of your app.
// Then join them together!
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { bindDispatch } from 'react-model'

let store = createStore(rootReducer)
bindDispatch(store.dispatch)

render((
  <Provider store={store}>
    <MyComponent/>
  </Provider>
), document.getElementById('app'))


```

Comparison with Backbone
---

See [Backbone like methods for Collection & Model](https://github.com/bbtfr/react-model/issues/1)
