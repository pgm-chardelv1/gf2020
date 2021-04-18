/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function EventsApi () {
  this.EVENTS_API = 'https://www.pgm.gent/data/gentsefeesten/events.json';
  this.getEvents = async () => {
    try {
      const response = await fetch(this.EVENTS_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
    return null;
  };
}
function CategoriesApi () {
  this.CATEGORIES_API = 'https://www.pgm.gent/data/gentsefeesten/categories.json';
  this.getCategories = async () => {
    try {
      const response = await fetch(this.CATEGORIES_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
    return null;
  };
}
function NewsApi () {
  this.NEWS_API = 'https://www.pgm.gent/data/gentsefeesten/news.json';
  this.getNews = async () => {
    try {
      const response = await fetch(this.NEWS_API);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error(error);
    }
    return null;
  };
}
function PlaceholderImage () {
  this.placeholderImages = [
    'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/5461647/pexels-photo-5461647.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/3470602/pexels-photo-3470602.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/1153253/pexels-photo-1153253.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/382297/pexels-photo-382297.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/4697236/pexels-photo-4697236.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
    'https://images.pexels.com/photos/1983046/pexels-photo-1983046.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  ];
  this.getPlaceholderImage = () => {
    this.randomPlaceholder = Math.floor(Math.random() * 10);
    return this.placeholderImages[this.randomPlaceholder];
  };
}
