console.log("app.js is loaded");
const { createApp } = Vue;

createApp({
    data() {
        return {
            plugins: [],
            selectedCategories: [],
            selectedPaid: '',
            selectedVersions: [],
            selectedLanguages: [],
            uniqueCategories: [],
            uniqueVersions: [],
            uniqueLanguages: [],
            currentPage: 1,
            itemsPerPage: 10
        };
    },
    computed: {
        filteredPlugins() {
            if (!Array.isArray(this.plugins)) return [];
            return this.plugins.filter(plugin => {
                const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.every(category => plugin.categories.includes(category));
                const matchesPaid = this.selectedPaid === '' || plugin.paid.toString() === this.selectedPaid;
                const matchesVersion = this.selectedVersions.length === 0 || this.selectedVersions.some(version => plugin.version.includes(version));
                const matchesLanguage = this.selectedLanguages.length === 0 || this.selectedLanguages.some(language => plugin.language.includes(language));
                return matchesCategory && matchesPaid && matchesVersion && matchesLanguage;
            });
        },
        paginatedPlugins() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPlugins.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredPlugins.length / this.itemsPerPage);
        }
    },
    methods: {
        fetchPlugins() {
            console.log("Fetching plugins...");
            const currentUrl = window.location.href;
            const filePath = new URL('data/links.json', currentUrl).href;
            console.log("Fetching file from:", filePath);
            fetch(filePath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Plugins fetched:", data);
                    this.plugins = data;
                    this.updateUniqueCategories();
                    this.updateUniqueVersions();
                    this.updateUniqueLanguages();
                })
                .catch(error => console.error('There was a problem with the fetch operation:', error));
        },
        updateUniqueCategories() {
            console.log("Updating unique categories...");
            const categories = new Set();
            this.plugins.forEach(plugin => {
                plugin.categories.forEach(category => categories.add(category));
            });
            this.uniqueCategories = Array.from(categories);
            console.log("Unique categories:", this.uniqueCategories);
        },
        updateUniqueVersions() {
            console.log("Updating unique versions...");
            const versions = new Set();
            this.plugins.forEach(plugin => {
                plugin.version.forEach(version => versions.add(version));
            });
            this.uniqueVersions = Array.from(versions);
            console.log("Unique versions:", this.uniqueVersions);
        },
        updateUniqueLanguages() {
            console.log("Updating unique languages...");
            const languages = new Set();
            this.plugins.forEach(plugin => {
                plugin.language.forEach(language => languages.add(language));
            });
            this.uniqueLanguages = Array.from(languages);
            console.log("Unique languages:", this.uniqueLanguages);
        },
        nameToClass(prefix, name) {
            const formattedName = name.toLowerCase().replace(/\s+/g, '-');
            return `${prefix}-${formattedName}`;
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        updateItemsPerPage(event) {
            this.itemsPerPage = parseInt(event.target.value, 10);
            this.currentPage = 1; // Réinitialiser à la première page lors du changement du nombre d'éléments par page
        }
    },
    mounted() {
        this.fetchPlugins();
    }
}).mount('#app');
