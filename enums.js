const Events = {
    CONNECT: "connect",
    USER_CONNECTED: "user:connected",
    USER_DISCONNECTED: "user:disconnected",
    MESSAGE: "message",
    USER_ID: "user:id",
};

if (typeof window !== "undefined") {
    window.Events = Events;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = { Events };
}
