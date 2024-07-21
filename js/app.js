document.addEventListener('alpine:init', () => {
    Alpine.data('pluginData', () => ({
        plugins: [],
        displayedPlugins: [],
        selectedCategories: [],
        selectedPaid: '',
        selectedVersions: [],
        currentIndex: 0,
        itemsPerPage: 10,
        fetchPlugins() {
            fetch('data/links.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    this.plugins = data;
                    this.loadMorePlugins();
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },
        loadMorePlugins() {
            const newPlugins = this.plugins.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
            this.displayedPlugins = [...this.displayedPlugins, ...newPlugins];
            this.currentIndex += this.itemsPerPage;
        },
        get uniqueCategories() {
            const categories = new Set();
            this.plugins.forEach(plugin => {
                plugin.categories.forEach(category => categories.add(category));
            });
            return Array.from(categories);
        },
        get uniqueVersions() {
            const versions = new Set();
            this.plugins.forEach(plugin => {
                versions.add(plugin.version);
            });
            return Array.from(versions);
        },
        get filteredPlugins() {
            return this.displayedPlugins.filter(plugin => {
                const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.every(category => plugin.categories.includes(category));
                const matchesPaid = this.selectedPaid === '' || plugin.paid.toString() === this.selectedPaid;
                const matchesVersion = this.selectedVersions.length === 0 || this.selectedVersions.includes(plugin.version);
                return matchesCategory && matchesPaid && matchesVersion;
            });
        }
    }))
});
