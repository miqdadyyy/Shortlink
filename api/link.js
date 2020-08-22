const MongoAPI = require('../configs/mongo');
const Joi = require('joi');
const slugify = require('slugify');
const {ObjectId} = require('mongodb');

function randomString(length) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  while (length-- > 0) {
    result += characters[parseInt(Math.random() * 36)];
  }
  return result;
}

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
  ;
  return code;
}

class LinkAPI {
  async getAllLinks(req, res) {
    const result = await MongoAPI.find({}, 'links');
    console.log(result);
    res.statusCode = 200;
    res.send({
      statusCode: 200,
      message: '',
      data: result
    });
  }
  
  async storeLink(req, res) {
    const schema = Joi.object({
      short_url: Joi.string(),
      long_url: Joi.string().uri().required(),
      is_secret: Joi.bool(),
      is_custom: Joi.bool().required(),
      secret_pass: Joi.string()
    });
    
    let data = schema.validate(req.body);
    if (data.error) {
      res.statusCode = 200;
      return res.send({
        statusCode: 422,
        message: data.error.details[0].message
      });
    }
    
    data = data.value;
    
    if (data.is_custom) {
      if (!data.short_url) {
        return res.send({
          statusCode: 422,
          message: 'Custom URL Required ❌'
        });
      }
      const temp = slugify(data.short_url);
      const usedLink = await MongoAPI.findOne({
        short_url: temp
      }, 'links');
      if (usedLink) {
        return res.send({
          statusCode: 422,
          message: 'Link already exists ❌'
        });
      }
      data.short_url = temp;
    } else {
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
    const link = await MongoAPI.insertOne(data, 'links');
    
    res.send({
      statusCode: 200,
      message: 'Create link successfully! 🎉',
      data: data
    });
  }
  
  async deleteLink(req, res) {
    const {id} = req.params;
    await MongoAPI.delete({
      _id: ObjectId(id)
    }, 'links');
    res.send({
      statusCode: 200,
      message: 'Delete link successfully 🎉'
    });
  }
  
  async redirectLink(req, res) {
    const short_url = req.params.url;
    const link = await MongoAPI.findOne({
      short_url
    }, 'links');
    
    if (link) {
      await MongoAPI.updateOne({
        short_url
      }, {
        visit_count: link.visit_count + 1
      }, 'links');
      
      res.redirect(link.long_url);
    } else {
      res.statusCode = 404;
      res.send({
        statusCode: 404,
        message: 'Link not found! ❌'
      });
    }
  }
}

module.exports = new LinkAPI();
