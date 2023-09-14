const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            arrayFav: [],
            storedArrayFav: '',
        }
    },
    created() {
        this.checkFavorite;
    },
    methods: {
        clickBtn() {
            localStorage.clear('arrayFav');
            this.arrayFav = [];
        },
    },
    computed: {
        checkFavorite() {
            this.storedArrayFav = localStorage.getItem('arrayFav');
            if (this.storedArrayFav) {
                this.arrayFav = JSON.parse(this.storedArrayFav);
            }
        },
    }
}).mount('#app')