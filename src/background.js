import axios from "axios";
import {
  beforeSendHeaders,
  finvestWeekDay,
  formatDateTime,
  funCurDate,
  iPhone_OS_13_2_3_like_Mac_OS_X,
  Windows_NT_10_0_Win64_x64
} from "@/common/js/utils";

var Interval;
var holiday;
var RealtimeFundcode = null;
var RealtimeIndcode = null;
var fundListM = [];
var showBadge = 1;
var BadgeContent = 1;
var BadgeType = 1;
var userId = null;

var getGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

var getHoliday = () => {
  let url = "http://x2rr.github.io/funds/holiday.json";
  return axios.get(url);
};

var checkHoliday = date => {
  var nowMonth = date.getMonth() + 1;
  var nowYear = date.getFullYear();
  var strDate = date.getDate();
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let check = false;
  var nowDate = nowMonth + "-" + strDate;
  let holidayList = holiday.data;
  for (const year in holidayList) {
    if (holidayList.hasOwnProperty(year)) {
      const yearData = holidayList[year];
      if (year == nowYear) {
        for (const day in yearData) {
          if (yearData.hasOwnProperty(day)) {
            const dayData = yearData[day];
            if (nowDate == day && dayData.holiday) {
              check = true;
            }
          }
        }
      }
    }
  }
  return check;
};

var toNum = a => {
  var a = a.toString();
  var c = a.split(".");
  var num_place = ["", "0", "00", "000", "0000"],
    r = num_place.reverse();
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length;
    c[i] = r[len] + c[i];
  }
  var res = c.join("");
  return res;
};

var cpr_version = (a, b) => {
  var _a = toNum(a),
    _b = toNum(b);
  if (_a == _b) console.log("版本号相同！版本号为：" + a);
  if (_a > _b) console.log("版本号" + a + "是新版本！");
  if (_a < _b) console.log("版本号" + b + "是新版本！");
};

var isWeekDate = () => {
  //时区转换为东8区
  var zoneOffset = 8;
  var offset8 = new Date().getTimezoneOffset() * 60 * 1000;
  var nowDate8 = new Date().getTime();
  var curDate = new Date(nowDate8 + offset8 + zoneOffset * 60 * 60 * 1000);
  if (curDate.getDay() == "6" || curDate.getDay() == "0") return true;
  else return false;
};

var isDuringDate = () => {
  //时区转换为东8区
  var zoneOffset = 8;
  var offset8 = new Date().getTimezoneOffset() * 60 * 1000;
  var nowDate8 = new Date().getTime();
  var curDate = new Date(nowDate8 + offset8 + zoneOffset * 60 * 60 * 1000);

  if (checkHoliday(curDate)) {
    return false;
  }
  var beginDateAM = new Date();
  var endDateAM = new Date();
  var beginDatePM = new Date();
  var endDatePM = new Date();

  beginDateAM.setHours(9, 30, 0);
  endDateAM.setHours(11, 35, 0);
  beginDatePM.setHours(13, 0, 0);
  endDatePM.setHours(15, 5, 0);
  if (curDate.getDay() == "6" || curDate.getDay() == "0") {
    return false;
  } else if (curDate >= beginDateAM && curDate <= endDateAM) {
    return true;
  } else if (curDate >= beginDatePM && curDate <= endDatePM) {
    return true;
  } else {
    return false;
  }
};

