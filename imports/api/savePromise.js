/* Save an astronomy record and resolve with id on the callback */
// http://jagi.github.io/meteor-astronomy/v2#storing-documents
export default (record, ...args) => new Promise((resolve, reject) => {
    record.save(...args, (err, id) => err ? reject(err) : resolve(id))
  }).catch(() => console.warn('SAVEPROMISE ERROR'))
