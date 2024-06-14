const pool = require('../config/database'); // Assuming you have a database connection pool

exports.getUserActivity = async (req, res) => {
    try {
        const uniqueVisitorsQuery = 'SELECT COUNT(DISTINCT "userId") AS "uniqueVisitors" FROM lookups';
        const searchesPerDayQuery = `
            SELECT 
                DATE("createdAt") AS "date",
                COUNT(*) AS "searchCount"
            FROM lookups
            GROUP BY "date"
            ORDER BY "date" ASC`;

        const popularSearchTermsQuery = `
            SELECT 
                term,
                COUNT(*) AS "count"
            FROM lookups
            GROUP BY term
            ORDER BY "count" DESC
            LIMIT 10`;

        const uniqueVisitorsResult = await pool.query(uniqueVisitorsQuery);
        const searchesPerDayResult = await pool.query(searchesPerDayQuery);
        const popularSearchTermsResult = await pool.query(popularSearchTermsQuery);

        res.status(200).json({
            uniqueVisitors: uniqueVisitorsResult.rows[0].uniqueVisitors,
            searchesPerDay: searchesPerDayResult.rows,
            popularSearchTerms: popularSearchTermsResult.rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getWordAnalytics = async (req, res) => {
    try {
        const totalWordsQuery = 'SELECT COUNT(*) AS "totalWords" FROM words';
        const activeWordsQuery = 'SELECT COUNT(*) AS "activeWords" FROM words WHERE status = \'Active\'';
        const pendingWordsQuery = 'SELECT COUNT(*) AS "pendingWords" FROM words WHERE status = \'Pending\'';
        const newWordsPerDayQuery = `
            SELECT 
                DATE("createdAt") AS "date",
                COUNT(*) AS "wordCount"
            FROM words
            GROUP BY "date"
            ORDER BY "date" ASC`;

        const wordUpdatesPerDayQuery = `
            SELECT 
                DATE("updatedAt") AS "date",
                COUNT(*) AS "updateCount"
            FROM words
            GROUP BY "date"
            ORDER BY "date" ASC`;

        const frequentlyLookedUpWordsQuery = `
            SELECT 
                term,
                lookupCount
            FROM words
            ORDER BY lookupCount DESC
            LIMIT 10`;

        const totalWordsResult = await pool.query(totalWordsQuery);
        const activeWordsResult = await pool.query(activeWordsQuery);
        const pendingWordsResult = await pool.query(pendingWordsQuery);
        const newWordsPerDayResult = await pool.query(newWordsPerDayQuery);
        const wordUpdatesPerDayResult = await pool.query(wordUpdatesPerDayQuery);
        const frequentlyLookedUpWordsResult = await pool.query(frequentlyLookedUpWordsQuery);

        res.status(200).json({
            totalWords: totalWordsResult.rows[0].totalWords,
            activeWords: activeWordsResult.rows[0].activeWords,
            pendingWords: pendingWordsResult.rows[0].pendingWords,
            newWordsPerDay: newWordsPerDayResult.rows,
            wordUpdatesPerDay: wordUpdatesPerDayResult.rows,
            frequentlyLookedUpWords: frequentlyLookedUpWordsResult.rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getUserRequestAnalytics = async (req, res) => {
    try {
        const totalRequestsQuery = 'SELECT COUNT(*) AS "totalRequests" FROM user_requests';
        const openRequestsQuery = 'SELECT COUNT(*) AS "openRequests" FROM user_requests WHERE status = \'Open\'';
        const resolvedRequestsQuery = 'SELECT COUNT(*) AS "resolvedRequests" FROM user_requests WHERE status = \'Resolved\'';
        const newRequestsPerDayQuery = `
            SELECT 
                DATE("createdAt") AS "date",
                COUNT(*) AS "requestCount"
            FROM user_requests
            GROUP BY "date"
            ORDER BY "date" ASC`;

        const averageTimeToResolveQuery = `
            SELECT 
                AVG(EXTRACT(EPOCH FROM ("updatedAt" - "createdAt"))) AS "averageTime"
            FROM user_requests
            WHERE status = 'Resolved'`;

        const requestsByTypeQuery = `
            SELECT 
                type,
                COUNT(*) AS "count"
            FROM user_requests
            GROUP BY type`;

        const totalRequestsResult = await pool.query(totalRequestsQuery);
        const openRequestsResult = await pool.query(openRequestsQuery);
        const resolvedRequestsResult = await pool.query(resolvedRequestsQuery);
        const newRequestsPerDayResult = await pool.query(newRequestsPerDayQuery);
        const averageTimeToResolveResult = await pool.query(averageTimeToResolveQuery);
        const requestsByTypeResult = await pool.query(requestsByTypeQuery);

        res.status(200).json({
            totalRequests: totalRequestsResult.rows[0].totalRequests,
            openRequests: openRequestsResult.rows[0].openRequests,
            resolvedRequests: resolvedRequestsResult.rows[0].resolvedRequests,
            newRequestsPerDay: newRequestsPerDayResult.rows,
            averageTimeToResolve: averageTimeToResolveResult.rows[0].averageTime,
            requestsByType: requestsByTypeResult.rows,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