var formatNum = val => {
  let num = parseFloat(val);
  let absNum = Math.abs(num);
  if (absNum < 10) {
    return num.toFixed(2);
  } else if (absNum < 100) {
    return num.toFixed(1);
  } else if (absNum < 1000) {
    return num.toFixed(0);
  } else if (absNum < 10000) {
    return (num / 1000).toFixed(1) + "k";
  } else if (absNum < 1000000) {
    return (num / 1000).toFixed(0) + "k";
  } else if (absNum < 10000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else {
    return (num / 1000000).toFixed(0) + "M";
  }
};

var setBadge = (fundcode, Realtime, type) => {
  let fundStr = null;
  if (type == 3) {
    let url =
      "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&fields=f3&secids=" +
      fundcode +
      "&_=" +
      new Date().getTime();
    axios.get(url).then(res => {
      let data = res.data.data.diff;
      let text = data[0].f3.toString();
      let num = data[0].f3;
      chrome.browserAction.setBadgeText({
        text: text
      });
      let color = Realtime ? (num >= 0 ? "#F56C6C" : "#4eb61b") : "#4285f4";
      chrome.browserAction.setBadgeBackgroundColor({
        color: color
      });
    });
  } else {
    if (type == 1) {
      fundStr = fundcode;
    } else {
      fundStr = fundListM.map(val => val.code).join(",");
    }
    // let url = "https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=" + userId + "&Fcodes=" + fundStr;
    // axios.get(url).then((res) => {
    axios
      .post("https://api.fund.eastmoney.com/favor/GetFundsInfo", {
        fcodes: fundStr
      })
      .then(res => {
        let allAmount = 0;
        let allGains = 0;
        let textStr = null;
        let sumNum = 0;
        let datestr = formatDateTime(
          new Date(Number(res.data.Expansion.bjTime) * 1000),
          "yyyy-MM-dd hh:mm"
        );
        if (type == 1) {
          let val = res.data.Data.KFS[0];
          let data = {
            fundcode: val.FCODE,
            name: val.SHORTNAME,
            jzrq: val.FSRQ,
            dwjz: isNaN(val.DWJZ) ? null : val.DWJZ,
            gsz: isNaN(val.gsz) ? null : val.gsz,
            gszzl: isNaN(val.gszzl) ? 0 : val.gszzl,
            gztime: datestr,
            num: 0
          };
          let slt = fundListM.filter(item => item.code == data.fundcode)[0];
          if (slt == null) return false;

          data.num = slt == null ? 0 : slt.num;
          var sum = 0;
          let num = data.num ? data.num : 0;
          if (
            //(val.GSZ === "--" && val.GSZZL === "--" && val.GZTIME === "--")
            //(val.GSZ === null && val.GSZZL === null && val.GZTIME === null ||
            (val.gsz === "" && val.gszzl === "") ||
            data.jzrq === data.gztime.substr(0, 10) ||
            funCurDate() <= new Date().setHours(9, 30, 0) ||
            isWeekDate() ||
            checkHoliday(new Date())
          ) {
            data.gszzl = isNaN(val.RZDF) ? 0 : val.RZDF;
            sum = (
              (data.dwjz - data.dwjz / (1 + data.gszzl * 0.01)) *
              num
            ).toFixed(1);
          } else {
            if (data.gsz) {
              sum = ((data.gsz - data.dwjz) * num).toFixed(1);
            }
          }
          if (BadgeType == 1) {
            textStr = data.gszzl;
            sumNum = textStr;
          } else {
            if (num != 0) {
              sumNum = sum;
              textStr = formatNum(sum);
            } else {
              sumNum = "0";
              textStr = "0";
            }
          }
        } else {
          // res.data.Datas.forEach((val) => {
          res.data.Data.KFS.forEach(val => {
            let slt = fundListM.filter(item => item.code == val.FCODE)[0];
            if (slt == null) return;
            let num = slt.num ? slt.num : 0;
            let NAV = isNaN(val.DWJZ) ? null : val.DWJZ;

            allAmount += NAV * num;
            var sum = 0;
            if (
              //(val.GSZ === "--" && val.GSZZL === "--" && val.GZTIME === "--")
              //(val.gsz === null && val.gszzl === null && val.GZTIME === null ||
              (val.gsz === "" && val.gszzl === "") ||
              val.FSRQ === datestr.substr(0, 10) ||
              funCurDate() <= new Date().setHours(9, 30, 0) ||
              isWeekDate() ||
              checkHoliday(new Date())
            ) {
              let NAVCHGRT = isNaN(val.RZDF) ? 0 : val.RZDF;
              sum = (NAV - NAV / (1 + NAVCHGRT * 0.01)) * num;
            } else {
              let gsz = isNaN(val.gsz) ? null : val.gsz;
              if (gsz && NAV) {
                sum = (gsz - NAV) * num;
              }
            }
            // console.info(sum + " " + val.SHORTNAME)
            allGains += sum;
          });
          if (BadgeType == 1) {
            if (allAmount == 0 || allGains == 0) {
              sumNum = "0";
              textStr = "0";
            } else {
              textStr = ((100 * allGains) / allAmount).toFixed(2);
              sumNum = textStr;
            }
          } else {
            sumNum = allGains;
            textStr = formatNum(allGains);
          }
        }
        chrome.browserAction.setBadgeText({
          text: textStr
        });
        let color = Realtime
          ? sumNum >= 0
            ? "#F56C6C"
            : "#4eb61b"
          : "#4285f4";
        chrome.browserAction.setBadgeBackgroundColor({
          color: color
        });
      })
      .catch(error => {
        console.info(error);
      });
  }
};

var startInterval = (RealtimeFundcode, type = 1) => {
  endInterval(Interval);
  let Realtime = isDuringDate();
  RealtimeFundcode = RealtimeFundcode;
  setBadge(RealtimeFundcode, Realtime, type);
  let time = 2 * 60 * 1000;
  if (type == 3) {
    time = 10 * 1000;
  }
  Interval = setInterval(() => {
    if (isDuringDate()) {
      setBadge(RealtimeFundcode, true, type);
    } else {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#4285f4" });
    }
  }, time);
};

var endInterval = () => {
  clearInterval(Interval);
  chrome.browserAction.setBadgeText({ text: "" });
};

var runStart = (RealtimeFundcode, RealtimeIndcode) => {
  if (showBadge == 1 && BadgeContent == 1) {
    if (RealtimeFundcode) {
      startInterval(RealtimeFundcode);
    } else {
      endInterval();
    }
  } else if (showBadge == 1 && BadgeContent == 2) {
    startInterval(null, 2);
  } else if (showBadge == 1 && BadgeContent == 3) {
    if (RealtimeIndcode) {
      startInterval(RealtimeIndcode, 3);
    } else {
      endInterval();
    }
  } else {
    endInterval();
  }
};

var monitorData = (url, timestamp, fund, monitorFund4, averageMa4) => {
  axios.get(url).then(res => {
    var datas = res.data.Datas;
    datas.reverse();
    monitorFund4[fund.code] = datas;
    monitorFund4.timestamp = timestamp;
    chrome.storage.local.set({ monitorFund4: monitorFund4 });
    const maDatas = res.data.Datas;
    var ma5arr = [],
      ma10arr = [],
      ma20arr = [];
    for (let i = 0; i < res.data.TotalCount; i++) {
      var ma5day = maDatas.slice(i, 5 + i);
      var ma5total = ma5day.reduce(
        (prev, cur) => prev + parseFloat(cur.DWJZ),
        0
      );
      var ma5 = { date: ma5day[0].FSRQ, average: (ma5total / 5).toFixed(4) };
      ma5arr.push(ma5);
      var ma10day = maDatas.slice(i, 10 + i);
      var ma10total = ma10day.reduce(
        (prev, cur) => prev + parseFloat(cur.DWJZ),
        0
      );
      var ma10 = {
        date: ma10day[0].FSRQ,
        average: (ma10total / 10).toFixed(4)
      };
      ma10arr.push(ma10);
      var ma20day = maDatas.slice(i, 20 + i);
      var ma20total = ma20day.reduce(
        (prev, cur) => prev + parseFloat(cur.DWJZ),
        0
      );
      var ma20 = {
        date: ma20day[0].FSRQ,
        average: (ma20total / 20).toFixed(4)
      };
      ma20arr.push(ma20);
    }
    averageMa4.timestamp = timestamp;
    averageMa4[fund.code] = {
      ma5arr: ma5arr,
      ma10arr: ma10arr,
      ma20arr: ma20arr
    };
    chrome.storage.local.set({ averageMa4: averageMa4 });
  });
};

var getData = () => {
  var _this = this;
  // 拦截请求并修改指定请求头信息
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      if (
        details.url.indexOf(
          "fundmobapi.eastmoney.com/FundMNewApi/FundMNInverstPosition"
        ) !== -1 ||
        details.url.indexOf(
          "fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo"
        ) !== -1
      )
        iPhone_OS_13_2_3_like_Mac_OS_X(details);
      // 转换请求头为手机模式
      else Windows_NT_10_0_Win64_x64(details);
      if (details.url === "https://api.fund.eastmoney.com/favor/GetFundsInfo")
        beforeSendHeaders(
          details,
          "https://favor.fund.eastmoney.com",
          "https://favor.fund.eastmoney.com/"
        );
      console.info(details.url);
      return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders", "extraHeaders"]
  );
  chrome.storage.sync.get(
    [
      "holiday",
      "fundListM",
      "RealtimeFundcode",
      "RealtimeIndcode",
      "showBadge",
      "BadgeContent",
      "BadgeType",
      "userId"
    ],
    res => {
      chrome.storage.local.get(
        ["positionArr2", "monitorFund4", "averageMa4"],
        reslocal => {
          RealtimeFundcode = res.RealtimeFundcode ? res.RealtimeFundcode : null;
          RealtimeIndcode = res.RealtimeIndcode ? res.RealtimeIndcode : null;
          fundListM = res.fundListM ? res.fundListM : [];
          var positionArr = reslocal.positionArr2 ? reslocal.positionArr2 : [];
          showBadge = res.showBadge ? res.showBadge : 1;
          BadgeContent = res.BadgeContent ? res.BadgeContent : 1;
          BadgeType = res.BadgeType ? res.BadgeType : 1;
          if (res.userId) {
            userId = res.userId;
          } else {
            userId = getGuid();
            chrome.storage.sync.set({ userId: userId });
          }
          if (res.holiday) {
            holiday = res.holiday;
            runStart(RealtimeFundcode, RealtimeIndcode);
          } else {
            getHoliday()
              .then(res => {
                chrome.storage.sync.set({ holiday: res.data }, () => {
                  holiday = res.data;
                  runStart(RealtimeFundcode, RealtimeIndcode);
                });
              })
              .catch(err => {
                chrome.storage.sync.set({ holiday: {} }, () => {
                  holiday = {};
                  runStart(RealtimeFundcode, RealtimeIndcode);
                });
              });
          }
          let fundStr = fundListM.map(val => val.code).join(",");
          let url =
            "https://fundmobapi.eastmoney.com/FundMNewApi/FundMNFInfo?pageIndex=1&pageSize=200&plat=Android&appType=ttjj&product=EFund&Version=1&deviceid=" +
            userId +
            "&Fcodes=" +
            fundStr;
          axios.get(url).then(res => {
            res.data.Datas.forEach(val => {
              let slt = fundListM.filter(item => item.code === val.FCODE)[0];
              if (slt.fvest != null && slt.fvest.cvt) {
                let next = new Date(slt.fvest.next).getTime();
                let datestr = formatDateTime(new Date(), "yyyy-MM-dd");
                let date = new Date(datestr).getTime();
                if (
                  !checkHoliday(new Date()) &&
                  !isWeekDate() &&
                  next <= date
                ) {
                  let NAV = isNaN(val.NAV) ? null : val.NAV;
                  let addNum = (slt.fvest.addFundAmount / NAV).toFixed(2);
                  let num = slt.num ? slt.num : 0;
                  slt.num =
                    (parseFloat(addNum) + parseFloat(num)).toFixed(2) + "";
                  slt.fvest.next = finvestWeekDay(
                    slt.fvest.finvestWeek,
                    slt.fvest.finvestDay
                  );
                  let count = slt.fvest.count == null ? 0 : slt.fvest.count;
                  slt.fvest.count = parseInt(count) + 1;
                  chrome.storage.sync.set({ fundListM: fundListM });
                  var fundList = positionArr[val.FCODE];
                  var obj = {
                    date: datestr,
                    type: "finfund",
                    equity: NAV,
                    amount: parseFloat(slt.fvest.addFundAmount).toFixed(2),
                    quota: addNum,
                    rates: slt.fvest.rates
                  };
                  if (fundList != null) fundList.push(obj);
                  else fundList = new Array(obj);
                  positionArr[val.FCODE] = fundList;
                  chrome.storage.local.set({ positionArr2: positionArr });
                }
              }
            });
          });
          var monitorFund4 = reslocal.monitorFund4 ? reslocal.monitorFund4 : {};
          var averageMa4 = reslocal.averageMa4 ? reslocal.averageMa4 : {};
          // 加载基础数据
          let timestamp = new Date(
            formatDateTime(new Date(), "yyyy-MM-dd")
          ).getTime();
          if (
            monitorFund4.timestamp == null ||
            monitorFund4.timestamp < timestamp
          ) {
            (monitorFund4 = {}), (averageMa4 = {});
            for (let i = 0; i < fundListM.length; i++) {
              let val = fundListM[i];
              let url1 = `https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${
                val.code
              }&RANGE=3n&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${new Date().getTime()}`;
              monitorData(url1, timestamp, val, monitorFund4, averageMa4);
            }
          } else if (
            fundListM.filter(v => monitorFund4[v.code] == null).length >= 1
          ) {
            let esclist = fundListM.filter(v => monitorFund4[v.code] == null);
            for (let i = 0; i < esclist.length; i++) {
              let val = esclist[i];
              let url1 = `https://fundmobapi.eastmoney.com/FundMApi/FundNetDiagram.ashx?FCODE=${
                val.code
              }&RANGE=3n&deviceid=Wap&plat=Wap&product=EFund&version=2.0.0&_=${new Date().getTime()}`;
              monitorData(url1, timestamp, val, monitorFund4, averageMa4);
            }
          }
          console.info(monitorFund4);
          console.info(averageMa4);
          // chrome.storage.local.remove(['monitorFund1','monitorFund2','monitorFund3','monitorFund5','monitorFund6','monitorFund7','monitorFund8'], function() {
          //     console.log('键 "myKey" 已被删除');
          //     chrome.storage.local.get(null, (res) => {
          //         console.info( res);
          //     });
          // });
        }
      );
    }
  );
};

