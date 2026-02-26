// Browser notification utility
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Global flag to control notifications
let notificationsEnabled = false;

export const setNotificationsEnabled = (enabled: boolean) => {
  notificationsEnabled = enabled;
};

export const showBrowserNotification = (
  title: string,
  options?: NotificationOptions,
) => {
  if (
    !notificationsEnabled ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const defaultOptions: NotificationOptions = {
    icon: "/vite.svg", // You can change this to your app icon
    badge: "/vite.svg",
    silent: false,
    ...options,
  };

  const notification = new Notification(title, defaultOptions);

  // Auto close after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);

  // Handle click to focus window
  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};

export const showSuccessNotification = (message: string) => {
  showBrowserNotification("Success", {
    body: message,
    icon: "/vite.svg",
    tag: "success",
    requireInteraction: false,
  });
};

export const showErrorNotification = (message: string) => {
  showBrowserNotification("Error", {
    body: message,
    icon: "/vite.svg",
    tag: "error",
    requireInteraction: true, // Keep error notifications until clicked
  });
};

export const showInfoNotification = (message: string) => {
  showBrowserNotification("Info", {
    body: message,
    icon: "/vite.svg",
    tag: "info",
    requireInteraction: false,
  });
};
