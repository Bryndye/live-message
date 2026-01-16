class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

if (typeof window !== "undefined") {
  window.User = User;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = User;
}
