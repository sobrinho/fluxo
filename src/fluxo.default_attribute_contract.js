import ObjectStore from "./fluxo.object_store.js";

export default {
  hook: function (attribute, newValue, oldValue) {
    newValue = this.parser(attribute).call(this, newValue);

    if (oldValue === newValue) {
      return false;
    }

    this.data[attribute] = newValue;

    return true;
  },

  parser: function (value) {
    return value;
  },

  dump: function (value) {
    if (value === undefined) {
      return;
    }

    return JSON.parse(JSON.stringify(value));
  }
};
