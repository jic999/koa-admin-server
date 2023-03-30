const mergeFormData = () => {
  return async (ctx, next) => {
    console.log('ctx.request.files', ctx.request.files)
    if(ctx.request.files)
      Object.assign(ctx.request.body, ctx.request.files)
    await next()
  }
} 

module.exports = mergeFormData