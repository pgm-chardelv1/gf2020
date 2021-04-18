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
  const programme = {
    initialize () {
      // console.log('Programme initialized!');
      this.cacheElements();
      this.getDayParam();
      this.fetchEvents();
      this.fetchCategories();
      this.registerDisplayListeners();
    },
    cacheElements () {
      this.$eventList = document.querySelector('.event-list');
    },
    getDayParam () {
      this.params = new URLSearchParams(window.location.search);
      this.day = this.params.get('day');
      document.title = `${this.day} juli | Programma | Gentse Feesten 2019`;
      this.toggleDayMenuActiveClass(this.day);
      return this.day;
    },
    async fetchEvents () {
      // eslint-disable-next-line no-undef
      const eventsApi = new EventsApi();
      this.events = await eventsApi.getEvents();
      return this.events;
    },
    async fetchCategories () {
      // eslint-disable-next-line no-undef
      const categoriesApi = new CategoriesApi();
      this.categories = await categoriesApi.getCategories();
      this.buildCategoriesListUI(this.categories);
      this.events = await this.fetchEvents();
      this.updateEventsFeaturedUI(this.events);
      this.populateEventsByCategoryHTML(this.categories, this.events);
      return this.categories;
    },
    updateEventsFeaturedUI (data) {
      this.day = this.getDayParam();
      let filteredData = [...data];
      filteredData = this.filterEventsByDay(filteredData, this.day);
      for (let i = 0; i < 3; i++) {
        const event = filteredData[i];
        // eslint-disable-next-line no-undef
        const placeholder = new PlaceholderImage().getPlaceholderImage();
        event.image ??= {
          full: placeholder,
          thumb: placeholder,
        };
        this.$eventList.innerHTML += `
        <li class="event">
            <a href="./detail.html?day=${event.day}&slug=${event.slug}"></a>
             <div class="event__img" style="background-image: url('${event.image.thumb}');"></div>
            <div class="inner">
              <div class="event__time"><span class="event__day"></span>${event.start} u.</div>
                <h3 class="event__title">${event.title}</h3>
                <div class="event__location">${event.location}</div>
            </div>
          </li>
        `;
      }
    },
    filterEventsByDay (data, day) {
      // Filter the data to only show events for the current selected day
      const filteredData = [];
      data.forEach((event) => {
        if (event.day === day) {
          filteredData.push(event);
        }
      });
      return filteredData;
    },
    buildCategoriesListUI (data) {
      const $categoriesList = document.querySelector('.categories__list');
      let tempStr = '<ul class="categories-list">';
      data.forEach((category) => {
        tempStr += `
          <li><a href="#${this.generateCategoryId(category)}">${category}</a></li>
        `;
      });
      tempStr += '</ul>';
      $categoriesList.innerHTML = tempStr;
    },
    generateCategoryId (string) {
      let newStr = string.toLowerCase();
      newStr = newStr.replace(/[^A-Z0-9]+/ig, '_');
      return newStr;
    },
    populateEventsByCategoryHTML (categories, events) {
      const day = this.getDayParam();
      const dayEvents = this.filterEventsByDay(events, day);
      const html = categories.map((category) => {
        const categoryEvents = dayEvents.filter(event => event.category.indexOf(category) > -1);
        categoryEvents.sort((a, b) => a.sort_key.localeCompare(b.sort_key));
        const listItems = categoryEvents.map((event) => {
          // eslint-disable-next-line no-undef
          const placeholder = new PlaceholderImage().getPlaceholderImage();
          // eslint-disable-next-line no-param-reassign
          event.image ??= {
            full: placeholder,
            thumb: placeholder,
          };
          return `
          <li class="event">
            <a href="./detail.html?day=${event.day}&slug=${event.slug}" title="${event.title}"></a>

            <div class="event__img" style="background-image: url('${event.image.thumb}');"></div>

            <div class="inner">
              <div class="event__time"><span class="event__day"></span>${event.start} u.</div>

              <h3 class="event__title">${event.title}</h3>

              <div class="event__location">${event.location}</div>
            </div>
          </li>
          `;
        }).join('');
        return `
        <section id="${this.generateCategoryId(category)}">
          <h2>${category}</h2>
          <a href="#main" class="back-to-top" title="Terug naar boven">Terug naar boven</a>
          <ul class="event-list event-list--rich row">
            ${listItems}
          </ul>
        </section>`;
      }).join('');

      const categoriesEventsContainer = document.querySelector('.categories-events');
      categoriesEventsContainer.innerHTML = html;
    },
    registerDisplayListeners () {
      const $displayModes = document.querySelectorAll('.display__mode');
      $displayModes.forEach((displayMode) => {
        displayMode.addEventListener('click', this.changeCategoryEventDisplay, false);
      });
    },
    changeCategoryEventDisplay () {
      const $displayModes = document.querySelectorAll('.display__mode');
      $displayModes.forEach((displayMode) => {
        displayMode.classList.toggle('active');
      });
      const $eventLists = document.querySelectorAll('a + .event-list');
      $eventLists.forEach((eventList) => {
        eventList.classList.toggle('event-list--rich');
        eventList.classList.toggle('event-list--text');
      });
    },
    toggleDayMenuActiveClass (day) {
      // Toggle active day on menu
      const $daysLink = document.querySelectorAll('.days__link');
      $daysLink.forEach((link) => {
        if (link.title.startsWith(day)) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    },
  };
  programme.initialize();
})();
