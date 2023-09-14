const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            events: [],
            curDate: null,
            allCategories: [],
            inputSearch: '',
            inputCategory: [],
            eventsFiltered: [],
            eventName: '',
            arrayChecks: [],
            contadorCards: 0,
            allImages: [],
            randomImages: [],
            backupImages: '',
            randomIndex: 0,
            randomImage: '',
            randomImages2: [],
            arrayFav: [],
            storedArrayFav: '',
            btnFav: '',
            inputSearchButton: '',
        }
    },
    created() {
        this.getData();
    },
    methods: {
        async getData() {
            try {
                const response = await fetch('https://mindhub-xj03.onrender.com/api/amazing');
                const data = await response.json();
                this.finalData(data);
                this.getRandomImages;
                this.checkFavorite;
            } catch (error) {
                console.log('Error:', error);
            }
        },
        finalData(data) {
            this.events = data.events;
            this.curDate = data.currentDate;
            this.allCategories = [...new Set(this.upcomingEvents.map(event => event.category))];
            this.allImages = [...new Set(this.upcomingEvents.map(event => event.image))];
        },
        clickBtn() {
            localStorage.clear('arrayFav');
            this.arrayFav = [];
        },
        handleEnterKey() {
        },
        handleIncrement() {
        }
    },
    computed: {
        upcomingEvents() {
            return this.events.filter((event) => Date.parse(event.date) > Date.parse(this.curDate));
        },
        getRandomImages() {
            this.backupImages = this.allImages.slice();
            for (let i = 0; i < 3; i++) {
                this.randomIndex = Math.floor(Math.random() * this.backupImages.length);
                this.randomImage = this.backupImages.splice(this.randomIndex, 1)[0];
                this.randomImages.push(this.randomImage);
            }
        },
        filterResults() {
            this.contadorCards = this.upcomingEvents.length;
            if (this.inputCategory.length === 0) {
                this.eventsFiltered = this.upcomingEvents.filter(event => {
                    this.eventName = event.name.toLowerCase();
                    return this.eventName.includes(this.inputSearch.toLowerCase());
                });
            } else {
                this.eventsFiltered = this.upcomingEvents.filter(event => {
                    this.eventName = event.name.toLowerCase();
                    return this.eventName.includes(this.inputSearch.toLowerCase()) && this.inputCategory.includes(event.category);
                });
            }
        },
        checkFavorite() {
            this.storedArrayFav = localStorage.getItem('arrayFav');
            if (this.storedArrayFav) {
                this.arrayFav = JSON.parse(this.storedArrayFav);
            }
        },
    }
}).mount('#app');