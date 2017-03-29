/**
 * Created by Yun on 2016-12-10.
 */

import { computed } from 'mobx';
import camelCase from "camelcase";
import valid from './valid';

function defineComputedProperty(target, name, descriptor) {
  Object.defineProperty(
    target,
    name,
    descriptor
  );
  computed(target, name, descriptor);
}

export function getValidateError() {
  return this.constructor.__validateFields.find(key => this[key]);
}

export function getIsValid() {
  return !this.validateError;
}

export default function validate(reg, msg) {

  const regType = Object.prototype.toString.call(reg)
  const test = (value, model) => {
    if (reg.test) return reg.test(value) ? undefined : (msg || 'ValidationError')
    else if (regType === "[object Function]") return valid(value, reg(value,model))
    else return valid(value, reg);
  }

  return function (target, name, args) {
    const validateName = camelCase('validateError', name);
    const descriptor = {
      configurable: true,
      enumerable: false,
      get: function getter() {
        return test(this[name], this);
      }
    };

    defineComputedProperty(target, validateName, descriptor);

    const clazz = target.constructor;

    if (clazz.hasOwnProperty('__validateFields')) {
      clazz.__validateFields.push(validateName);
    } else {
      Object.defineProperty(clazz, '__validateFields', {
        configurable: true,
        enumerable: false,
        value: [validateName],
      })
    }

    if (!target.hasOwnProperty('validateError')) {
      defineComputedProperty(target, 'validateError', {
        configurable: true,
        enumerable: false,
        get: getValidateError,
      })
    }
    if (!target.hasOwnProperty('isValid')) {
      defineComputedProperty(target, 'isValid', {
        configurable: true,
        enumerable: false,
        get: getIsValid,
      })
    }
  }
}
