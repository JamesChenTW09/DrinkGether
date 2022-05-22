import dayjs from "dayjs";
import { auth } from "../firebase";

export function orderByTime(listOfId, timeLabel, reverse = false) {
  const idList = Object.keys(listOfId);
  let timeList = idList.map((item) => {
    return listOfId[item][timeLabel];
  });
  if (reverse) {
    timeList = mergeSort(timeList, reverse);
  } else {
    timeList = mergeSort(timeList);
  }
  let fianlArr = [];
  let timeListLen = timeList.length;
  let idListLen = idList.length;
  for (let i = 0; i < timeListLen; i++) {
    for (let j = 0; j < idListLen; j++) {
      if (timeList[i] === listOfId[idList[j]][timeLabel]) {
        fianlArr.push(listOfId[idList[j]]);
        idList.splice(j, 1);
        break;
      }
    }
  }
  return fianlArr;
}

export function dailyEventSort(allEventList, keepDay) {
  let finalArr = [];
  let todayEventArr = allEventList.filter((item) => {
    return item["eventDate"] === keepDay;
  });
  let eventTimeArr = todayEventArr.map((item) => {
    return item["eventTime"];
  });

  eventTimeArr = mergeSort(eventTimeArr);
  let eventTimeArrLen = eventTimeArr.length;
  let todayEventArrLen = todayEventArr.length;
  for (let i = 0; i < eventTimeArrLen; i++) {
    for (let j = 0; j < todayEventArrLen; j++) {
      if (eventTimeArr[i] === todayEventArr[j]["eventTime"]) {
        finalArr.push(todayEventArr[j]);
        todayEventArr.splice(j, 1);
        break;
      }
    }
  }
  return finalArr;
}

export function sortMemberEventList(memberEventList) {
  if (!memberEventList) {
    return null;
  }
  const memberOrderEventList = orderByTime(
    memberEventList,
    "memberEventDateAndTime"
  );
  return memberOrderEventList;
}

export function flattern(arr) {
  let result = [];
  arr.forEach((item) => {
    if (!item) {
      return;
    }
    Array.isArray(item)
      ? (result = result.concat(flattern(item)))
      : result.push(item);
  });
  return result;
}

export function showAllEventItemArr(data, idList, dayList) {
  const totalEventList = [];
  for (let i = 0; i < idList.length; i++) {
    for (let j = 0; j < dayList.length; j++) {
      if (!data[dayList[j]][idList[i]]) {
        continue;
      } else {
        totalEventList.push(data[dayList[j]][idList[i]]);
      }
    }
  }
  return totalEventList;
}

export function getMonth(month = dayjs().month()) {
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function checkUserOrVisitor(user, visitor, storeUserId) {
  return auth.currentUser && storeUserId === auth.currentUser.displayName
    ? { display: user }
    : { display: visitor };
}

function merge(arr1, arr2, reverse) {
  let i = 0;
  let j = 0;
  let a1Len = arr1.length;
  let a2Len = arr2.length;
  let result = [];
  if (reverse) {
    while (i < a1Len && j < a2Len) {
      if (arr1[i] < arr2[j]) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
    while (i < a1Len) {
      result.push(arr1[i]);
      i++;
    }
    while (j < a2Len) {
      result.push(arr2[j]);
      j++;
    }
  } else {
    while (i < a1Len && j < a2Len) {
      if (arr1[i] < arr2[j]) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
    while (i < a1Len) {
      result.push(arr1[i]);
      i++;
    }
    while (j < a2Len) {
      result.push(arr2[j]);
      j++;
    }
  }
  return result;
}

function mergeSort(arr, reverse = false) {
  if (arr.length === 1 || arr.length === 0) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    if (reverse) {
      return merge(mergeSort(left, true), mergeSort(right, true), true);
    } else {
      return merge(mergeSort(left), mergeSort(right));
    }
  }
}
