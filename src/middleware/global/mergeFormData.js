const mergeFormData = () => {
  return async (ctx, next) => {
    if(ctx.request.files)
      Object.assign(ctx.request.body, ctx.request.files)
    await next()
  }
} 

module.exports = mergeFormData