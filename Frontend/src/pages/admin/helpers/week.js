export function getCurrentWeek() {
    let today = new Date();
    let todayIndex = today.getDay();
    let array = [today];
    let prevDays = [];
    for (let i = 0; i < 7; i++) {
        if (i !== todayIndex) {
            let date = new Date();
            if (i < todayIndex) {
                date.setDate(today.getDate() - (todayIndex - i));
                prevDays.push(date);
            } else if (i > todayIndex) {
                date.setDate(today.getDate() + (i - todayIndex));
                array.push(date);
            }
        }
    }
    return prevDays.concat(array);
}

export function getNextWeek(date) {
    let array = [];
    for (let i = 1; i <= 7; i++) {
        let newDate = new Date(date.toDateString());
        newDate.setDate(date.getDate() + i);
        array.push(newDate);
    }
    return array;
}

export function getPreviousWeek(date) {
    let array = [];
    for (let i = 1; i <= 7; i++) {
        let newDate = new Date(date.toDateString());
        newDate.setDate(date.getDate() - i);
        array.unshift(newDate);
    }
    return array;
}

export function getWeek(d) {
    let dateIndex = d.getDay();
    let array = [d];
    let prevDays = [];
    for (let i = 0; i < 7; i++) {
        if (i !== dateIndex) {
            let date = new Date(d);
            if (i < dateIndex) {
                date.setDate(d.getDate() - (dateIndex - i));
                prevDays.push(date);
            } else if (i > dateIndex) {
                date.setDate(d.getDate() + (i - dateIndex));
                array.push(date);
            }
        }
    }
    return prevDays.concat(array);
}
