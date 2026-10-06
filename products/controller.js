const Product = require('./model')

class ProductController {
    async createProduct (req,res) {
        try{
            const { name, manufactor, image, price, description, size, tag } = req.body;
            const newProduct = new Product ({name, manufactor, image, price, description, size, tag});
            await newProduct.save();
            res.status(201).json({message:"Product succesfully created", data: newProduct})
        } catch(error) {
            console.error("Error occured during product creating:", error)
            res.status(500).json({message: "Error occured during product creating", error: error.message})
        }
    }

    async getAllProducts (req,res) {
        try{
            const products = await Product.find().sort({createdAt:-1});
            res.status(201).json({message:"The list of all products received!", data: products})
        } catch(error) {
            console.error("Error occured during products fetch:", error);
            res.status(500).json({message:"Server Error", error: error.message})
        }
    }

    async getProductById (req,res) {
        try{
            const { id } = req.params;
            const productExists = await Product.findById(id)
            if (!productExists) {
                return res.status(404).json({message:"Product is not found"})
            }

            res.status(200).json({message: "Product is found:", data: productExists})
        }catch(error){
            console.error("Error occured during the request", error)
            res.status(500).json({message:"Error occured during the request", error: error.message})
        }
    }

    async updateProduct (req,res) {
        try{
            const { id } = req.params;
            const updatedData = req.body;
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
                returnDocument: "after",
                runValidators: true
            });
            if(!updatedProduct) {
                return res.status(404).json({message: "Product isn't found"})
            }
            res.status(200).json({message: "Product successfully updated!", data: updatedProduct})

        }catch(error){
            console.error("Error occured during the update request:", error)
            res.status(500).json({message: "Error occured during the update request", error: error.message})
        }
    }

    async deleteProduct (req,res) {
        try{
            const { id } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(id);
            if(!deletedProduct) {
                return res.status(404).json({message: "Product's not found"})
            }
            res.status(200).json({message:"Product is succesfully deleted from the database", data: deletedProduct})
        } catch(error) {
            console.error("Error occurred during the delete request")
            res.status(500).json({message:"Error occurred during the delete request", error: error.message})
        }
    }
}

module.exports = new ProductController();