class Store{
    // save alarm to storage
    saveAlarm(alarm) {
        const alarms = this.getAlarms();
        alarms.push(alarm);
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    // get alarms from storage
    getAlarms() {
        let alarms;
        if (localStorage.getItem('alarms') === null) {
            alarms = [];
        } else {
            alarms = JSON.parse(localStorage.getItem('alarms'));
        }
        return alarms;
    }

    // toggle checker
    toggleCheck(id, check) {
        const alarms = this.getAlarms();
        alarms.forEach((alarm) => {
            if (id === alarm.id) {
                alarm.isChecked = check;
            }
        });
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }

    // remove from storge
    removeAlarm(id) {
        const alarms = this.getAlarms();
        alarms.forEach((alarm, i) => {
            if (id === alarm.id) {
                alarms.splice(i, 1);
            }
        });
        localStorage.setItem('alarms', JSON.stringify(alarms));
    }
}