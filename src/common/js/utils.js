/**
 * 获取下周时间
 * @returns {string[]}
 */
export function handleGetNextvWeek() {
    const Time = new Date()
    let weekNum = Time.getDay()
    weekNum = weekNum == 0 ? 7 : weekNum
    let fitstDate = new Date(Time.getTime() + (7 - weekNum + 1) * 24 * 60 * 60 * 1000)
    let lastDate = new Date(Time.getTime() + (7 - weekNum + 7) * 24 * 60 * 60 * 1000)
    let startDate = `${fitstDate.getFullYear()}-${
        fitstDate.getMonth() + 1 < 10 ? '0' + (fitstDate.getMonth() + 1) : fitstDate.getMonth() + 1
    }-${
        fitstDate.getDate() < 10 ? '0' + fitstDate.getDate() : fitstDate.getDate()
    }`
    let endDate = `${lastDate.getFullYear()}-${
        lastDate.getMonth() + 1 < 10 ? '0' + (lastDate.getMonth() + 1) : lastDate.getMonth() + 1
    }-${
        lastDate.getDate() < 10 ? '0' + lastDate.getDate() : lastDate.getDate()
    }`
    return [startDate, endDate]
}

export function formatDateTime(date, format) {
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
        'H+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
        a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
        A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
            );
        }
    }
    return format;
}

/**
 * 数字过滤
 * @param value
 * @returns {*}
 */
export function numberReplace(value) {
    if (value == null || value === "" || typeof (value) == 'number') return value;
    value = value.replace(/[^\d.]/g, '');  //字符不能是字母
    value = value.replace(/^\./g, '');  //第一个字符不能是.
    value = value.replace(/\.{2,}/g, '.') // 不能连续输入.
    value = value.replace(/(\.\d+)\./g, '$1') // .后面不能再输入.
    value = value.replace(/(-)\./g, '$1') // -后面不能输入.
    value = value.replace(/\-{2,}/g, '-') // -只能保留一个
    value = value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
    value = value.replace(/-(0){2,}/g, "$1") // 不能出现-00,-001,-0001类似
    value = value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
    value = value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
    value = value.replace(/(\d{15})\d*/, '$1') // 最多保留15位整数
    value = value.replace(/(\.\d{4})\d*/, '$1')// 最多保留2位小数
    return parseFloat(value);
}

/**
 * 获取当前的下一个执行日期
 * @param finvestWeek
 * @param finvestDay
 * @returns {string}
 */
export function finvestWeekDay(finvestWeek, finvestDay) {
    var nowDate = new Date();
    let val = finvestWeek;
    let week = new Date(handleGetNextvWeek()[0]);
    let nextStr = "";
    if (val == 3) {
        let mtday = nowDate.setDate(nowDate.getDate() + 1);//添加天数
        nextStr = formatDateTime(new Date(mtday), 'yyyy-MM-dd');
    } else if (val == 0) {
        let weedDay = week.setDate(week.getDate() + parseInt(finvestDay));
        nextStr = formatDateTime(new Date(weedDay), 'yyyy-MM-dd');
    } else if (val == 1) {
        let weedDay = week.setDate(week.getDate() + 7 + parseInt(finvestDay));
        nextStr = formatDateTime(new Date(weedDay), 'yyyy-MM-dd');
    } else if (val == 2) {
        let month = new Date(nowDate.setDate(1))
        var monthNoeDayDate = new Date(month.setMonth(month.getMonth() + 1));
        var monthDay = monthNoeDayDate.setDate(monthNoeDayDate.getDate() + parseInt(finvestDay));
        nextStr = formatDateTime(new Date(monthDay), 'yyyy-MM-dd');
    }
    return nextStr;
}

/**
 * 获取当前时间
 */
export function funCurDate() {
    //时区转换为东8区
    let zoneOffset = 8;
    let offset8 = new Date().getTimezoneOffset() * 60 * 1000;
    let nowDate8 = new Date().getTime();
    return new Date(nowDate8 + offset8 + zoneOffset * 60 * 60 * 1000);
}

/**
 * 请求处理修改
 * @param details
 * @param RefererUrl
 * @param OriginUrl
 */
export function beforeSendHeaders(details, RefererUrl, OriginUrl) {
    var existsReferer = false, existsOrigin = false;
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Referer') {
            existsReferer = true;
            details.requestHeaders[i].value = RefererUrl;
            break;
        }
    }
    if (!existsReferer) details.requestHeaders.push({name: 'Referer', value: RefererUrl})
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Origin') {
            existsOrigin = true;
            details.requestHeaders[i].value = OriginUrl;
            break;
        }
    }
    if (!existsOrigin) details.requestHeaders.push({name: 'Origin', value: OriginUrl})
}

/**
 * User-Agent
 * 手机
 */
export function iPhone_OS_13_2_3_like_Mac_OS_X(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
            details.requestHeaders[i].value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/94.0.4606.71';
            break;
        }
    }
}

/**
 * User-Agent
 * 电脑
 */
export function Windows_NT_10_0_Win64_x64(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
            details.requestHeaders[i].value = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
            break;
        }
    }
}

/**
 * UUID(Universally Unique IDentifier) ,GUID 是一种由算法生成的二进制长度为128位的数字标识符。
 * @param len
 * @param radix
 * @returns {string}
 */
export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
