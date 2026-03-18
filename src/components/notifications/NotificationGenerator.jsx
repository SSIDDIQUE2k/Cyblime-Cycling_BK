import { base44 } from "@/api/base44Client";

// Create notification for matching event
export async function notifyMatchingEvent(userEmail, event, profile) {
  // Check if event matches user preferences
  if (!profile) return;

  const matches = [];
  
  if (profile.skill_level === event.level) {
    matches.push("your skill level");
  }
  
  if (profile.favorite_discipline) {
    if (event.type === 'ride' && profile.favorite_discipline.includes('Road')) {
      matches.push("your favorite discipline");
    }
  }

  if (matches.length > 0) {
    await base44.entities.Notification.create({
      user_email: userEmail,
      title: "🎯 New Event Match",
      message: `"${event.title}" matches ${matches.join(' and ')}!`,
      type: "new_event",
      related_id: event.id,
      action_url: `/Events?id=${event.id}`
    });
  }
}

// Create event reminder
export async function createEventReminder(rsvp) {
  const eventDate = new Date(rsvp.event_date);
  const oneDayBefore = new Date(eventDate);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);

  const now = new Date();
  const timeDiff = eventDate - now;
  const hoursUntil = timeDiff / (1000 * 60 * 60);

  // Send reminder if event is within 24 hours
  if (hoursUntil <= 24 && hoursUntil > 0 && !rsvp.reminder_sent) {
    await base44.entities.Notification.create({
      user_email: rsvp.created_by,
      title: "⏰ Event Reminder",
      message: `"${rsvp.event_name}" is happening tomorrow!`,
      type: "event_reminder",
      related_id: rsvp.event_id,
      action_url: `/Events?id=${rsvp.event_id}`
    });

    // Mark reminder as sent
    await base44.entities.EventRSVP.update(rsvp.id, { reminder_sent: true });
  }
}

// Notify about new challenge
export async function notifyNewChallenge(challenge) {
  const users = await base44.entities.User.list();
  
  for (const user of users) {
    await base44.entities.Notification.create({
      user_email: user.email,
      title: "🏆 New Challenge Available",
      message: `Join "${challenge.title}" and earn ${challenge.reward_points} points!`,
      type: "challenge",
      related_id: challenge.id,
      action_url: `/Challenges?id=${challenge.id}`
    });
  }
}

// Notify buddy activity
export async function notifyBuddyActivity(buddyEmail, activity, userName) {
  await base44.entities.Notification.create({
    user_email: buddyEmail,
    title: "👥 Buddy Activity",
    message: `${userName} ${activity}`,
    type: "general",
    action_url: `/Profile`
  });
}