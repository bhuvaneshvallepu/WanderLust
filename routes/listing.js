const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")


const validateListing=(req,res,next)=>{
    let (error)= listingSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
     next();
    }
 };


//Index route

//Index route

router.get("/listings", async (req, res, next) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        next(err);  // Pass the original error to the error-handling middleware
    }
});

   
   //New Route
   router.get("/new", isLoggedIn,(req, res) => {
       res.render("listings/new.ejs");
   });
   
   //show Route
   router.get("/:id",wrapAsync(async(req,res)=>{
        let {id} =req.params;
       const listing= await Listing.findById(id).populate("reviews");
       if(!listing){
        req.flash("error","Listing you requested for doesnot exsist!");
       res.redirect("/listings");
    }
       res.render("listings/show.ejs",{listing});
   }));
   
   //create route
   router.post("/",(async(req,res,next)=>{
       
      const newListing=new Listing(req.body.listing);
      
      await newListing.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings"); 
   })
   );

   
//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesnot exsist!");
       res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//update Route
router.put("/:id",(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","New Listing Updated!");
    res.redirect("/listings");
})
);

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings")
}));

module.exports=router;