"use strict";

const account1 = {
  owner: "Alexandra Yakovchuk",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Darya Babynina",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: "Yana Badanova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: "Sonya Soloviova",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Отображение снятий и зачислений
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (value, i) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const type2 = type == "deposit" ? "зачисление" : "снятие";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type2}
          </div>
          <div class="movements__date">3 дня назад</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

// Генерация логина из ФИО
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map((val) => val[0])
      .join("");
  });
}
createLogIn(accounts);

// Подсчёт бюджета
function builtBudget(acc) {
  acc.balance = acc.movements.reduce((acc, val) => {
    return acc + val;
  });
  labelBalance.textContent = `${acc.balance} руб.`;
}

// Вывод прихода, ухлда и суммы в footer
function calcDisplaySum(movements) {
  const incomes = movements
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0);
  const outcomes = movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${incomes}руб.`;
  labelSumOut.textContent = `${Math.abs(outcomes)}руб.`;
  labelSumInterest.textContent = `${incomes + outcomes}руб.`;
}

// Обновление интерфейса сайта
function updateUi(acc) {
  displayMovements(acc.movements);
  builtBudget(acc);
  calcDisplaySum(acc.movements);
}

// Вход в аккаунт
let currentAccount;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.logIn === inputLoginUsername.value
  );
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    updateUi(currentAccount);
  }
});

//Перевод денег на другой аккаунт
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const recieveAcc = accounts.find(
    (acc) => acc.logIn === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    recieveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    recieveAcc.movements.push(amount);
    updateUi(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputCloseUsername.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.logIn === currentAccount.logIn
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputCloseUsername.value = "";
});

// Внести деньги
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

const allMov = accounts.map((acc) => acc.movements).flat();
const allBalance = allMov.reduce((acc, val) => acc + val, 0);
console.log(allMov);
console.log(allBalance);

let sorted = false;
// Фильтрация
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
