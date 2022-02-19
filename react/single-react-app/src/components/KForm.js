import React from "react";
import { Input, Button } from "antd";

function KFormCreate(Comp) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.options = {};
      this.state = {};
    }

    handleChange = (e) => {
      const { name, value } = e.target;
      console.log(`${name} change log: value is: ${value}`);
      this.setState({ [name]: value }, () => {
        this.validateField(name);
      });
    };

    getFieldDec = (field, option) => {
      this.options[field] = option;
      return (InputComp) => (
        <div>
          {React.cloneElement(InputComp, {
            name: field,
            value: this.state[field] || "",
            onChange: this.handleChange,
          })}
          {this.state[field + "Message"] && (
            <p style={{ color: "red" }}>{this.state[field + "Message"]}</p>
          )}
        </div>
      );
    };

    validateField = (field) => {
      const rules = this.options[field].rules;
      // 有一个规则不满足 校验就不通过 some的结果再取反
      const ret = !rules.some((rule) => {
        if (rule.required) {
          if (!this.state[field]) {
            this.setState({ [field + "Message"]: rule.message });
            return true;
          }
        }
        return false;
      });
      if (ret) {
        // 校验成功 异常清空
        this.setState({ [field + "Message"]: "" });
      }
      return ret;
    };

    validate = (cb) => {
      const rets = Object.keys(this.options).map((field) => {
        return this.validateField(field);
      });
      const isValid = rets.every((v) => v === true);
      cb(isValid, this.state);
    };

    render() {
      return <Comp getFieldDec={this.getFieldDec} validate={this.validate} />;
    }
  };
}

@KFormCreate
class KForm extends React.Component {
  onSubmit = () => {
    console.log("submit");
    this.props.validate((isValid, data) => {
      if (isValid) {
        console.log("登录", data);
      } else {
        alert("校验失败!");
      }
    });
  };

  render() {
    const { getFieldDec } = this.props;
    return (
      <div>
        {getFieldDec("uname", {
          rules: [{ required: true, message: "用户名必填" }],
        })(<Input />)}
        {getFieldDec("pwd", {
          rules: [{ required: true, message: "密码必填" }],
        })(<Input />)}
        <Button onClick={this.onSubmit}>登录</Button>
      </div>
    );
  }
}

// 非装饰器写法 套用多个高阶组件时需要顺序调用 比较繁琐
// const newKform = KFormCreate(KForm);
// export default newKform;

export default KForm;
