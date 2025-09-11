const crypto = require('crypto');

exports.handler = async function(event){
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET || 'lovenow-direct-upload';
  if(!apiKey || !apiSecret){
    return { statusCode:500, headers:{'Access-Control-Allow-Origin':'*'}, body:'Missing Cloudinary config' };
  }
  const timestamp = Math.round(Date.now()/1000);
  const toSign = `timestamp=${timestamp}&upload_preset=${preset}` + apiSecret;
  const signature = crypto.createHash('sha1').update(toSign).digest('hex');
  return {
    statusCode:200,
    headers:{'Access-Control-Allow-Origin':'*'},
    body: JSON.stringify({ timestamp, signature, apiKey, preset })
  };
};

