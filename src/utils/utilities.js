import dayjs from "dayjs";

export function orderByTime(listOfId, timeLabel, reverse = false) {
  const idList = Object.keys(listOfId);
  const timeList = idList.map((item) => {
    return listOfId[item][timeLabel];
  });
  if (reverse) {
    timeList.sort().reverse();
  } else {
    timeList.sort();
  }

  let fianlArr = [];
  for (let i = 0; i < timeList.length; i++) {
    for (let j = 0; j < idList.length; j++) {
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

  eventTimeArr = eventTimeArr.sort();
  for (let i = 0; i < eventTimeArr.length; i++) {
    for (let j = 0; j < todayEventArr.length; j++) {
      if (eventTimeArr[i] === todayEventArr[j]["eventTime"]) {
        finalArr.push(todayEventArr[j]);
        todayEventArr.splice(j, 1);
        break;
      }
    }
  }
  return finalArr;
}

export function sortEventList(memberEventList) {
  if (!memberEventList) {
    return null;
  }
  const memberOrderHoldEventList = orderByTime(
    memberEventList,
    "memberEventDateAndTime"
  );
  return memberOrderHoldEventList;
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
