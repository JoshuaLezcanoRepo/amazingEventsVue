const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            events: [],
            curDate: null,
            arrayFav: [],
            storedArrayFav: '',
            eventSelected: [],
            allCategoriesUpcoming: '',
            allCategoriesPast: '',
            finalPastEvents: [],
            finalUpcomingEvents: [],
        };
    },
    mounted() {
        this.storedArrayFav = localStorage.getItem('arrayFav');
        if (this.storedArrayFav) {
            this.arrayFav = JSON.parse(this.storedArrayFav);
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
            } catch (error) {
                console.log('Error:', error);
            }
        },
        finalData(data) {
            this.events = data.events;
            this.curDate = data.currentDate;
            this.checkFavorite();
            this.allCategoriesUpcoming = [...new Set(this.upcomingEvents.map(event => event.category))];
            this.allCategoriesPast = [...new Set(this.pastEvents.map(event => event.category))];
            this.finalPastEvents = this.dataEvents(this.allCategoriesPast, this.pastEvents);
            this.finalUpcomingEvents = this.dataEvents(this.allCategoriesUpcoming, this.upcomingEvents);
        },
        clickBtn() {
            localStorage.clear('arrayFav');
            this.arrayFav = [];
        },
        checkFavorite() {
            if (this.storedArrayFav) {
                this.arrayFav = JSON.parse(this.storedArrayFav);
                this.favoriteButton = this.$refs.favoriteButton;
                this.index = this.arrayFav.findIndex((event) => event._id === this.eventSelected._id);

                if (this.index !== -1) {
                    this.favoriteButton.classList.add('likeDetail');
                }
            }
        },
        dataEvents(categories, events) {
            return categories.map(category => {
                const eventsCats = events.filter(event => event.category === category);
                const eventsRevenues = eventsCats.reduce((accumulator, event) => accumulator + event.price * (event.estimate || event.assistance), 0);
                const attendance = eventsCats.reduce((accumulator, event) => accumulator + ((event.assistance || event.estimate) / event.capacity) * 100, 0) / eventsCats.length;

                return {
                    category,
                    eventsRevenues,
                    attendance,
                };
            });
        },
    },
    computed: {
        upcomingEvents() {
            return this.events.filter((event) => Date.parse(event.date) > Date.parse(this.curDate));
        },
        pastEvents() {
            return this.events.filter((event) => Date.parse(event.date) < Date.parse(this.curDate));
        },
        highestAssistanceEvent() {
            return this.events.reduce((acc, { assistance, capacity, name }) => {
                const number = (assistance / capacity) * 100;
                if (number > acc.contador) {
                    return { contador: number, eventTitle: name };
                }
                return acc;
            }, { contador: 0, eventTitle: "" });
        },
        lowestAssistanceEvent() {
            return this.events.reduce((acc, { assistance, capacity, name }) => {
                const number = (assistance / capacity) * 100;
                if (number < acc.contador) {
                    return { contador: number, eventTitle: name };
                }
                return acc;
            }, { contador: 100, eventTitle: "" });
        },
        largerCapacityEvent() {
            return this.events.reduce((acc, { capacity, name }) => {
                if (capacity > acc.contador) {
                    return { contador: capacity, eventTitle: name };
                }
                return acc;
            }, { contador: 0, eventTitle: "" });
        },
    },
}).mount('#app');