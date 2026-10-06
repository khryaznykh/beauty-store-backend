const Product = require('../products/model');
const Review = require('./model')

class ReviewsController {
    //logged in CUSTOMER
    async createReview (req, res) {
        try{
            const { productId } = req.params; //product id
            const { rating, headline, review, recommend } = req.body;
              // User id comes from JWT
            const userId = req.user.id;

            const productExists = await Product.findById(productId);
            if(!productExists){
                return res.status(404).json({message:"Product's not found"})
            }

            const newReview = new Review({
                headline,
                rating,
                review,
                recommend,

                status: "PENDING",
                product: productId,
                user: userId
            })

            await newReview.save();
            res.status(200).json({message:"Review is successfully saved!", data: newReview})
        } catch(error) {
            console.error("Error occurred during creating the review")
            res.status(500).json({message:"Error occurred during creating the review", error: error.message})
        }
    }

    async getMyReviews(req,res) {
        try{
            const userId = req.user.id;
            //console.log("Logged in user ID:", userId);

            const review = await Review.find({user: userId})
                .populate("product", "name image")  //populates only name and image field from product API
                                                    //using just "product" will give all the fields, including those that you may not need
                .sort({createdAt:-1});

               // console.log("My reviews", review);

            res.status(200).json({message: "Your reviews has been populated successfully!", review})
        }catch(error){
            console.log(error)
            res.status(400).json({message:"Error occurred during populating your reviews", error: error.message})
        }
    }

    //edit their own reviews
    async editMyReview (req,res) {
        try{
            const { reviewId } = req.params;
            const userId = req.user.id;
            const { headline,
                    rating,
                    review,
                    recommend
                            } = req.body;

            const updatedReview = await Review.findOneAndUpdate(
                {
                    _id: reviewId,
                    user: userId
                },
                {
                    headline,
                    rating,
                    review,
                    recommend,
                    status: "PENDING", 
                    editedAt: new Date()
                },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );

            if (!updatedReview) {
                return res.status(404).json({
                    message: "Review not found or you don't have permission to edit it"
                });
            }

            res.status(200).json({
                message: "Review has been updated!", 
                data: updatedReview
            })

        } catch(e) {
            console.log(e)
            res.status(400).json({message: e.message || "Error occurred during review editing"})
        }
    }

     //delete their own reviews
    async deleteMyReview (req,res) {
        try{
            const { reviewId } = req.params;
            const userId = req.user.id;

            const reviewToDelete = await Review.findOneAndDelete(
                {                    //findOne not findById because we need to check both
                    _id: reviewId,   // Is this the correct review?
                    user: userId     // Does it belong to this logged-in user?
                },
            )

            if(!reviewToDelete) {
                return res.status(404).json({
                    message: "Review not found or you don't have permission to delete it"
                })
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: e.message || "Error occurred during review deleting"
            })
        }
    }

    //for ADMIN
    async getAdminAllReviews(req,res) { //sort by timestamp for admin
        try{
            //adding filtering for Admin on backend
            const { status } = req.query; //query from frontend
            const filter = {};
            if (status) {
                const allowedStatuses = [
                    "PENDING",
                    "PUBLISHED",
                    "REJECTED"
                ]
                if(!allowedStatuses.includes(status)){
                    return res.status(404).json({
                        message:"Invalid review status"
                    })
                }

                filter.status=status
            }

            const reviews = await Review.find(filter) //if no status returns all
                .populate("product", "name image")
                .populate("user", "firstName lastName")
                .sort({createdAt: -1})

            res.status(200).json({
                message: "Reviews are successfully recieved!",
                data: reviews
            })
            
        }catch(e){
            console.log(e)
            res.status(400).json({
                message: e.message || "Error occurred during fetching all reviews"
            })
        }
    }
    //publish/reject ADMIN
    async changeReviewStatus(req,res) {
        try{
            const { reviewId } = req.params;
            const { status } = req.body;
            const allowedStatuses = [
                "PENDING",
                "PUBLISHED",
                "REJECTED"
            ]
            
            if(!allowedStatuses.includes(status)){
                return res.status(404).json({
                    message:"Invalid review status"
                })
            }
            
            const updatedReview = await Review.findByIdAndUpdate(
                reviewId,
                { status },
                {
                    returnDocument: "after",
                    runValidators: true
                }
            )

            if (!updatedReview) {
                return res.status(404).json({
                    message: "Review not found"
                });
            }

            res.status(200).json({
                message: "Status of the review changed successfully!",
                data: updatedReview
            })

        } catch(e) {
            console.log(e)
            res.status(400).json({
                message: e.message ||"Error occurred during status change",
            })
        }
    }

    //public - published reviews only
    async getPublishedReviews(req,res) {
        try{
            const { productId } = req.params;

            const publishedReviews = await Review
                .find({             ///if nothis find then find returns [] aka null no need in if(!publishedReviews)
                    product: productId,
                    status: "PUBLISHED"
                })
                .populate("user", "firstName lastName")
                .sort({createdAt: -1})

            const totalRating = publishedReviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );

            const averageRating = publishedReviews.length
                ? totalRating / publishedReviews.length
                : 0;

            res.status(200).json({
                message: "Reviews for the product",
                data: publishedReviews,
                averageRating,
                totalReviews: publishedReviews.length
            });
        } catch(e) {
            console.log(e)
            res.status(400).json({
                message: e.message ||"Error occurred during fetching of the reviews",
            })
        }
    }

}

module.exports = new ReviewsController();