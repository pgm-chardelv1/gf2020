(() => {
  const app = {
    initialize () {
      this.cacheElements();
      this.buildUI();
      this.registerListeners();
    },
    cacheElements () {
      this.$body = document.querySelector('body');
      this.$header = document.querySelector('header');
      this.$navButton = document.querySelector('.btn--menu');
      this.$mobileMenu = document.querySelector('.mobile-menu');
      this.$cookieButton = document.querySelector('.footer__cookies .cookies__btn');
    },
    buildUI () {
      this.$header.style.background = this.getRandomHeaderImage();
    },
    registerListeners () {
      this.$navButton.addEventListener('click', () => {
        this.showMobileMenu();
      }, false);
      this.$cookieButton.addEventListener('click', () => {
        this.showCookiePopup();
      }, false);
    },
    getRandomHeaderImage () {
      // Generate random number between 0 and 8
      const randomNumber = Math.floor(Math.random() * 8);
      // Get header image from images.js > headerImages array
      // eslint-disable-next-line no-undef
      let randomHeaderImage = headerImages[randomNumber];
      // If null or undefined, use the default image
      // eslint-disable-next-line no-undef
      randomHeaderImage ??= headerImages[0];
      return `rgb(0, 0, 0) url('${randomHeaderImage}') no-repeat scroll center center / cover`;
    },
    showMobileMenu () {
      const tempStr = `
      <img class="mobile__close" src="./static/media/images/svg/close-icon.svg">
      <ul class="nav-list--mobile">
        <li><a href="./index.html">Home</a></li>
        <li><a href="">Zoeken</a></li>
        <li>
          <button class="submenu-toggle">Programma</button>
          <ul class="subnav hidden">
            <li><a href="./dag.html?day=19">Vrijdag 19 juli</a></li>
            <li><a href="./dag.html?day=20">Zaterdag 20 juli</a></li>
            <li><a href="./dag.html?day=21">Zondag 21 juli</a></li>
            <li><a href="./dag.html?day=22">Maandag 22 juli</a></li>
            <li><a href="./dag.html?day=23">Dinsdag 23 juli</a></li>
            <li><a href="./dag.html?day=24">Woensdag 24 juli</a></li>
            <li><a href="./dag.html?day=25">Donderdag 25 juli</a></li>
            <li><a href="./dag.html?day=26">Vrijdag 26 juli</a></li>
            <li><a href="./dag.html?day=27">Zaterdag 27 juli</a></li>
            <li><a href="./dag.html?day=28">Zondag 28 juli</a></li>
          </ul>
        </li>
        <li><a href="./nieuws.html">Nieuws</a></li>
        <li><a href="./index.html">Info</a></li>
      </ul>
      `;
      this.$body.classList.add('no-scroll');
      this.$mobileMenu.classList.add('menu-expanded');
      this.$mobileMenu.style.display = 'block';
      this.$mobileMenu.innerHTML = tempStr;
      const $submenuToggle = document.querySelector('.submenu-toggle');
      $submenuToggle.addEventListener('click', () => {
        this.toggleMobileSubmenu();
      }, false);
      const $closeMenu = document.querySelector('.mobile__close');
      $closeMenu.addEventListener('click', () => {
        this.hideMobileMenu();
      }, false);
    },
    hideMobileMenu () {
      this.$body.classList.remove('no-scroll');
      this.$mobileMenu.classList.remove('menu-expanded');
      this.$mobileMenu.style.display = 'none';
    },
    toggleMobileSubmenu () {
      const $submenuToggle = document.querySelector('.submenu-toggle');
      const $subnav = document.querySelector('.subnav');
      $subnav.classList.toggle('hidden');
      $submenuToggle.classList.toggle('active');
    },
    showCookiePopup () {
      this.$cookiePopup = document.querySelector('.cookie-popup');
      this.$cookiePopup.innerHTML = `
        <div class="cookie__message">
          <h3>Waarvoor gebruiken we cookies?</h3>

          <p>We gebruiken cookies om verkeer en voorkeuren bij te houden, ter verbetering van de gebruikerservaring, voor een juiste wisselwerking met sociale media en voor gerichtere communicatie. Je kunt op elk moment je voorkeuren aanpassen onderaan de pagina. <a class="cookiebeleid" title="Cookiebeleid" href="">Info over het cookiebeleid</a>.</p>

          <button class="cookies__btn hide-cookies">Alle cookies aanvaarden</button>
          <span class="cookies__voorkeuren">Stel je voorkeuren in</span>
        </div>`;
      this.$cookiePopup.classList.remove('hidden');
      this.$cookiesBtnHide = document.querySelector('.hide-cookies');
      this.$cookiesBtnHide.addEventListener('click', this.hideCookiePopup, false);
    },
    hideCookiePopup () {
      this.$cookiePopup = document.querySelector('.cookie-popup');
      this.$cookiesBtnHide = document.querySelector('.hide-cookies');
      this.$cookiePopup.classList.add('hidden');
      this.$cookiesBtnHide.style = 'z-index: -1';
    },
  };
  app.initialize();
})();

