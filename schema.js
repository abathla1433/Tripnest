//it is used for server side validation
//joi is  tool for it in which we defines a schema

const Joi=require("joi");


const listingSchema =Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.object({
            url:Joi.string().allow("",null)
        })
    }).required()
}); 

module.exports=listingSchema;
