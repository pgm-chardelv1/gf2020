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
  const detail = {
    initialize() {
      // console.log('Detail initialized');
      this.cacheElements();
      this.fetchEvents();
    },
    cacheElements() {
      this.$eventDetail = document.querySelector('.event-detail');
      this.$relatedEventsList = document.querySelector('.related-events-list');
    },
    async fetchEvents() {
      const eventsApi = new EventsApi();
      this.events = await eventsApi.getEvents();
      this.filterEventsBySlug(this.events);
      return this.events;
    },
    getDetailSearchParams() {
      const params = new URLSearchParams(window.location.search);
      let slug = params.get('slug');
      return slug;
    },
    filterEventsBySlug(events) {
      const slug = this.getDetailSearchParams();
      let slugEvent = events.find((event) => {
        return event.slug === slug;
      });
      document.title = `${slugEvent.title} | Gentse Feesten 2019`;
      this.buildDetailUI(slugEvent);
      this.filterEventsByOrganizer(events, slugEvent);
    },
    buildDetailUI(event){
      const placeholder = new PlaceholderImage().getPlaceholderImage();
      event.image ??= {full: placeholder, thumb: placeholder};
      event.description ??= event.title;
      let categoriesLinks = '';
      let isWheelchairAccessible = '';
      if (event.wheelchair_accessible === true) {
        isWheelchairAccessible = `<img class="wheelchair-icon" alt="Deze activiteit is toegankelijk voor rolstoelgebruikers." src="./static/media/images/svg/wheelchair.svg" title="Deze activiteit is toegankelijk voor rolstoelgebruikers.">`;
      }
      event.category.forEach(cat => {
        categoriesLinks += `<p><a class="event__link" href="">${cat}</a></p>`;
      })
      const html = `
      <div class="event-det row">
        <div class="event-det__item media">
          <img src="${event.image.full}" alt="${event.title}">
        </div>

        <div class="event-det__item text">
          <h1 class="event-det__title">${event.title}</h1>
          <p class="event-det__location">${event.location}</p>

          <h2 class="event-det__datetime">${event.day_of_week} ${event.day} juli - ${event.start} u. > ${event.end} u.</h2>

          <p class="event-det__desc">${event.description}</p>

          <div class="event-det__links">
            <div class="link__item">
              <p class="link__desc">Website:</p>
              <a class="event__link website" href="${event.url}" target="_blank" rel="noopener noreferrer">${event.url}</a>
            </div>

            <div class="link__item">
              <p class="link__desc">Organisator:</p>
              <a class="event__link" href="">${event.organizer}</a>
            </div>

            <div class="link__item">
                <p class="link__desc">Categorieën:</p>
                
                <div class="link-categories">
                  ${categoriesLinks}
                </div>
            </div>
          </div>

          ${isWheelchairAccessible}
          
          <div class="event-det__share">
            <div class="event-det__share-cont">
              <a class="event-det__share-link" title="Deel op Twitter" href="">
                <img class="share-img" src="./static/media/images/svg/twitter.svg">
              </a>
            </div>

            <div class="event-det__share-cont">
              <a class="event-det__share-link" title="Deel op Facebook" href="">
                <img class="share-img" src="./static/media/images/svg/facebook.svg">
              </a>
            </div>

            <div class="event-det__share-cont">
              <a class="event-det__share-link" title="Deel op Pinterest" href="">
                <img class="share-img" src="./static/media/images/svg/pinterest.svg">
              </a>
            </div>
          </div>
        </div>
      </div>
      `;
      this.$eventDetail.innerHTML = html;
      const $websiteLink = document.querySelector('.website');
      if (event.url === null) {
        $websiteLink.outerHTML = `<p>-</p>`;
      }
    },
    filterEventsByOrganizer(events, currentEvent) {
      let relatedEvents = events.filter(event => {
        return event.organizer === currentEvent.organizer;
      });
      relatedEvents.length = 5;
      relatedEvents.sort((a, b) => {
        return a.day.localeCompare(b.day);
      })
      
      const eventsListItems = relatedEvents.map(event => {
        return `
        <li class="event">
          <a href="./detail.html?day=${event.day}&slug=${event.slug}" title="${event.title} op ${event.day} juli"></a>

          <div class="inner">
            <div class="event__time"><span class="event__day"></span>${event.start} u.</div>

            <h3 class="event__title">${event.title}</h3>

            <div class="event__location">${event.location}</div>
          </div>
        </li>`
      }).join('');
      const html = `
      <h2>Andere evenementen van ${currentEvent.organizer}</h2>
      <ul class="event-list event-list--text">${eventsListItems}</ul>`;

      this.$relatedEventsList.innerHTML = html;
    }
  }

  detail.initialize();
}) ();

