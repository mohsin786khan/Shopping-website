const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    
      req.body.user = req.user.id;
    
    const product = await Product.create(req.body);
   
      res.status(201).json({
          success: true,
          product
      })
      
  })
  
  
// get all the products => api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const size = 4;
    const productCount = await Product.countDocuments();
    
    
    const apiFeatures = new APIFeatures(Product.find(), req.query)
                            .search()
                            .filter()
                            .pagination(size);
    
    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
})


//gets single product information-> /api/vi/product/:id
exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {
    
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('product not found', 404));
    }
   
     res.status(200).json({
         sucess: true,
         product
     })
})


// update product =>  /api/vi/admin/product/:id
exports.updateProduct = catchAsyncErrors (async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler('product not found', 404));     
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        sucess: true,
        product
    })
    
})


// delete product => api/vi/admin/product/:id
exports.deleteProduct = catchAsyncErrors (async (req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

     
    if (!product) {
        return next(new ErrorHandler('product not found', 404));    
    }
   
    await product.remove();

    res.status(200).json({
        sucess: true,
        message:'product is deleted'
    })
    
})
