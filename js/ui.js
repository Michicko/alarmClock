class UI {
    // display alarm to the DOM
    displayAlarm(alarm) {
        let html = `
        <li class="alarm-item">
                    <div class="del">
                        <p class="delete btn">-</p>
                    </div>
                    <div class="item">
                        <p class="list-time">${this.checkAmPm(alarm.setTime).hour}<span>:</span>${this.addZero(this.checkAmPm(alarm.setTime).minutes)}<span class="min">${this.checkAmPm(alarm.setTime).amPm}</span></p>
                        <div class="set">
                            <div class="toggle-div">
                                <label class="toggle">
                                    <input type="checkbox" id="start" ${this.toggleChecked(alarm)}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="enter">></div>
                        </div>
                    </div>
                    <div class="disp-id">${alarm.id}</div>
                </li>
        `;
        document.querySelector('.alarm-collections').innerHTML += html;
    }

    // update alarm
    updateAlarmUi(timeInput) {
    let html = `
    ${this.checkAmPm(timeInput).hour}<span>:</span>${this.addZero(this.checkAmPm(timeInput).minutes)}<span class="min">${this.checkAmPm(timeInput).amPm}</span>
    `;
        return html;
    }

    // change to 12 hours and check if amPm
    checkAmPm(alarm) {
        const currentTime = alarm;
        let prevTime = currentTime.split(':');
        let twentFourHour = parseInt(prevTime[0]);
        let minutes = parseInt(prevTime[1]);
        let amPm;
        let hour = twentFourHour % 12 || 12;
        if (twentFourHour >= 12) {
            amPm = 'PM';
        } else if (twentFourHour < 12) {
            amPm = 'AM';
        }
        return {
            hour,
            minutes,
            amPm
        }
    }
    
    // if toggle is checked
    toggleChecked(alarm) {
        if (alarm.isChecked) {
            return 'checked';
        } else {
            return '';
        }
    }

    // Add zero
    addZero(n) {
        return (parseInt(n, 10) < 10 ? '0' : '') + n;
    }
}