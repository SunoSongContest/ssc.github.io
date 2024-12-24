# SSC Data Files Management

## CSV Files Structure

### Votes List (SSC6_Votes_list.csv)
Required columns:
- Song name
- Week 
- Points
- Weekly rank
- Result (Finalist/2nd Chance/Winner/2nd-place/3rd-place/BBN)
- Voting details (12,10,8,7,6,5,4,3,2,1 points)
- Number of voters
- Average points

### Submissions List (SSC6_submissions.csv) 
Required columns:
- Discord username
- Discord display name
- Suno username
- Song title
- Song URL
- Country
- Brand new
- Week
- Voting code
- Votes
- Finalist
- Welcome message

## Adding New SSC Edition

1. Create two CSV files following the naming convention:

Where x is the edition number

2. Update csv-manifest.js:
```javascript
window.CSV_MANIFEST = {
    editions: {
        6: {
            votes: 'SSC6_Votes_list.csv',
            submissions: 'SSC6_submissions.csv'
        },
        7: {
            votes: 'SSC7_Votes_list.csv', 
            submissions: 'SSC7_submissions.csv'
        }
        // Add new editions here
    }
};
