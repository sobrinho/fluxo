#Fluxo

Fluxo is a simple and lightweight Facebook Flux implementation.

##How to use

###Actions

Everything on Fluxo starts on action handlers, this action handlers are
javascript objects registered upon a name using the method `Fluxo#registerActionHandler`.

```javascript
var commentActionHandler = {
  create: function(data) {
    return data;
  }
};

Fluxo.registerActionHandler("Comment", commentActionHandler);
```

To call an action you need use the method `Fluxo#callAction` with the name of
action handler, action name and the other arguments that are passed to the action.

```javascript
Fluxo.callAction("Comment", "create", { content: "This is my comment" });
```

You can register action handlers with arguments that are passed to the `initialize`
method of your action handler that are invoked when the action handler is registered.

```javascript
var commentActionHandler = {
  initialize: function (options) {
    this.myOption = options.myOption;
  }
};

Fluxo.registerActionHandler("Comment", commentActionHandler, { myOption: true });
```

### Stores

You hold the state of your Flux app on the store, the stores should emit an event
to the component/view layer when something change and then your view layer renders the
changes.

On Fluxo, the store is a convenient wrapper to your literal javascript objects or
array with literal objects. It resembles a simplified version of model and
collections of Backbone.js with some key changes. On the Fluxo.Store/Collection
you don't have any method to make server requests, you also only have a very simple
event emission that is triggered when the store/collection changes.

You can create a store like this:

```javascript
var Comment = Fluxo.Store.extend({
  myStoreMethod: function() {
    // ...
  }
});

var comment = new Comment({ content: "This is my comment" });
```

You need update your data using the `Fluxo.Store#set`, which emits the change
event.

```javascript
comment.set({ content: "This is my edited comment" });
```

To access your data just access the store's `data` property.

```javascript
comment.data.content
```

###CollectionStore

`Fluxo.CollectionStore` is a wrapper to your array of objects. When you create
a CollectionStore, each item of your array is wrapped on a instance of `Fluxo.Store`,
which you can change this extending the `Fluxo.CollectionStore` and specifying the
store class.

```javascript
var MyComments = Fluxo.CollectionStore.extend({
  store: MyComment
});
```

When a store of a collection emits a signal of change, this signal is propagated
to the collection that also emits a change signal.

###Using with React.js

You can make your React component watch changes on your store using the `Fluxo.WatchComponent`
mixin.

```jsx
var comment = new Fluxo.Store({ content: "My comment" });

var MyComponent = React.createClass({
  mixins: [Fluxo.WatchComponent],

  listenProps: ["comment"],

  render: function() {
    return <p>{this.state.comment.content}</p>;
  }
});

React.render(
  <MyComponent comment={comment} />,
  document.getElementById("app")
);
```

To specify what store you are listening you need declare on the component's
`listenProps` property the prop key to your store instances. In this way,
your store data, which is generated by `toJSON` method, is placed on state with
the same prop key.

On the example above, the content of your store is placed on your component in
`this.state.comment`.

###Bonus pub/sub
Internally Fluxo uses it own pub/sub implementation, this is a 20 LOC implementation.
Feel free to use on your app. The usage is very simple.

```javascript
// Create the event and store the "canceler" on a variable
var cancel = Fluxo.Radio.subscribe("alertMessage", function(message) {
  alert(message);
});

// Call the event
Fluxo.Radio.publish("alertMessage", "Hello!");

// Cancel the event
cancel();
```
