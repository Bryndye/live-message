class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static setUser(user) {
    user.id = null; // we don't need to store the socket id
    window.localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Get user from localStorage if exists
   * @param {socket.id} socketId 
   * @returns {User|null}
   */
  static getUser(socketId) {
    const userStorage = window.localStorage.getItem("user") || null;
    if (userStorage === null) {
      console.log("No user found in localStorage");
      // Return error ?
      return null;
    }
    let userParsed = JSON.parse(userStorage);
    const user = new User(socketId, userParsed.name);
    return user;
  }
}

// Export for browser
if (typeof window !== "undefined") {
  window.User = User;
}
// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = User;
}