getData();

chrome.contextMenus.create({
  title: "以独立窗口模式打开",
  contexts: ["browser_action"],
  onclick: () => {
    chrome.windows.create(
      {
        url: chrome.runtime.getURL("popup/popup.html"),
        width: 700,
        height: 550,
        top: 200,
        type: "popup"
      },
      function(e) {
        chrome.windows.update(e.id, {
          focused: true
        });
      }
    );
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "DuringDate") {
    let DuringDate = isDuringDate();
    sendResponse({ farewell: DuringDate });
  }
  if (request.type == "DuringWeekHolidayDate") {
    let DuringWeekDate = isWeekDate();
    if (!DuringWeekDate) DuringWeekDate = checkHoliday(new Date());
    sendResponse({ farewell: DuringWeekDate });
  }
  if (request.type == "refresh") {
    getData();
  }
  if (request.type == "refreshHoliday") {
    holiday = request.data;
  }
  if (request.type == "refreshBadgeAllGains") {
    let allAmount = 0;
    let allGains = 0;
    let sumNum = 0;
    let datestr = formatDateTime(
      new Date(Number(request.data.Expansion.bjTime) * 1000),
      "yyyy-MM-dd hh:mm"
    );
    // console.info("=========================refreshBadgeAllGains======================")
    request.data.Data.KFS.forEach(val => {
      let slt = fundListM.filter(item => item.code == val.FCODE)[0];
      let num = slt == null ? 0 : slt.num;
      let NAV = isNaN(val.DWJZ) ? null : val.DWJZ;
      allAmount += NAV * num;
      var sum = 0;
      if (
        //(val.GSZ === "--" && val.GSZZL === "--" && val.GZTIME === "--") ||
        //(val.gsz === null && val.gszzl === null && val.GZTIME === null  ||
        (val.gsz === "" && val.gszzl === "") ||
        val.FSRQ === datestr.substr(0, 10) ||
        funCurDate() <= new Date().setHours(9, 30, 0) ||
        isWeekDate() ||
        checkHoliday(new Date())
      ) {
        let NAVCHGRT = isNaN(val.RZDF) ? 0 : val.RZDF;
        sum = (NAV - NAV / (1 + NAVCHGRT * 0.01)) * num;
      } else {
        let gsz = isNaN(val.gsz) ? null : val.gsz;
        if (gsz != null && NAV != null) {
          sum = (gsz - NAV) * num;
        }
      }
      allGains += sum;
      // console.info(sum + " " + val.SHORTNAME)
      // console.info("持有总金额 " + allAmount + " 今日赚 " + (allGains - sum) + " " + val.SHORTNAME)
    });
    let textStr = null;
    if (BadgeType == 1) {
      if (allAmount == 0 || allGains == 0) {
        textStr = "0";
        sumNum = "0";
      } else {
        textStr = ((100 * allGains) / allAmount).toFixed(2);
        sumNum = textStr;
      }
    } else {
      textStr = formatNum(allGains);
      sumNum = allGains;
    }

    chrome.browserAction.setBadgeText({ text: textStr });
    let color = isDuringDate()
      ? sumNum >= 0
        ? "#F56C6C"
        : "#4eb61b"
      : "#4285f4";
    chrome.browserAction.setBadgeBackgroundColor({
      color: color
    });
  }
  if (request.type == "endInterval") {
    endInterval();
  }
  if (request.type == "startInterval") {
    startInterval(request.id);
  }
  if (request.type == "refreshOption") {
    switch (request.data.type) {
      case "showBadge":
        showBadge = request.data.value;
        break;
      case "BadgeContent":
        BadgeContent = request.data.value;
        break;
      case "BadgeType":
        BadgeType = request.data.value;
        break;
    }
    getData();
  }
  if (request.type == "refreshBadge") {
    let textstr = null;
    let num = 0;
    if (BadgeType == 1) {
      textstr = request.data.gszzl;
      num = request.data.gszzl;
    } else {
      num = request.data.gains;
      textstr = formatNum(request.data.gains);
    }
    chrome.browserAction.setBadgeText({
      text: textstr
    });
    let color = isDuringDate() ? (num >= 0 ? "#F56C6C" : "#4eb61b") : "#4285f4";
    chrome.browserAction.setBadgeBackgroundColor({
      color: color
    });
  }
});
