// Vérifiez si le fichier app.js est bien lu
console.log("app.js is loaded");

document.addEventListener('alpine:init', function() {
    console.log("Alpine.js initialized");

    Alpine.data('pluginData', function() {
        return {
            plugins: [],
            selectedCategories: [],
            selectedPaid: '',
            selectedVersions: [],

            uniqueCategories: [],
            uniqueVersions: [],

            fetchPlugins() {
                console.log("Fetching plugins...");
                fetch('data/links.json')
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
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
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
                    versions.add(plugin.version);
                });
                this.uniqueVersions = Array.from(versions);
                console.log("Unique versions:", this.uniqueVersions);
            },

            get filteredPlugins() {
                console.log("Filtering plugins with categories:", this.selectedCategories, "paid:", this.selectedPaid, "versions:", this.selectedVersions);
                return this.plugins.filter(plugin => {
                    const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.every(category => plugin.categories.includes(category));
                    const matchesPaid = this.selectedPaid === '' || plugin.paid.toString() === this.selectedPaid;
                    const matchesVersion = this.selectedVersions.length === 0 || this.selectedVersions.includes(plugin.version);
                    return matchesCategory && matchesPaid && matchesVersion;
                });
            }
        };
    });
});
