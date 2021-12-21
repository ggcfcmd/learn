// 输入框 可添加商品类型
// 购物车 可增减商品
// 商品列表 需维护数量
import React, { Component } from "react";

export default class CartSample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goods: [
        { id: 1, text: "前端课程" },
        { id: 2, text: "后端课程" },
      ],
      text: "",
      cart: [],
    };
  }

  addGood = () => {
    this.setState((preState) => {
      return {
        goods: [
          ...preState.goods,
          {
            id: preState.goods.length + 1,
            text: preState.text,
          },
        ],
      };
    });
  };

  textChange = (e) => {
    console.log(e.target.value);
    this.setState({ text: e.target.value });
  };

  addToCart = (good) => {
    const copyCart = [...this.state.cart];
    const item = copyCart.find((item) => item.id === good.id);
    if (item) {
      item.count = item.count + 1;
    } else {
      copyCart.push({ ...good, count: 1 });
    }

    this.setState({ cart: copyCart });
  };

  minus = (good) => {
    const copyCart = [...this.state.cart];
    const item = copyCart.find((item) => item.id === good.id);
    if (item.count > 0) {
      item.count = item.count - 1;
      this.setState({ cart: copyCart });
    }
  };

  add = (good) => {
    const copyCart = [...this.state.cart];
    const item = copyCart.find((item) => item.id === good.id);
    item.count = item.count + 1;
    this.setState({ cart: copyCart });
  };

  render() {
    const { title } = this.props;
    return (
      <div>
        {title && <h1>{title}</h1>}
        <div>
          <input
            type="text"
            value={this.state.text}
            onChange={this.textChange}
          />
          <button onClick={this.addGood}>添加商品</button>
        </div>
        <ul>
          {this.state.goods.map((good) => (
            <li key={good.id}>
              {good.text}
              <button onClick={() => this.addToCart(good)}>加购</button>
            </li>
          ))}
        </ul>
        <Cart data={this.state.cart} minus={this.minus} add={this.add} />;
      </div>
    );
  }
}

// eslint-disable-next-line
function Cart({ data, minus, add }) {
  return (
    <table>
      <tbody>
        {data.map((d) => (
          <tr key={d.id}>
            <td>{d.text}</td>
            <td>
              <button
                onClick={() => {
                  minus(d);
                }}
              >
                -
              </button>
              <span>{d.count}</span>
              <button
                onClick={() => {
                  add(d);
                }}
              >
                +
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
