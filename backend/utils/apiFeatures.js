class ApiFeatures {

    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
    }

    search() {
        const keyword = this.querystr.keyword ? {
            
            name: {
                $regex: this.querystr.keyword,
                $options: 'i'
            }
        } : {}

        // console.log(keyword)    
        this.query = this.query.find({ ...keyword });
        return this;
    }

    
    filter() {
        const querycopy = { ...this.querystr };

        // Removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];         
        removeFields.forEach(el => delete querycopy[el]);

       // console.log(querycopy);


        // advance filter for price, rating etc   
        let querystr = JSON.stringify(querycopy);
        let str = /\b(gt|gte|lt|lte)\b/g;
        querystr = querystr.replace(str,'$$'+'$1');      // $1 indicates that the matched substring is to be replaced by the first captured group
        

        //console.log(querystr);
        this.query = this.query.find(JSON.parse(querystr));                                      
        return this;                                                             
        
    }

    pagination(size) {
        const currentPage = Number(this.querystr.page) || 1;
        const skip = size * (currentPage - 1);

        this.query = this.query.limit(size).skip(skip);
        return this;
    }


}


module.exports = ApiFeatures;
