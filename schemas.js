const BaseJoi = require("joi");
const sanitize = require("sanitize-html")

const escapeHTML = (joi) => {
    return {
        type: "string",
        base: joi.string(),
        messages: {
            "string.escapeHTML": "{{#label}} must not include HTML"
        },
        rules: {
            escapeHTML: {
                validate(value, helpers){
                    const clean = sanitize(value, {
                        allowedTags : [],
                        allowedAttributes: {}
                    });
                    if(clean !== value){
                        return helpers.error("string.escapeHTML", {value})
                    } return clean
                }
            }
        }
    }
}

const Joi = BaseJoi.extend(escapeHTML)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        averageRating: Joi.number().min(1).max(5),
        creationDate: Joi.number()
    }).required(),
    deleteImages : Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})