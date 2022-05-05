import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAisqS21dvneZVG2x35624HW6d_4nD6Rcs",
  authDomain: "chat-686b7.firebaseapp.com",
  databaseURL:
    "https://chat-686b7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-686b7",
  storageBucket: "chat-686b7.appspot.com",
  messagingSenderId: "748002535005",
  appId: "1:748002535005:web:ce7336ebd1d322a4d24fb4",
  measurementId: "G-V1S769LR10",
};

const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth();

export function writeDiscussData(name, textContent, imageUrl, date, count) {
  const db = getDatabase(app);
  const reference = ref(db, "discuss/" + date + "/" + count);

  set(reference, {
    profilePicture: imageUrl,
    username: name,
    textContent: textContent,
  });
}
export function getTotalDiscuss(date, cb) {
  const db = getDatabase();
  const test = ref(db, "discuss/" + date);
  onValue(test, (snapshot) => {
    const data = snapshot.val();
    cb(data);
  });
}

export function writeUserData(
  userId,
  email,
  name,
  password,
  job = "",
  passion = "",
  sex = "",
  about = "",
  phone = "",
  lineId = "",
  holdEvents = "",
  joinEvents = "",
  lineIdForAll = false,
  notification = ""
) {
  const db = getDatabase(app);
  const reference = ref(db, "user/" + name + "/info/");

  set(reference, {
    name,
    email,
    password,
    job,
    passion,
    sex,
    about,
    phone,
    isOnline: false,
    lineId,
    holdEvents,
    joinEvents,
    userId,
    lineIdForAll,
    notification,
  });
}
export function writeMemberHoldEvent(
  userId,
  eventId,
  memberEventName,
  memberEventDate,
  memberEventTime,
  memberEventPal
) {
  const db = getDatabase(app);
  const reference = ref(db, "user/" + userId + "/info/holdEvents/" + eventId);
  set(reference, {
    memberEventName,
    memberEventDate,
    memberEventTime,
    eventId,
    memberEventPal,
    memberEventCurrentPal: 1,
  });
}
export function writeMemberJoinEvent(
  userId,
  eventId,
  memberEventName,
  memberEventDate,
  memberEventTime,
  memberEventCurrentPal,
  memberEventMaxPal,
  holdUserId
) {
  const db = getDatabase(app);
  const reference = ref(db, "user/" + userId + "/info/joinEvents/" + eventId);
  set(reference, {
    memberEventName,
    memberEventDate,
    memberEventTime,
    memberEventCurrentPal,
    memberEventMaxPal,
    eventId,
    holdUserId,
  });
}

export function writeRecommendBar(userNameId, uuid, barName, barRceommendText) {
  const db = getDatabase(app);
  const reference = ref(db, "user/" + userNameId + "/BarRecommend/" + uuid);
  set(reference, {
    barName,
    barRceommendText,
  });
}

export function writeNewEvent(
  eventId,
  eventPlace,
  eventDate,
  eventTime,
  eventMaxPal,
  eventDescription,
  userId
) {
  const db = getDatabase(app);
  const reference = ref(db, "event/" + eventDate + "/" + eventId);
  set(reference, {
    eventPlace,
    eventDate,
    eventTime,
    eventMaxPal,
    eventCurrentPal: 1,
    eventDescription,
    eventId,
    userId,
    eventParticipants: "",
  });
}
export function writeNewNotification(
  userNameId,
  uuid,
  message,
  EventTime,
  nowTime,
  eventId
) {
  const db = getDatabase(app);
  const reference = ref(
    db,
    "user/" + userNameId + "/info/notification/" + uuid + "/"
  );
  set(reference, {
    uuid,
    message,
    EventTime,
    nowTime,
    eventId,
  });
}

export function writeNewParticipant(
  eventDate,
  eventId,
  eventParticipants,
  userId
) {
  const db = getDatabase(app);
  const reference = ref(
    db,
    "event/" +
      eventDate +
      "/" +
      eventId +
      "/" +
      eventParticipants +
      "/" +
      userId
  );
  set(reference, {
    eventId,
    userId,
  });
}

export function writeDiscussItem(
  eventId,
  discussId,
  userId,
  discussContent,
  discussName,
  discussTime
) {
  const db = getDatabase(app);
  const reference = ref(db, "discuss/" + eventId + "/" + discussId);
  set(reference, {
    userId,
    discussContent,
    discussName,
    discussTime,
    reply: false,
  });
}

export function writeDiscussReplyItem(
  eventId,
  discussId,
  userId,
  discussContent,
  discussName,
  discussTime,
  replyId
) {
  const db = getDatabase(app);
  const reference = ref(
    db,
    "discuss/" + eventId + "/" + discussId + "/replyItem" + replyId
  );
  set(reference, {
    userId,
    discussContent,
    discussName,
    discussTime,
    replyId,
  });
}
