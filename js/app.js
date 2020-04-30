class Alarm{
    constructor(id, setTime, isChecked) {
        this.id = id;
        this.setTime = setTime;
        this.isChecked = isChecked
    }
}

// Variables
const edit = document.querySelector('.edit');
const save = document.querySelector('.save');
const update = document.querySelector('.update');
const add = document.querySelector('.add');
const cancel = document.querySelector('.cancel');
const content = document.querySelector('.content');
const modal = document.querySelector('.modal');
const done = document.querySelector('.done');
const item = document.querySelector('.item');
const timeInput = document.querySelector('#time-input');
const toggleDivs = document.querySelectorAll('.toggle-div');
const audio = new Audio('./sound/alarm.mp3');


// Event Listeners
// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const store = new Store();
    const ui = new UI();
    const alarms = store.getAlarms();
    alarms.forEach((alarm) => {
        ui.displayAlarm(alarm);
    });

    startAlarm();
});

// start timeout
function startTimer() {
    timing = setTimeout(startAlarm, 1000);
}

// clear timeout
function stopTimer() {
    clearTimeout(timing);
}

// start alarm
function startAlarm() {
    const ul = document.querySelector('.alarm-collections');
    const lis = ul.querySelectorAll('.alarm-item');
    const time = showTime();
    // start timeout
    startTimer();
    lis.forEach((li) => {
        const alarmTime = li.lastElementChild.previousElementSibling.firstElementChild.innerText;
        const toggle = li.lastElementChild.previousElementSibling.lastElementChild.firstElementChild.firstElementChild.firstElementChild;
        if (toggle.checked && alarmTime == time) {
            // clear timeout
            stopTimer();
            // play alarm audio
            setTimeout(() => {
               audio.play(); 
            })
            // start timer after 60s
            setTimeout(startAlarm, 60000);
        }
    });
}

// Add Button event
add.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Edit Button event
edit.addEventListener('click', () => {
    const ul = document.querySelector('.alarm-collections');
    const lis = ul.querySelectorAll('.alarm-item');
    lis.forEach((li) => {
        // show delete buttons
        li.firstElementChild.style.display = 'block';
        // hide toggle
        li.lastElementChild.previousElementSibling.lastElementChild.firstElementChild.style.display = 'none';
        // display enter buttons
        li.lastElementChild.previousElementSibling.lastElementChild.lastElementChild.style.display = 'block';
        // add view mode
        li.lastElementChild.previousElementSibling.classList += ' view-mode';
  
    });
    edit.style.display = 'none';
    done.style.display = 'block';
});

// Done Button Event
done.addEventListener('click', () => {
    const ul = document.querySelector('.alarm-collections');
    const lis = ul.querySelectorAll('.alarm-item');
    lis.forEach((li) => {
        li.firstElementChild.style.display = 'none';
        li.lastElementChild.previousElementSibling.lastElementChild.firstElementChild.style.display = 'block';
        li.lastElementChild.previousElementSibling.lastElementChild.lastElementChild.style.display = 'none';
        li.lastElementChild.previousElementSibling.classList.remove('view-mode');
    });
    edit.style.display = 'block';
    done.style.display = 'none';
});


// Cancel Button event
cancel.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Save Button Event
save.addEventListener('click', addAlarm);

// delete alarm event
content.addEventListener('click', deleteAlarm);

// Edit alarm event
content.addEventListener('click', editAlarm);

// update button event
update.addEventListener('click', updateAlarm);

// Toggle Event
content.addEventListener('change', checker);

// add alarm to dom
function addAlarm() {
    const id = getId();
    const setTime = timeInput.value;
    const isChecked = false;
    const alarm = new Alarm(id, setTime, isChecked);
    const ui = new UI();
    const store = new Store();
    // display alarm
    ui.displayAlarm(alarm);
    // save alarm to storage
    store.saveAlarm(alarm);
    // hide modal
    modal.style.display = 'none';
}

// Edit Alarm
function editAlarm(e) {
    if (e.target.classList.contains('view-mode')) {
        const time = e.target.firstElementChild.innerText.split(":");
        const id = e.target.parentElement.lastElementChild.textContent;
        const ui = new UI();
        let hours = parseInt(time[0]);
        let mins = parseInt(time[1].slice(0, 2));
        let amPm = time[1].slice(2);

        if (amPm === 'PM' && hours === 12) {
            hours = hours;            
        } else if (amPm === 'PM' && hours !== 12) {
            hours = hours + 12;
        } else if (amPm === 'AM' && hours === 12) {
            hours = hours - 12;
        }
        const initTime = `${ui.addZero(hours)}:${ui.addZero(mins)}`;
        timeInput.value = initTime;
        modal.style.display = 'block';
        save.style.display = 'none';
        update.style.display = 'block';
        // show id of alarm to be edited
        document.querySelector('#id-nav').innerText = id;
   }
}

// Update Alarm
function updateAlarm(e) {
    const id = e.target.parentElement.lastElementChild.textContent;
    const ui = new UI();
    const store = new Store();
    const alarms = store.getAlarms();
    const ul = document.querySelector('.alarm-collections');
    const lis = ul.querySelectorAll('.alarm-item');
    
    // Update alarm on DOM
    lis.forEach((li) => {
        const idDom = li.lastElementChild.textContent;
        if (id === idDom) {
            li.firstElementChild.nextElementSibling.firstElementChild.innerHTML = ui.updateAlarmUi(timeInput.value);
        }
    });
    // update alarm in storage
    alarms.forEach((alarm, i) => {
        if (alarm.id === id) {
            alarm.setTime = timeInput.value;
       }
    });
    localStorage.setItem('alarms', JSON.stringify(alarms));

    modal.style.display = 'none';
    update.style.display = 'none';
    save.style.display = 'block';
}

// delete alarm
function deleteAlarm(e) {
    if (e.target.classList.contains('delete')) {
        const store = new Store();
        const id = e.target.parentElement.parentElement.lastElementChild.textContent;
        e.target.parentElement.parentElement.remove();
        // remove alarm from storage
        store.removeAlarm(id);
    }
}

// Toggle checker
function checker(e) {
    const id = e.target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.textContent;
    const store = new Store();

    if (e.target.checked) {
        store.toggleCheck(id, true);
    } else {
        store.toggleCheck(id, false);
    }
}

// showTime
function showTime() {
    const today = new Date();
    let hours = today.getHours(),
        mins = today.getMinutes(),
        secs = today.getSeconds();
    let amPm;
    if (hours >= 12) {
        amPm = 'PM';
    } else if (hours < 12) {
        amPm = 'AM';
    }
    // change to 12 hours
    hours = hours % 12 || 12;
    const time = document.querySelector('#time');
    const modaltime = document.querySelector('#modal-time');
    const ui = new UI();
    let html = `
    ${hours}<span>:</span>${ui.addZero(mins)}<span>:</span>${ui.addZero(secs)}<span class="amPm"> ${amPm}</span>
    `;
    time.innerHTML = html;
    modaltime.innerHTML = html;
    const alarmTi = `${hours}:${ui.addZero(mins)}${amPm}`;
    setTimeout(showTime, 1000);
    return alarmTi;
}

// get random Ids
function getId() {
    return this.hex(Date.now() / 1000) +
        ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16))
}
// round up
function hex(value) {
    return Math.floor(value).toString(16)
}

showTime();