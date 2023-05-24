export const mongoPlugin = function (schema) {
  // Transform '_id' to 'id' in the document
  schema.set('toJSON', { virtuals: true });
  schema.options.toJSON.transform = function (doc, ret) {
    ret.id = ret?._id?.toString();
    delete ret._id;
    delete ret.__v;
  };
};
module.exports = mongoPlugin;
