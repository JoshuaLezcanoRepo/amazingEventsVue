const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            events: [],
            curDate: null,
            arrayFav: [],
            storedArrayFav: '',
            id: '',
            queryString: '',
            params: '',
            eventSelected: [],
            detail: '',
            isFavorite: false,
            index: '',
            favoriteButton: '',
            categoryEvents: '',
            randomEvents: '',
            toast: undefined,
        }
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
            this.allCategories = [...new Set(this.events.map(event => event.category))];
            this.allImages = [...new Set(this.events.map(event => event.image))];
            this.queryString = location.search;
            this.params = new URLSearchParams(this.queryString);
            this.id = this.params.get('id');
            this.eventSelected = this.events.find(event => event._id == this.id);
            this.checkFavorite();
            this.categoryEvents = this.events.filter(event => event.category === this.eventSelected.category && event._id !== this.eventSelected._id);
            this.randomEvents = this.categoryEvents.sort(() => 0.5 - Math.random()).slice(0, 3);
        },
        clickBtn() {
            localStorage.clear('arrayFav');
            this.arrayFav = [];
        },
        toggleFavorite() {
            this.index = this.arrayFav.findIndex((event) => event._id === this.eventSelected._id);

            if (!this.isFavorite) {
                if (this.index === -1) {
                    this.arrayFav.push(this.eventSelected);
                    localStorage.setItem('arrayFav', JSON.stringify(this.arrayFav));
                    this.toast = true;
                    this.initializeToast();
                }
            } else {
                if (this.index !== -1) {
                    this.arrayFav.splice(this.index, 1);
                    localStorage.setItem('arrayFav', JSON.stringify(this.arrayFav));
                    this.toast = false;
                    this.initializeToast();
                }
            }
            this.isFavorite = !this.isFavorite;
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
        initializeToast() {
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.$refs.liveToast);
            toastBootstrap.show();
        }
    }
}).mount('#app');