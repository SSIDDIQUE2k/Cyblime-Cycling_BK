import { base44 } from "@/api/base44Client";

export async function createNotification(userEmail, title, message, type, relatedId = null, actionUrl = null) {
  try {
    await base44.entities.Notification.create({
      user_email: userEmail,
      title,
      message,
      type,
      related_id: relatedId,
      action_url: actionUrl,
      read: false
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

export async function notifyEventReminder(userEmail, event) {
  const eventDate = new Date(event.date);
  const now = new Date();
  const hoursDiff = (eventDate - now) / (1000 * 60 * 60);
  
  if (hoursDiff > 0 && hoursDiff <= 24) {
    await createNotification(
      userEmail,
      "Event Reminder: " + event.title,
      `Your event "${event.title}" is tomorrow at ${event.time}. See you there!`,
      "event_reminder",
      event.id,
      `/events?eventId=${event.id}`
    );
  }
}

export async function notifyNewMatchingEvent(userEmail, event, reason) {
  await createNotification(
    userEmail,
    "New Event You Might Like",
    `"${event.title}" on ${event.date} matches your ${reason}. Check it out!`,
    "new_event",
    event.id,
    `/events?eventId=${event.id}`
  );
}

export async function notifyEventUpdate(userEmail, event, updateMessage) {
  await createNotification(
    userEmail,
    "Event Update: " + event.title,
    updateMessage,
    "event_update",
    event.id,
    `/events?eventId=${event.id}`
  );
}

export async function notifyChallengeCompleted(userEmail, challenge) {
  await createNotification(
    userEmail,
    "Challenge Completed! 🎉",
    `Congratulations! You've completed "${challenge.title}" and earned ${challenge.reward_points} points!`,
    "challenge",
    challenge.id,
    `/challenges`
  );
}

export async function notifyBadgeEarned(userEmail, badge) {
  await createNotification(
    userEmail,
    "New Badge Earned! 🏆",
    `You've earned the "${badge.title}" badge! ${badge.description}`,
    "badge",
    badge.id,
    `/profile?tab=achievements`
  );
}