const monthsArr = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];


export function getCurrentMonth(arr) {
    let months = [];
    arr.forEach((d) => {
        if (!months.includes(monthsArr[d.getMonth()])) {
            months.push(monthsArr[d.getMonth()]);
        }
    });
    if (months.length === 1) return months[0];
    return `${months[0]} - ${months[1]}`;
}

export function getCurrentYear(arr) {
    let years = [];
    arr.forEach((d) => {
        let year = d.getFullYear() + 543; // Convert to Buddhist Era
        if (!years.includes(year)) {
            years.push(year);
        }
    });
    if (years.length === 1) return years[0];
    return `${years[0]} - ${years[1]}`;
}


export function onlyDayNum(d) {
    let date = d.toString().slice(4, 15).split(" ");
    if (date[1][0] === "0") {
        date[1] = date[1].slice(1);
    }
    return date[1];
}

export function isToday(d) {
    let now = new Date();
    return d.toDateString() === now.toDateString();
}

export function parseActiveDate(d) {
    let date = d.toDateString().split(" ");
    let month = monthsArr[d.getMonth()];
    return `${month} ${date[2][0] === "0" ? date[2][1] : date[2]}, ${date[3]}`;
}
