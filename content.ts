const EPISODE_SELECTOR_CONTAINER = '.episodeSelector-container';
const EPISODE_SELECTOR_DROPDOWN = 'div.episodeSelector-dropdown';
const DICE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M300-240q25 0 42.5-17.5T360-300q0-25-17.5-42.5T300-360q-25 0-42.5 17.5T240-300q0 25 17.5 42.5T300-240Zm0-360q25 0 42.5-17.5T360-660q0-25-17.5-42.5T300-720q-25 0-42.5 17.5T240-660q0 25 17.5 42.5T300-600Zm180 180q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm180 180q25 0 42.5-17.5T720-300q0-25-17.5-42.5T660-360q-25 0-42.5 17.5T600-300q0 25 17.5 42.5T660-240Zm0-360q25 0 42.5-17.5T720-660q0-25-17.5-42.5T660-720q-25 0-42.5 17.5T600-660q0 25 17.5 42.5T660-600ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>';
const SPINNER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="800" height="800" style="shape-rendering: auto; display: block; background: transparent;"><g><path stroke="none" fill="#e15b64" d="M8 50A42 42 0 0 0 92 50A42 48.2 0 0 1 8 50"><animateTransform values="0 50 53.1;360 50 53.1" keyTimes="0;1" repeatCount="indefinite" dur="1s" type="rotate" attributeName="transform"/></path><g/></g><!-- [ldio] generated by https://loading.io --></svg>';

function cleanUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('random');
  window.history.replaceState({}, document.title, url.toString());
}


function addShuffleButton(elem: HTMLElement) {
  if(elem.querySelector('#random-episode-button') !== null) return; // If the button already exists, do nothing.

  const expandButton = elem.querySelector('button[aria-label="expand to detail modal"') as HTMLElement;
  x: if(expandButton !== null) {
    const duration = document.querySelector('.previewModal--info span.duration') as HTMLElement;
    if(duration == null) break x;
    const regex = /^([0-9]{1,2}h)?\s?([0-9]{1,2}m)?$/;
    if(regex.test(duration.innerHTML)) return; // If the duration is a movie, do nothing.

  }
  
  const clone: HTMLElement | null = elem.querySelector('.ltr-bjn8wh')?.cloneNode(true) as HTMLElement | null;
  if(clone === null) return;
  clone.id = 'random-episode-button';

  // Shuffle button:
  const button = clone?.querySelector('button');
  const buttonDivDiv = button?.querySelector('[role="presentation"]');
  if(!button || !buttonDivDiv) return;

  // Change the button text:
  buttonDivDiv.innerHTML = DICE_SVG;
  button.title = 'Shuffle';
  button.onclick = function() {
    if(expandButton !== null){

      // redirect to the url of the episode: previewModal--info > a:
      const expandButton = document.querySelector('.previewModal--info > a') as HTMLElement;
      const showUrl = expandButton.getAttribute('href');
      if(showUrl === null || showUrl === undefined ) return;

      // add 'random' to the url options:
      const url = new URL("https://" + window.location.host + showUrl);
      url.searchParams.set('random', 'true');
      console.log(url);
      window.location.href = url.toString();

      return false;
    }

    playRandomEpisode();
  }

  elem.insertBefore(clone as Node, elem.querySelector('.buttonControls--container'));
}

function playRandomEpisode() {

  // Display all episodes:
  const seasonSelector = document.querySelector("button[aria-label='dropdown-menu-trigger-button']") as HTMLElement;
  if(seasonSelector !== null) {
    seasonSelector.click();

    const dropdown = document.querySelector(EPISODE_SELECTOR_DROPDOWN) as HTMLElement;
    const dropdown_options = dropdown.querySelector("* ul[data-uia='dropdown-menu']") as HTMLElement;
    if(dropdown_options === null) return;

    // Click the last option:
    const lastOption = dropdown_options.lastElementChild as HTMLElement;
    lastOption.click();

    const randomButtonDiv = document.querySelector('#random-episode-button button [role="presentation"]') as HTMLElement;
    if(randomButtonDiv !== null) randomButtonDiv.innerHTML = SPINNER_SVG;

    setTimeout(() => {
      if(randomButtonDiv !== null) randomButtonDiv.innerHTML = DICE_SVG;
      clickRandomEpisode();
    }, 1000);

    return;
  }

  clickRandomEpisode(); // If there is no season selector, click a random episode from the single season.
}

function clickRandomEpisode() {
    // get the first ".titleCard-playIcon":
    const episodeSelectorContainer = document.querySelector(EPISODE_SELECTOR_CONTAINER) as HTMLElement;
    
    // get all the ".titleCard-playIcon" in the EPISODE_SELECTOR_CONTAINER:
    const episodes = episodeSelectorContainer.querySelectorAll('.titleCard-playIcon');
    
    // Get a random one:
    const randomEpisode = episodes[Math.floor(Math.random() * episodes.length)] as HTMLElement;
    randomEpisode.click();
}


(async () => {
  const content = document.querySelector("div[dir='ltr']") as HTMLElement;
  const observer = new MutationObserver(_mutations => {    
    var buttonControlsContainer = document.querySelector('.buttonControls--container');
    if(buttonControlsContainer !== null) {
      observer.disconnect();
      
      // get url options:
      const url = new URL(window.location.href);
      const random = url.searchParams.get('random');

      if(random !== null && random !== undefined && random === 'true') {

        const episodeSelectorContainer = document.querySelector(`${EPISODE_SELECTOR_CONTAINER} > .episode-item`) as HTMLElement;
        if(episodeSelectorContainer !== null){
          cleanUrl();
          playRandomEpisode();
        }

        observer.observe(content, { childList: true, subtree: true });
        return;
      }

      if(buttonControlsContainer === null) return;
      const elem: HTMLElement = (buttonControlsContainer as HTMLElement);
      addShuffleButton(elem);

      observer.observe(content, { childList: true, subtree: true });
    }
  });

  observer.observe(content, { childList: true, subtree: true });
})();