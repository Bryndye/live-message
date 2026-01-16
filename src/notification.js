function askNotificationPermission() {
  // On vérifie si le navigateur prend en charge les notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }
  Notification.requestPermission().then((permission) => {
    // On affiche ou non le bouton en fonction de la réponse
    console.log("Notification permission:", Notification.permission);
    // granted = autorisé
    new Notification("Notifications activées !", { body: "Vous recevrez une notification à chaque nouveau message." });
  });
}

askNotificationPermission();