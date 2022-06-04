// selecting all set time input fields to loop over them
const timerInputs = document.querySelectorAll('.timer-input');

// input fields
let hoursInput = document.querySelector('#hours');
let minuteInput = document.querySelector('#minutes');
let secondsInput = document.querySelector('#seconds');

// helper buttons
const startBtn = document.querySelector('.start');
const pauseBtn = document.querySelector('.pause')
const cancelBtn = document.querySelector('.cancel')

// columns used to show the current time remaining
let countDownHours = document.querySelector('#countDown-hours')
let countDownMinutes = document.querySelector('#countDown-minutes')
let countDownSeconds = document.querySelector('#countDown-seconds')

// timer & set time container
let setTimerContainer = document.querySelector('#set-time-container')
let timerContainer = document.querySelector('.timer-container')

// used variable in counting down process
let reqHours = 0
let reqMinutes = 0
let reqSeconds = 0

// times in milliseconds used for the setInterval
let hoursInMS = 0
let minutesInMs = 0
let secondsInMs = 0

// total time requested in milliseconds
let timeInMillieSeconds;

// the setInterval fun
let countDownInterval;

// start button tap index count
let startBtnIndexCount = 0

const initTimerValues = () => {
    for (let i = 0; i < timerInputs.length; i++) {
        timerInputs[i].addEventListener('blur', (e) => {
            if (e.target.value <= 59 && e.target.value <= 99) {
                if (e.target.id === 'hours') {
                    reqHours = e.target.value
                    hoursInMS = e.target.value * 60 * 60 * 1000
                } else if (e.target.id === 'minutes') {
                    reqMinutes = e.target.value
                    minutesInMs = e.target.value * 60 * 1000;
                } else if (e.target.id === 'seconds') {
                    reqSeconds = e.target.value
                    secondsInMs = e.target.value * 1000;
                }
                timeInMillieSeconds = hoursInMS  + minutesInMs + secondsInMs
            }
        })
    }
}

initTimerValues()

const removeAnimations = () => {
    setTimerContainer.style.opacity = '1'
    startBtn.classList.remove('hide-start-btn')
    pauseBtn.classList.remove('show-pause-btn')
    cancelBtn.classList.remove('show-cancel-btn')
}

const addAnimations = () => {
    setTimerContainer.style.opacity = '0'
    startBtn.classList.add('hide-start-btn')
    pauseBtn.classList.add('show-pause-btn')
    cancelBtn.classList.add('show-cancel-btn')
}

// using another variables and assigning the input values to them (reset process)
// so that if user want to set the same time for the timer again it can be set via the INPUT fields
// while using the other variables for the count down process.
const resetTimerVariables = () => {
    reqHours = hoursInput.value
    reqMinutes = minuteInput.value
    reqSeconds = secondsInput.value
    timeInMillieSeconds = hoursInMS + minutesInMs + secondsInMs
    startBtnIndexCount = 0
}

const countDown = () => {
    if (timeInMillieSeconds > 0) {
        timeInMillieSeconds-=1000
        if (hoursInput.value > 0) {
            reqHours <= 10 ? countDownHours.innerText = `0${reqHours}:` : countDownHours.innerText = `${reqHours}:`
        }
        if (reqHours > 0 && reqMinutes === 0 && reqSeconds === 0) {
            reqHours <= 10 ? countDownHours.innerText = `0${--reqHours}:` : countDownHours.innerText = `${--reqHours}:`
            reqMinutes = 60
        }

        if (minuteInput.value > 0) {
            reqMinutes <= 10 ? countDownMinutes.innerText = `0${reqMinutes}:` : countDownMinutes.innerText = `${reqMinutes}:`
        }
        if (reqMinutes > 0 && reqSeconds === 0) {
            reqMinutes <= 10 ? countDownMinutes.innerText = `0${--reqMinutes}:` : countDownMinutes.innerText = `${--reqMinutes}:`
            reqSeconds = 60
        }

        if (secondsInput.value > 0) {
            if (reqSeconds <= 5 && Number(reqMinutes) === 0 && Number(reqHours) === 0) {
                // change animation and timer clock color theme
                countDownSeconds.innerText = `0${--reqSeconds}`
                timerContainer.classList.add('change-theme-color')
            } else if (reqSeconds <= 10) {
                countDownSeconds.innerText = `0${--reqSeconds}`
            } else {
                countDownSeconds.innerText = `${--reqSeconds}`
            }
        }
    } else {
        removeAnimations()
        timerContainer.style.removeProperty('animation')
        timerContainer.classList.remove('change-theme-color')
        resetTimerVariables()
        clearInterval(countDownInterval)
        navigator.vibrate([500,200,500])
    }
}

startBtn.addEventListener('click', (e) => {
    if (
        ((hoursInput.value <= 99 && hoursInput.value > 0) ||
        (minuteInput.value <= 59 && minuteInput.value > 0) ||
        (secondsInput.value <= 59 && secondsInput.value > 0))
        && timeInMillieSeconds
    ) {
        startBtnIndexCount++
        // here i'm setting a condition to make sure that if a user clicked more than
        // once quickly on the start btn it only RUN ONCE
        // while also making sure that this condition only runs when there's a valid inputs
        if (startBtnIndexCount === 1) {
            addAnimations()
            timerContainer.style.animation = 'up-down 1.5s ease-in-out 0s normal infinite forwards running'
            countDownInterval = setInterval(() => {
                countDown()
            }, 1000)
        }
    }
})

pauseBtn.addEventListener('click', (e) => {
    if (pauseBtn.innerText === 'pause') {
        timerContainer.style.animationPlayState = 'paused';
        pauseBtn.classList.add('resume')
        pauseBtn.innerText = 'Resume'
        clearInterval(countDownInterval)
    } else if (pauseBtn.innerText === 'Resume') {
        timerContainer.style.animationPlayState = 'running';
        pauseBtn.classList.remove('resume')
        pauseBtn.innerText = 'pause'
        countDownInterval = setInterval(() => {
            countDown()
        }, 1000)
    }
})

const resetEverything = () => {
    resetTimerVariables()
    countDownHours.innerText = '00:'
    countDownMinutes.innerText = '00:'
    countDownSeconds.innerText = '00'
}

cancelBtn.addEventListener('click', (e) => {
    resetEverything()
    removeAnimations()
    timerContainer.style.removeProperty('animation')
    timerContainer.classList.remove('change-theme-color')
    clearInterval(countDownInterval)
})
