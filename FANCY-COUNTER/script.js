const counterEl = document.querySelector('.counter');


const increaseButtonEl = document.querySelector('.counter__button--increase');
const decreaseButtonEl = document.querySelector('.counter__button--decrease');
const resetButtonEl = document.querySelector('.counter__reset-button');
const counterValueEl = document.querySelector('.counter__value');

const counterTitleEl = document.querySelector('.counter__title');
// old way
//decreaseButtonEl.addEventListener('click', function(){  

// modern way
decreaseButtonEl.addEventListener('click', () => {
    // get current value of counter
    const currentValue = counterValueEl.textContent;
    console.log(typeof currentValue);

    //convert value to number type
    const currentValueAsNumber = +currentValue

    // decrement by 1
    let newValue = currentValueAsNumber - 1

    //check if new value is less than 0
    if(newValue < 0){
        newValue = 0;
    }

    // set counter element with new value
    counterValueEl.textContent = newValue;
    decreaseButtonEl.blur();

});
//old way
//function incrementCounter(){
//modern way
const incrementCounter = () => {    
 // get current value of counter
 const currentValue = counterValueEl.textContent;
 console.log(typeof currentValue);

 //convert value to number type
 const currentValueAsNumber = +currentValue

 // increment by 1
 let newValue = currentValueAsNumber + 1

 if(newValue > 5){
    newValue = 5;

    // give visula indicator that limit has been reached
   // dirty way
    // counterEl.style.backgroundColor = 'red'
    counterEl.classList.add('counter--limit')
    counterTitleEl.innerHTML = 'Limit! Buy <b>Pro</b> For > 5'
    //disable increase and decrease button
    increaseButtonEl.disabled = true;
    decreaseButtonEl.disabled = true;
 }

 // set counter element with new value
 counterValueEl.textContent = newValue;
 increaseButtonEl.blur();
}

// dont use bracket it will execute when run. to stop only write without ()
increaseButtonEl.addEventListener('click',incrementCounter);

resetButtonEl.addEventListener('click', () => {
      // set counter value to 0
    counterValueEl.textContent = 0;
    increaseButtonEl.disabled = false;
    decreaseButtonEl.disabled = false;
    counterEl.classList.remove('counter--limit')
    counterTitleEl.textContent = 'Fancy Counter'
    // remove focus other wise space pressed int wil click and reset.
    resetButtonEl.blur();

});

document.addEventListener('keydown',incrementCounter);
