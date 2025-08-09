document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('nav ul li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // animation
            document.getElementById(tabId).style.animation = 'fadeIn 0.5s ease';
        });
    });
    
    // Kalkulator functionality
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };
    
    const calculatorDisplay = document.querySelector('.calculator-display .current-operand');
    const previousOperandDisplay = document.querySelector('.calculator-display .previous-operand');
    const calcButtons = document.querySelectorAll('.calculator-buttons .calc-btn');
    
    function updateDisplay() {
        calculatorDisplay.textContent = calculator.displayValue;
    }
    
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;
        
        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }
    
    function inputDecimal(dot) {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }
    
    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);
        
        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            updatePreviousOperandDisplay();
            return;
        }
        
        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }
        
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        updatePreviousOperandDisplay();
    }
    
    function updatePreviousOperandDisplay() {
        if (calculator.operator) {
            previousOperandDisplay.textContent = `${calculator.firstOperand || ''} ${calculator.operator}`;
        } else {
            previousOperandDisplay.textContent = '';
        }
    }
    
    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return firstOperand / secondOperand;
            case '%':
                return firstOperand % secondOperand;
            default:
                return secondOperand;
        }
    }
    
    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        previousOperandDisplay.textContent = '';
    }
    
    function deleteLastDigit() {
        if (calculator.displayValue.length === 1) {
            calculator.displayValue = '0';
        } else {
            calculator.displayValue = calculator.displayValue.slice(0, -1);
        }
    }
    
    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const { value } = button.dataset;
            
            // Menambah click animation
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 100);
            
            switch (value) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case '=':
                    handleOperator(value);
                    break;
                case '.':
                    inputDecimal(value);
                    break;
                case 'AC':
                    resetCalculator();
                    break;
                case 'DEL':
                    deleteLastDigit();
                    break;
                default:
                    if (Number.isInteger(parseFloat(value))) {
                        inputDigit(value);
                    }
            }
            
            updateDisplay();
        });
    });
    
    // Konversi mata uang functionality
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('from-currency');
    const toCurrencySelect = document.getElementById('to-currency');
    const resultInput = document.getElementById('result');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-currencies');
    const rateInfo = document.getElementById('rate');
    const lastUpdated = document.getElementById('last-updated');
    
    // Exchange rates (in a real app, you would fetch these from an API)
    const exchangeRates = {
        USD: { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.15, IDR: 14450 },
        EUR: { USD: 1.18, EUR: 1, GBP: 0.86, JPY: 130.21, IDR: 17000 },
        GBP: { USD: 1.37, EUR: 1.16, GBP: 1, JPY: 151.52, IDR: 19800 },
        JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, JPY: 1, IDR: 131 },
        IDR: { USD: 0.000069, EUR: 0.000059, GBP: 0.000051, JPY: 0.0076, IDR: 1 }
    };
    
    function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }
        
        const rate = exchangeRates[fromCurrency][toCurrency];
        const result = amount * rate;
        
        resultInput.value = result.toFixed(4);
        rateInfo.textContent = `1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`;
        lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
    }
    
    function swapCurrencies() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        convertCurrency();
    }
    
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    amountInput.addEventListener('input', convertCurrency);
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);
    
    // Initialize currency converter
    convertCurrency();
    
    // Stopwatch functionality
    const stopwatch = {
        startTime: 0,
        elapsedTime: 0,
        timerInterval: null,
        isRunning: false,
        laps: []
    };
    
    const hoursDisplay = document.getElementById('hours');
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startBtn = document.getElementById('start-stopwatch');
    const pauseBtn = document.getElementById('pause-stopwatch');
    const resetBtn = document.getElementById('reset-stopwatch');
    const lapBtn = document.getElementById('lap-stopwatch');
    const lapsContainer = document.getElementById('laps');
    
    function formatTime(time) {
        return time.toString().padStart(2, '0');
    }
    
    function formatMilliseconds(time) {
        return time.toString().padStart(2, '0').slice(0, 2);
    }
    
    function updateDisplay() {
        const elapsed = stopwatch.elapsedTime;
        const milliseconds = Math.floor((elapsed % 1000) / 10);
        const seconds = Math.floor((elapsed / 1000) % 60);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        
        millisecondsDisplay.textContent = formatMilliseconds(milliseconds);
        secondsDisplay.textContent = formatTime(seconds);
        minutesDisplay.textContent = formatTime(minutes);
        hoursDisplay.textContent = formatTime(hours);
    }
    
    function startStopwatch() {
        if (!stopwatch.isRunning) {
            stopwatch.startTime = Date.now() - stopwatch.elapsedTime;
            stopwatch.timerInterval = setInterval(() => {
                stopwatch.elapsedTime = Date.now() - stopwatch.startTime;
                updateDisplay();
            }, 10);
            stopwatch.isRunning = true;
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            lapBtn.disabled = false;
        }
    }
    
    function pauseStopwatch() {
        if (stopwatch.isRunning) {
            clearInterval(stopwatch.timerInterval);
            stopwatch.isRunning = false;
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    function resetStopwatch() {
        clearInterval(stopwatch.timerInterval);
        stopwatch.isRunning = false;
        stopwatch.elapsedTime = 0;
        stopwatch.laps = [];
        updateDisplay();
        lapsContainer.innerHTML = '';
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        lapBtn.disabled = true;
    }
    
    function recordLap() {
        if (stopwatch.isRunning) {
            const lapTime = stopwatch.elapsedTime;
            stopwatch.laps.push(lapTime);
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${stopwatch.laps.length}`;
            
            const lapTimeDisplay = document.createElement('span');
            lapTimeDisplay.className = 'lap-time';
            
            const milliseconds = Math.floor((lapTime % 1000) / 10);
            const seconds = Math.floor((lapTime / 1000) % 60);
            const minutes = Math.floor((lapTime / (1000 * 60)) % 60);
            const hours = Math.floor((lapTime / (1000 * 60 * 60)) % 24);
            
            lapTimeDisplay.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTimeDisplay);
            
            lapsContainer.prepend(lapItem);
        }
    }
    
    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    lapBtn.addEventListener('click', recordLap);
    
    // Initialize stopwatch display
    updateDisplay();
    
    // Menambah 3D hover effects
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
            // Popout effect
            card.querySelectorAll('button, input, select').forEach(el => {
                el.style.transform = 'translateZ(30px)';
            });
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s ease';
            card.style.transform = 'rotateY(0deg) rotateX(0deg)';
            // Reset popout
            card.querySelectorAll('button, input, select').forEach(el => {
                el.style.transform = 'translateZ(0)';
            });
        });
    });
    
    // menambah button click animations
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(2px)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
});