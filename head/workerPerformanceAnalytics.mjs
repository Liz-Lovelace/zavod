import moment from "moment";

export function composeAnalytics(points, remainingTasksCount) {
  let servers = splitByServer(points);
  let serverPerformances = {};
  for (let [server, points] of Object.entries(servers)) {
    let allTimeTasksPerHour = pointsPerHour(points);
    let lastMinTasksPerHour = pointsPerHour(getLastMinute(points));
    serverPerformances[server] = {
      allTimeTasksPerHour,
      lastMinTasksPerHour,
    }
    if (server == 'all') {
      let serverCount = Object.keys(servers).length - 1;
      serverPerformances['average'] = {
        allTimeTasksPerHour: allTimeTasksPerHour / serverCount,
        lastMinTasksPerHour: lastMinTasksPerHour / serverCount,
      }
    }
  }
  return {
    completedTasks: points.length,
    remainingTasks: remainingTasksCount,
    startTimestamp: points[0].timestamp,
    serverPerformances,
  };
}

function pointsPerHour(points) {
  let begin = points[0].timestamp;
  let end = points[points.length - 1].timestamp;
  return points.length / (end - begin) * 3600
}

function splitByServer(points) {
  let ipTable = {all: []}

  for (let point of points) {
    if (!ipTable[point.ip]) {
      ipTable[point.ip] = [];
    }
    ipTable[point.ip].push(point);
    ipTable.all.push(point);
  }

  return ipTable;
}

function getLastMinute(points) {
  let lastMinPoints = []
  let now = moment().unix();
  for (let i = points.length-1; i >= 0; i--) {
    if (now - points[i].timestamp <= 60) {
      lastMinPoints.push(points[i])
    } else {
      break;
    }
  }
  return lastMinPoints.reverse();
}