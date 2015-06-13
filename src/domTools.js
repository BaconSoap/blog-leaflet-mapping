(function(util) {
  /**
   * Get an element by its ID
   */
  util.getById = function(id) {
    return document.getElementById(id);
  };

  /**
   * Add an event listener to an element located by its ID
   */
  util.onById = function(id, eventName, cb) {
    util.getById(id).addEventListener(eventName, cb);
  }
})(window.util || (window.util = {}));
