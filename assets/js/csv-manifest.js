// Define the CSV file manifest with exact filenames
window.CSV_MANIFEST = {
    editions: {
        6: {
            votes: 'SSC6_Votes_list.csv',
            submissions: 'SSC6_submissions.csv'
        }
    },
    
    getEditionFiles(edition) {
        console.log('Getting files for edition:', edition);
        return this.editions[edition] || null;
    },
    
    getAllEditions() {
        const editions = Object.keys(this.editions).map(Number).sort((a, b) => a - b);
        console.log('Available editions:', editions);
        return editions;
    }
};