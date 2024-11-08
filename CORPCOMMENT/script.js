// -- GLOBAL --
const MAX_CHARS = 150;
const BASE_API_URL = 'https://bytegrad.com/course-assets/js/1/api'

const textareaEl = document.querySelector('.form__textarea')
const counterEl = document.querySelector('.counter')
const formEl = document.querySelector('.form'); 
const feedbakListEl = document.querySelector('.feedbacks'); 
const submitBtnEl = document.querySelector('.submit-btn'); 
const spinnerEl = document.querySelector('.spinner');
const hashtagListEl = document.querySelector('.hashtags'); 

const renderFeedbackItem = feedbackItem => {
    const feedbackItemHTML =`
    <li class="feedback">
        <button class="upvote">
            <i class="fa-solid fa-caret-up upvote__icon"></i>
            <span class="upvote__count">${feedbackItem.upvoteCount}</span>
        </button>
        <section class="feedback__badge">
            <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
        </section>
        <div class="feedback__content">
            <p class="feedback__company">${feedbackItem.company}</p>
            <p class="feedback__text">${feedbackItem.text}</p>
        </div>
        <p class="feedback__date">${feedbackItem.daysAgo=== 0 ? 'NEW': `${feedbackItem.daysAgo} d`}</p>
    </li>
    `;
    feedbakListEl.insertAdjacentHTML('beforeend',feedbackItemHTML);

};

// -- COUNTER COMPONENT --

const inputHandler = () => {
    // determine the maximum number of characters
    const maxNrChars = MAX_CHARS;

    // dtermined the number of character currently typed
    const ncCharsTyped = textareaEl.value.length;

    //calculate number of character left
    const charsLeft = maxNrChars - ncCharsTyped;

    // show number of character left
    counterEl.textContent = charsLeft
}

textareaEl.addEventListener('input',inputHandler);

// -- FORM COMPONENT --

const showVisualIndicator = (textCheck) =>{
    // valid indicator
    const className = textCheck === 'valid' ? 'form--valid' : 'form--invalid'
    formEl.classList.add(className);

    //remove valid indicator
    setTimeout(()=>{
        formEl.classList.remove(className);
    }, 2000);
}

const submitHandler = event => {
    // prevent default browser action( refreshing page and send to action url)
    event.preventDefault();
    const text = textareaEl.value;
    console.log('text');

    // validate text (e.g. check if #hashtag is present and text is long enough)
    if(text.includes('#') && text.length >= 5){
        showVisualIndicator('valid');
    }else{
        showVisualIndicator('invalid');

        // focuk textarea
        textareaEl.focus();

        // stop this function execution
        return;
    }

    // Now extract other info from text
    const hashtag = text.split(' ').find(word => word.includes('#'));
    const company = hashtag.substring(1);
    const badgeLetter = company.substring(0,1).toUpperCase()
    const upvoteCount = 0;
    const daysAgo = 0;

    // Create feedback item object
    const feedbackItem = {
        upvoteCount: upvoteCount,
        company:company,
        badgeLetter: badgeLetter,
        daysAgo:daysAgo,
        text:text

    };

    // new feedback item HTMl
    renderFeedbackItem(feedbackItem)


    fetch(`${BASE_API_URL}/feedbacks`,{
        method:'POST',
        body: JSON.stringify(feedbackItem),
        headers:{
            Accept : 'application/json',
           'Content-Type':'application/json'
        }
    }).then(response =>{
        if(!response.ok){
            console.log('Something went wrong');
            return;
        }
            
        console.log('Successfully subnitted');
        
    }).catch(error =>{
        console.log(error);
    });
     // clear textarea
    textareaEl.value = '';
    // blur submit button
    submitBtnEl.blur();
    // reset counter
    counterEl.textContent = MAX_CHARS;
}
formEl.addEventListener('submit',submitHandler);

// -- FEEDBACK LIST COMPONENT --
const clickHandler = (event) => {
    const clickEl = event.target;

    // determine user intend to upvort or expand
    const upvoteIntention = clickEl.className.includes('upvote');

    if(upvoteIntention){
        const upvoteBtnEl = clickEl.closest('.upvote');
        upvoteBtnEl.disabled = true;
        // select the upvote count element within upvote button

        const upvoteCountEl = upvoteBtnEl.querySelector('.upvote__count');
        // get currently displayed 
        let upvoteCount = +upvoteCountEl.textContent;

        // increment by 1
        upvoteCount++;
        upvoteCountEl.textContent = upvoteCount;

    }else{
        // expnad the clicked feedback item.
        clickEl.closest('.feedback').classList.toggle('feedback--expand');

    }
    //console.log(event);

}

feedbakListEl.addEventListener('click',clickHandler);

fetch(`${BASE_API_URL}/feedbacks`)
    .then(response => {
        return response.json();
    })
    .then(data =>{
        spinnerEl.remove();
        console.log(data.feedbacks[0]);
        //iterate over each element and render it in list.

    data.feedbacks.forEach(feedbackItem=>{
        // new feedback item HTMl
        renderFeedbackItem(feedbackItem);
    });        
    })
    .catch(error =>{
        feedbakListEl.textContent = `Failed to fetch feedbak items. Error message: ${error.message}`
    });

    // -- HASHTAG LIST COMPONENT
    
    const hashtagClickHandler = event => {
        const clickeEl = event.target;
        // stop function if click happened in list and outside button
        if(clickeEl.className === 'hashtags'){
            return;
        }
        // extract actual company name in the button
        const companyName = clickeEl.textContent.substring(1).toLowerCase().trim();

        //iterate over each feedback item in the list
        feedbakListEl.childNodes.forEach(childNode =>{
            // stop this iteration if this text node
            if (childNode.nodeType === 3) return;
            const companyNameFromFeedbackItems = childNode.querySelector('.feedback__company').textContent.toLowerCase().trim();

            //remove feedback item from the list company names are not equal
            if(companyName !== companyNameFromFeedbackItems){
                childNode.remove();
            }
        });
    }

    hashtagListEl.addEventListener('click', hashtagClickHandler );