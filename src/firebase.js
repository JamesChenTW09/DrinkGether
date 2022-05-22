import { initializeApp } from "firebase/app";
import dayjs from "dayjs";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
} from "firebase/database";
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
export const db = getDatabase();
export const dbRef = ref(getDatabase());

export async function fetchData(route) {
  return await get(child(dbRef, route)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
  });
}

export function deleteMemberEventData(participants, event) {
  const { displayName } = auth.currentUser;
  const { eventId } = event;
  const participantList = Object.keys(participants);
  participantList.filter((item) => {
    return item !== auth.currentUser.displayName;
  });
  const participantListLen = participantList.length;
  for (let i = 0; i < participantListLen; i++) {
    remove(
      ref(db, "user/" + participantList[i] + "/info/joinEvents/" + eventId)
    );
  }
  remove(ref(db, "user/" + displayName + "/info/holdEvents/" + eventId));
}

//調整目前人數
export function updateCurrentPal(participants, event, currentPal) {
  const participantsList = Object.keys(participants);
  if (event.holdUserId) {
    const { eventId, holdUserId } = event;
    const participantForJoinEvent = participantsList.filter((item) => {
      return item !== auth.currentUser.displayName && item !== holdUserId;
    });
    participantForJoinEvent.forEach((user) => {
      update(ref(db, "user/" + user + "/info/joinEvents/" + eventId), {
        memberEventCurrentPal: currentPal,
      });
    });
    update(ref(db, "user/" + holdUserId + "/info/holdEvents/" + eventId), {
      memberEventCurrentPal: currentPal,
    });
  } else {
    const { eventId, userId } = event;
    const participantForJoinEvent = participantsList.filter((item) => {
      return item !== auth.currentUser.displayName && item !== userId;
    });
    participantForJoinEvent.forEach((user) => {
      update(ref(db, "user/" + user + "/info/joinEvents/" + eventId), {
        memberEventCurrentPal: currentPal,
      });
    });
    update(ref(db, "user/" + userId + "/info/holdEvents/" + eventId), {
      memberEventCurrentPal: currentPal,
    });
  }
}

export function sendNotificationMessage(event, participants, uuid, message) {
  const notificationTime = dayjs().format("YYYY-MM-DD.HH:mm:ss");
  let participantsList = Object.keys(participants);
  let participantWithoutJoin = participantsList.filter((item) => {
    return item !== auth.currentUser.displayName;
  });
  if (event.memberEventDate) {
    const { memberEventDate, eventId, memberEventTime } = event;
    const eventTime = memberEventDate + "." + memberEventTime;
    participantWithoutJoin.forEach((participant) => {
      writeNewNotification(
        participant,
        uuid,
        message,
        eventTime,
        notificationTime,
        eventId
      );
    });
  } else {
    const { eventDate, eventTime, eventId } = event;
    const eventCompleteTime = eventDate + "." + eventTime;
    participantWithoutJoin.forEach((participant) => {
      writeNewNotification(
        participant,
        uuid,
        message,
        eventCompleteTime,
        notificationTime,
        eventId
      );
    });
  }
}

export function writeDiscussData(name, textContent, imageUrl, date, count) {
  const reference = ref(db, "discuss/" + date + "/" + count);
  set(reference, {
    profilePicture: imageUrl,
    username: name,
    textContent: textContent,
  });
}
// export function getTotalDiscuss(date, cb) {
//   const test = ref(db, "discuss/" + date);
//   onValue(test, (snapshot) => cb(snapshot.val()));
// }

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
export function writeMemberHoldEvent(userId, eventId, eventInputValue) {
  const { eventPlace, eventDate, eventTime, eventMaxPal } = eventInputValue;
  const reference = ref(db, "user/" + userId + "/info/holdEvents/" + eventId);
  set(reference, {
    memberEventName: eventPlace,
    memberEventDate: eventDate,
    memberEventTime: eventTime,
    memberEventDateAndTime: eventDate + "," + eventTime,
    eventId,
    memberEventPal: eventMaxPal,
    memberEventCurrentPal: 1,
  });
}
export function writeMemberJoinEvent(
  displayName,
  currentAttendant,
  eventDetail
) {
  const { eventId, eventPlace, eventDate, eventTime, eventMaxPal, userId } =
    eventDetail;
  const reference = ref(
    db,
    "user/" + displayName + "/info/joinEvents/" + eventId
  );
  set(reference, {
    memberEventName: eventPlace,
    memberEventDate: eventDate,
    memberEventTime: eventTime,
    memberEventCurrentPal: currentAttendant,
    memberEventMaxPal: eventMaxPal,
    eventId: eventId,
    holdUserId: userId,
  });
}

export function writeRecommendBar(userNameId, uuid, barName, barRceommendText) {
  const reference = ref(db, "user/" + userNameId + "/BarRecommend/" + uuid);
  set(reference, {
    barName,
    barRceommendText,
    uuid,
  });
}

export function writeNewEvent(eventId, eventInputValue, userId) {
  const { eventPlace, eventDate, eventTime, eventMaxPal, eventDescription } =
    eventInputValue;
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
  const reference = ref(db, "discuss/" + eventId + "/" + discussId);
  set(reference, {
    userId,
    discussContent,
    discussName,
    discussTime,
    reply: false,
  });
}

// export function writeDiscussReplyItem(
//   eventId,
//   discussId,
//   userId,
//   discussContent,
//   discussName,
//   discussTime,
//   replyId
// ) {
//   const reference = ref(
//     db,
//     "discuss/" + eventId + "/" + discussId + "/replyItem" + replyId
//   );
//   set(reference, {
//     userId,
//     discussContent,
//     discussName,
//     discussTime,
//     replyId,
//   });
// }
