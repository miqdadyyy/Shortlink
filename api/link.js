'use strict';

const MongoAPI = require('../configs/mongo');
const Joi = require('joi');
const slugify = require('slugify');
slugify.extend({'.': '-'});
const {ObjectId} = require('mongodb');
// Set forbidden long or short url
const forbiddenShort = ['assets', 'api'];
const forbiddenLong = [process.env.APP_URL];
const path = require('path');

// function to generate random String
function randomString(length) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (length-- > 0) {
    result += characters[parseInt(Math.random() * 36)];
  }
  return result;
}

// generate random short_url by checking on db
async function generateLink() {
  const lastLink = await MongoAPI.getLastRecord({
    is_custom: false
  }, 'links');
  
  let code = '';
  do {
    code = randomString(8);
  } while (await MongoAPI.findOne({
    short_url: code
  }, 'links'));
  return code;
}

class LinkAPI {
  // Route to get all saved links
  async getAllLinks(req, res) {
    try {
      // Getting all params from url
      const {search, sortBy, descending = 'false', filter, perPage = "10", pageNumber = "1"} = req.query;
      let query = {};
      const sort = {};
      
      // Create search query by using or on long_url and short_url
      if (search) {
        query["$or"] = [
          {long_url: new RegExp(search, 'i')},
          {short_url: new RegExp(search, 'i')}
        ];
      }
      
      // Ordering data
      if (sortBy) {
        sort[sortBy] = descending === 'true' ? -1 : 1;
      }
      
      // Create filter data for is_custom and is_secret by using base64 encryption
      if (filter) {
        const temp = JSON.parse((Buffer.from(filter, 'base64')).toString());
        query = {...query, ...temp};
      }
      
      // Getting result
      const result = await (await MongoAPI.connectMongo())
        .collection('links')
        .find(query)
        .sort(sort)
        .limit(parseInt(perPage))
        .skip((parseInt(pageNumber) - 1) * parseInt(perPage))
        .toArray();
  
      // Geting total items
      const totalItems = await (await MongoAPI.connectMongo())
        .collection('links')
        .find(query)
        .count();
      
      // Response the data
      res.statusCode = 200;
      res.send({
        statusCode: 200,
        message: 'Success',
        data: {
          totalItems: totalItems,
          totalPages: Math.ceil(totalItems / perPage),
          itemsPerPage: parseInt(perPage),
          pageNumber: parseInt(pageNumber),
          items: result
        }
      });
    } catch (e) {
      return new Error(e.message);
    }
  }
  
  // Route to store / save a link
  async storeLink(req, res) {
    try {
      // Create a schema for validation
      const schema = Joi.object({
        short_url: Joi.string().allow(''),
        long_url: Joi.string().uri().required(),
        is_secret: Joi.bool(),
        is_custom: Joi.bool().required(),
        secret_pass: Joi.string()
      });
      
      // Validate the body / request
      let data = schema.validate(req.body);
      // Check there is error or not on validation
      if (data.error) {
        // response 422 Entity Unprocessable
        res.statusCode = 200;
        return res.send({
          statusCode: 422,
          message: data.error.details[0].message
        });
      }
      
      // Change data variable to validated data
      data = data.value;
      
      // Check forbidden Long URL to avoid recursive
      for (const longId in forbiddenLong) {
        if (data.long_url.match(new RegExp(`.*${forbiddenLong[longId]}.*`, 'i'))) {
          return res.send({
            statusCode: 422,
            message: 'Long URL Forbidden ❌'
          });
        }
      }
      
      // Check if request has custom URL
      if (data.is_custom === true) {
        if (!data.short_url) {
          return res.send({
            statusCode: 422,
            message: 'Custom URL Required ❌'
          });
        }
        // Slugify the short-url
        const temp = slugify(data.short_url);
        
        // Checking used URL
        const usedLink = await MongoAPI.findOne({
          short_url: temp
        }, 'links');
        if (usedLink) {
          return res.send({
            statusCode: 422,
            message: 'Link already exists ❌'
          });
        }
        
        // Check forbidden short url too
        if (forbiddenShort.includes(temp)) {
          return res.send({
            statusCode: 422,
            message: 'Shoty Link Forbidden ❌'
          });
        }
        data.short_url = temp;
      } else {
        // Generate a new link
        data.short_url = await generateLink();
      }
      
      if (data.is_secret) {
        if (!data.secret_pass) {
          return res.send({
            statusCode: 422,
            message: 'Secret pass required ❌'
          });
        }
      }
      
      data.created_at = new Date();
      data.updated_at = new Date();
      data.visit_count = 0;
      
      // Insert to DB
      MongoAPI.insertOne(data, 'links');
      
      return res.send({
        statusCode: 200,
        message: 'Create link successfully! 🎉',
        data: data
      });
    } catch (e) {
      return new Error(e.message);
    }
  }
  
  async deleteLink(req, res) {
    try {
      const {id} = req.params;
      await MongoAPI.delete({
        _id: ObjectId(id)
      }, 'links');
      return res.send({
        statusCode: 200,
        message: 'Delete link successfully 🎉'
      });
    } catch (e) {
      return new Error(e.message);
    }
  }
  
  async redirectLink(req, res) {
    try {
      const short_url = req.params.url;
      const link = await MongoAPI.findOne({
        short_url
      }, 'links');
      
      if (link) {
        MongoAPI.updateOne({
          short_url
        }, {
          visit_count: link.visit_count + 1
        }, 'links');
        
        res.redirect(link.long_url);
      } else {
        res.sendFile(path.resolve(__dirname, '../public/404.html'));
        // return new Error('Not Found');
        // res.statusCode = 404;
        // return res.send({
        //   statusCode: 404,
        //   message: 'Link not found! ❌'
        // });
      }
    } catch (e) {
      console.log(e);
      return new Error(e.message);
    }
  }
}

module.exports = new LinkAPI();