(() => {
  const home = {
    initialize () {
      this.cacheElements();
      this.fetchEvents();
      this.fetchNews();
      this.getSlideShowImage();
    },
    cacheElements () {
      this.$eventList = document.querySelector('.event-list');
      this.$newsContainer = document.querySelector('.news');
      this.$slideshow = document.querySelector('.slideshow');
    },
    async fetchEvents () {
      // eslint-disable-next-line no-undef
      const eventsApi = new EventsApi();
      this.events = await eventsApi.getEvents();
      this.updateEventsFeaturedUI(this.events);
      return this.events;
    },
    async fetchNews () {
      // eslint-disable-next-line no-undef
      const newsApi = new NewsApi();
      this.news = await newsApi.getNews();
      this.updateNewsUI(this.news);
      return this.news;
    },
    updateEventsFeaturedUI (data) {
      // Generate the HTML string for a featured event list
      for (let i = 0; i < 3; i++) {
        const event = data[Math.floor(Math.random() * data.length)];
        // eslint-disable-next-line no-undef
        const placeholder = new PlaceholderImage().getPlaceholderImage();
        event.image ??= {
          full: placeholder,
          thumb: placeholder,
        };
        const shortDayName = this.getDayName(event.day).substring(0, 2);
        this.$eventList.innerHTML += `
        <li class="event">
            <a title="${event.title}" href="./detail.html?day=${event.day}&slug=${event.slug}"></a>
             <div class="event__img" style="background-image: url('${event.image.thumb}');"></div>
            <div class="inner">
              <div class="event__time"><span class="event__day">${shortDayName} ${event.day} Jul </span>${event.start} u.</div>
                <h3 class="event__title">${event.title}</h3>
                <div class="event__location">${event.location}</div>
            </div>
          </li>
        `;
      }
    },
    updateNewsUI (data) {
      let articlesHTMLString = '';
      for (let i = 0; i < 3; i++) {
        const article = data[i];
        const date = new Date(article.publishedAt);
        const options = { day: 'numeric', month: 'numeric' };
        articlesHTMLString += `
        <div class="card news__item">
          <a title="${article.title}" href="nieuws.html"></a>
          <div class="card__img">
            <img src="${article.picture.medium} alt="${article.title}">
            <p>${date.toLocaleDateString('en-GB', options)}</p>
          </div>

          <div class="card__body">
            <h2>${article.title}</h2>

            <p>${article.synopsis}</p>
          </div>
        </div>`;
      }
      articlesHTMLString += `<a class="news__btn" href="nieuws.html">Bekijk alle nieuwsberichten</a>`;
      this.$newsContainer.innerHTML = articlesHTMLString;
    },
    getDayName (day) {
      // Get the full name for a day
      let dayName = '';
      switch (day) {
        case '19':
          dayName = 'Vrijdag';
          break;
        case '20':
          dayName = 'Zaterdag';
          break;
        case '21':
          dayName = 'Zondag';
          break;
        case '22':
          dayName = 'Maandag';
          break;
        case '23':
          dayName = 'Dinsdag';
          break;
        case '24':
          dayName = 'Woensdag';
          break;
        case '25':
          dayName = 'Donderdag';
          break;
        case '26':
          dayName = 'Vrijdag';
          break;
        case '27':
          dayName = 'Zaterdag';
          break;
        case '28':
          dayName = 'Zondag';
          break;
          // Return Feestdag when something went wrong
        default:
          dayName = 'Feestdag';
      }
      return dayName;
    },
    getSlideShowImage (i = 0) {
      let index;
      if (i + 1 > 10) {
        index = 0;
      } else if (i - 1 < -1) {
        index = 9;
      } else {
        index = i;
      }
      this.$slideshow = document.querySelector('.slideshow');
      const tempStr = `
      <div class="slideshow__nav">
        <div class="slideshow-count">${index + 1}/10</div>
      </div>`;
      // eslint-disable-next-line no-undef
      this.$slideshow.style = `background-image: url('${slideshowImages[index]}');`;
      this.$slideshow.innerHTML = tempStr;
      setTimeout(() => {
        this.getSlideShowImage(index + 1);
      }, 3000);
    },
  };
  home.initialize();
})();
