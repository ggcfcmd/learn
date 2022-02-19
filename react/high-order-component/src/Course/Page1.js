import React, { Component } from 'react';
import request from 'axios';
import { Button, Table } from 'antd';
import SearchPanel from './SearchPanel';
import hoc from './hoc';

class Page1 extends Component {
  state = {
    query: {
      name: '',
      id: '',
      time: '',
      valid: '',
    },
    dataSource: [],
  };
  columns = [
    { dataIndex: 'label', title: '标签' },
    {
      dataIndex: 'action',
      title: '操作',
      render: (_, record) => {
        const onOpen = () => window.open(`/xxx/${record.id}`);
        return <Button onClick={onOpen}>查看</Button>;
      },
    },
  ];
  onChange = (params) => {
    this.setState((query) => ({ ...query, ...params }));
    request('/api/list', {
      method: 'GET',
      params,
    }).then((res) => {
      // 这⾥暂不考虑异常
      this.setState({ dataSource: res.data });
    });
  };
  componentDidMount() {
    this.onChange(this.state.query);
  }

  render() {
    const { query, dataSource } = this.state;
    return (
      <>
        <SearchPanel value={query} onChange={this.onChange} />
        <Table columns={this.columns} dataSource={dataSource} />
      </>
    );
  }
}

export default hoc(Page1, '/api/list/admin');
