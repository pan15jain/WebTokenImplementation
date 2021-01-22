exports.getISTTime = (d) => {
  return
  if (d) {
    var dateUTC = new Date(d);
    var dateUTC = dateUTC.getTime();
    var dateIST = new Date(dateUTC);
    dateIST.setHours(dateIST.getHours() + 5);
    dateIST.setMinutes(dateIST.getMinutes() + 30);
    return dateIST;
  } else return;
};
