const qiniu = require('qiniu');

const {
  QINIU_ACCESS_KEY,
  QINIU_SECRET_KEY,
  QINIU_BUCKET,
  QINIU_DOMAIN,
  QINIU_PREFIX,
} = require('../conf/env')

const mac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY);

const options = {
  scope: QINIU_BUCKET,
  saveKey: `${QINIU_PREFIX}\${etag}\${ext}`,
}

const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

const putExtra = new qiniu.form_up.PutExtra()

const formUploader = new qiniu.form_up.FormUploader()

const config = new qiniu.conf.Config();
const bucketManager = new qiniu.rs.BucketManager(mac, config);

function qiniuUploadToken(options) {
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}
function qiniuUpload(file) {
  // 自动以文件hash作为文件名
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, undefined, file.filepath, putExtra, (err, body, info) => {
      if(err) reject(err)
      else 
        resolve({ ...body, url: `//${QINIU_DOMAIN}/${body.key}`})
    })
  })
}
function qiniuUploadList (files) {
  const promises = files.map((file) => qiniuUpload(file))
  return Promise.all(promises)
}
/**
 * 
 * @param {String} url 
 * @returns {Promise}
 */
function qiniuDelete(url) {
  // const key = url.match(/[^\/]+\/[^\/]+$/)[0]
  const key = url.replace(`//${QINIU_DOMAIN}/`, '')
  return new Promise((resolve, reject) => {
    bucketManager.delete(QINIU_BUCKET, key, (err, _, info) => {
      if(info.statusCode)
        resolve(true)
      else {
        reject(err)
      }
    })
  })
}
function qiniuDeleteList(urls) {
  const promises = urls.map((url) => qiniuDelete(url))
  return Promise.all(promises)
}

module.exports = {
  qiniuUpload,
  qiniuUploadList,
  qiniuDelete,
  qiniuDeleteList,
  qiniuUploadToken,
}