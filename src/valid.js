const regRules = {
  /** 必填 */
  required: (target, value) => isNullOrUndefined(target) && value,
  /** 最大值 */
  max: (target, value) => target > value,
  /** 最小值  */
  min: (target, value) => target < value,
  /** 正则 */
  pattern: (target, value) => !isNullOrUndefined(target) && value && value.test && !value.test(target),
  /**
   * @param {String} target
   * @param {Array} value 长度范围 eg: length:[6,15]
   */
  length: (target, value) => {
    if (Object.prototype.toString.call(value) === '[object Array]' && value.length === 2) {
      return !isNullOrUndefined(target) && target.length && target.length > value[0] && target.length < value[1]
    }
  }
}

function valid(target, rule) {
  let rules = [];
  if (Object.prototype.toString.call(rule) === '[object Function]'){
    rules = rule();
  }else if (Object.prototype.toString.call(rule) === '[object Object]') {
    rules = [rule]
  }
  else {
    rules = rule
  }

  console.log('rules',rules);

  for (let r of rules) {
    const { message, ...other } = r
    for (let reg in other) {
      if (regRules[reg](target, r[reg])) {
        return message || tips[reg]
      }
    }
  }
};

export default valid;