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

const circleSvg = document.querySelector('circle')

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
let mainSetInterval;

// start button tap index count
let startBtnIndexCount = 0

let bodyElement = document.body
// -------------------------------- Helper Functions ---------------------------------

const removeAnimations = () => {
    setTimerContainer.style.opacity = '1'
    startBtn.classList.remove('hide-start-btn')
    pauseBtn.classList.remove('show-pause-btn')
    cancelBtn.classList.remove('show-cancel-btn')
    timerContainer.style.removeProperty('animation')
    timerContainer.classList.remove('change-theme-color')
    circleSvg.classList.remove('change-circle-color')
    circleSvg.style.strokeDashoffset = '0%'
    bodyElement.style.setProperty('--gradient-opacity', '0')
}

const addAnimations = () => {
    setTimerContainer.style.opacity = '0'
    startBtn.classList.add('hide-start-btn')
    pauseBtn.classList.add('show-pause-btn')
    cancelBtn.classList.add('show-cancel-btn')
    timerContainer.style. animation = 'up-down 1.5s ease-in-out 0s normal infinite forwards running'
}

// using another variables and assigning the input values to them (reset process)
// so that if user want to set the same time for the timer again it can be set via the INPUT fields
// while using the other variables for the count down process.
const resetTimerVariables = () => {
    reqHours = Number(hoursInput.value)
    reqMinutes = Number(minuteInput.value)
    reqSeconds = Number(secondsInput.value)
    timeInMillieSeconds = hoursInMS + minutesInMs + secondsInMs
    startBtnIndexCount = 0
}

const resetTimerDisplayColumns = () => {
    countDownHours.innerText = '00:'
    countDownMinutes.innerText = '00:'
    countDownSeconds.innerText = '00'
}

const changeOrLeaveThemeColor = () => {
    if (reqSeconds <= 5 && reqHours === 0 && reqMinutes === 0) {
        timerContainer.classList.add('change-theme-color')
        circleSvg.classList.add('change-circle-color')
        bodyElement.style.setProperty('--gradient-opacity', '1')
    }
}
const resetEverything = () => {
    removeAnimations()
    resetTimerVariables()
}

const pauseOrResumeTimer = () => {
    pauseBtn.classList.toggle('resume')
    if (pauseBtn.innerText === 'pause') {
        timerContainer.style.animationPlayState = 'paused';
        pauseBtn.innerText = 'Resume'
        clearInterval(mainSetInterval)
    } else if (pauseBtn.innerText === 'Resume') {
        timerContainer.style.animationPlayState = 'running';
        pauseBtn.innerText = 'pause'
        mainSetInterval = setInterval(() => {
            mainFunction()
        }, 1000)
    }
}

// -------------------------------- Main Functions ---------------------------------

const initTimerValues = () => {
    for (let i = 0; i < timerInputs.length; i++) {
        timerInputs[i].addEventListener('blur', (e) => {
            if (e.target.id === 'hours') {
                reqHours = Number(e.target.value)
                hoursInMS = e.target.value * 60 * 60 * 1000
            } else if (e.target.id === 'minutes') {
                reqMinutes = Number(e.target.value)
                minutesInMs = e.target.value * 60 * 1000;
            } else if (e.target.id === 'seconds') {
                reqSeconds = Number(e.target.value)
                secondsInMs = e.target.value * 1000;
            }
            timeInMillieSeconds = hoursInMS  + minutesInMs + secondsInMs
        })
    }
}
initTimerValues()

const countDownTimeColumns = () => {
    if (reqHours > 0) {
        if (reqMinutes === 0 && reqSeconds === 0) {
            reqHours <= 10 ? countDownHours.innerText = `0${--reqHours}:` : countDownHours.innerText = `${--reqHours}:`
            reqMinutes = 60
        } else {
            reqHours <= 10 ? countDownHours.innerText = `0${reqHours}:` : countDownHours.innerText = `${reqHours}:`
        }
    }

    if (reqMinutes > 0) {
        if (reqMinutes > 0 && reqSeconds === 0) {
            reqMinutes <= 10 ? countDownMinutes.innerText = `0${--reqMinutes}:` : countDownMinutes.innerText = `${--reqMinutes}:`
            reqSeconds = 60
        } else {
            reqMinutes <= 10 ? countDownMinutes.innerText = `0${reqMinutes}:` : countDownMinutes.innerText = `${reqMinutes}:`
        }
    }

    if (reqSeconds > 0) {
        reqSeconds <=10 ? countDownSeconds.innerText = `0${--reqSeconds}` : countDownSeconds.innerText = `${--reqSeconds}`
    }
}

const calcAndChangeRingOffsetDynamically = () => {
    let totalTimeInSeconds = (hoursInMS + minutesInMs + secondsInMs) / 1000
    let requestedTimeInSeconds = (reqHours * 60 * 60) + (reqMinutes * 60) + reqSeconds
    // (126) indicates the needed stroke-dashoffset (in percentage) to make the outer circle ring full.
    let relativeRemainingTimePercentage = Math.abs(((requestedTimeInSeconds * 126) / totalTimeInSeconds) - 126)
    circleSvg.style.strokeDashoffset = `${relativeRemainingTimePercentage}%`
}

const mainFunction = () => {
    if (timeInMillieSeconds > 0) {
        timeInMillieSeconds-=1000
        countDownTimeColumns()
        calcAndChangeRingOffsetDynamically()
        changeOrLeaveThemeColor()
    } else {
        navigator.vibrate([500,200,500])
        resetEverything()
        clearInterval(mainSetInterval)
    }
}

// -------------------------------- Handle Event Listeners ---------------------------------

startBtn.addEventListener('click', (e) => {
    if (
        ((hoursInput.value <= 99 && hoursInput.value > 0) ||
        (minuteInput.value <= 59 && minuteInput.value > 0) ||
        (secondsInput.value <= 59 && secondsInput.value > 0)) &&
        timeInMillieSeconds
    ) {
        startBtnIndexCount++
        // here i'm setting a condition to make sure that if a user clicked more than
        // once quickly on the start btn the handle function RUN ONLY ONCE
        // while also making sure that this condition only runs when there's a valid inputs
        if (startBtnIndexCount === 1) {
            addAnimations()
            mainSetInterval = setInterval(() => {
                mainFunction()
            }, 1000)
        }
    }
})

pauseBtn.addEventListener('click', (e) => {
    pauseOrResumeTimer()
})

cancelBtn.addEventListener('click', (e) => {
    resetTimerDisplayColumns()
    resetEverything()
    clearInterval(mainSetInterval)
})
