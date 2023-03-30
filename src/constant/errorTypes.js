const { extend } = require("joi");

class CustomError extends Error {
  constructor(message, status = 500) {
    super(message, status);
    this.name = 'CustomError';
    this.status = status;
  }
}
/* ------ Common ------ */
class InvalidArgument extends CustomError {
  constructor(message = '非法的参数') {
    super(message);
    this.name = 'InvalidArgument';
  }
}
class OperateDatabaseError extends CustomError {
  constructor(message = '操作数据库异常') {
    super(message)
    this.name = 'OperateDatabaseError';
  }
}
/* ------ User ------ */
class InsertUserError extends CustomError {
  constructor(message = '创建用户失败') {
    super(message);
    this.name = 'InsertUserError';
  }
}

class UsernameIsOccupied extends CustomError {
  constructor(message = '用户名已存在') {
    super(message)
    this.name = 'UsernameIsOccupied';
  }
}
class UsernameNotExist extends CustomError {
  constructor(message = '用户名不存在') {
    super(message)
    this.name = 'UsernameNotExist';
  }
}
class UsernamePasswordNotMatch extends CustomError {
  constructor(message = '用户名密码不匹配') {
    super(message)
    this.name = 'UsernamePasswordNotMatch';
  }
}
class AccountIsDisabled extends CustomError {
  constructor(message = '账号已被禁用') {
    super(message)
    this.name = 'AccountIsDisabled';
  }
}
class NoAccess extends CustomError {
  constructor(message = '无权访问') {
    super(message)
    this.name = 'NoAccess';
  }
}
class InvalidToken extends CustomError {
  constructor(message = '无效的token') {
    super(message)
    this.name = 'InvalidToken';
  }
}
class UnknownUserId extends CustomError {
  constructor(message = '未知的userId') {
    super(message)
    this.name = 'UnknownUserId';
  }
}
class EmailIsOccupied extends CustomError {
  constructor(message = '邮箱已被占用') {
    super(message)
    this.name = 'EmailIsOccupied';
  }
}


module.exports = {
  InvalidArgument,
  OperateDatabaseError,
  // User
  UsernameIsOccupied,
  UsernameNotExist,
  UsernamePasswordNotMatch,
  AccountIsDisabled,
  NoAccess,
  InvalidToken,
  UnknownUserId,
  EmailIsOccupied,
}