const advancedResults = (model, populate) => async (req, res, next) => {
    
    
    let query;
    //spread the query request object
    const reqQuery = { ...req.query };
    //console.log(reqQuery)

    //remove query parameters
    const removeFields = ['select','sort','page','limit']
    removeFields.forEach(param => delete reqQuery[param])

    let queryString = JSON.stringify(reqQuery);

    //comparison operators
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //console.log(queryString);

    query = model.find(JSON.parse(queryString));

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        //console.log(fields)
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    }
    else {
        query = query.sort('name');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate)
    }

    const results = await query;

    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data:results
    }

    next();
}

module.exports = advancedResults;