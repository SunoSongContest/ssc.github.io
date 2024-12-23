// Define the CSV file manifest
window.CSV_MANIFEST = {
    editions: {
        6: {
            votes: 'SSC6_Votes_list.csv',
            submissions: 'SSC6_submissions.csv',
            weeks: 5
        }
    },
    
    getEditionFiles(edition) {
        return this.editions[edition] || null;
    },
    
    getAllEditions() {
        return Object.keys(this.editions).map(Number).sort((a, b) => a - b);
    }
};
