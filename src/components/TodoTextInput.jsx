import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class TodoTextInput extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    text: PropTypes.string,
    placeholder: PropTypes.string,
    editing: PropTypes.bool,
    newTodo: PropTypes.bool,
  }

  static defaultProps = {
    text: '',
    placeholder: '',
    editing: false,
    newTodo: false,
  }

  state = {
    text: '',
  }

  componentWillReceiveProps(props) {
    this.setState({ test: props.text });
  }

  saveTask = () => {
    this.props.onSave(this.state.text);
  }

  handleSubmit = (e) => {
    const text = e.target.value.trim();
    if (e.which === 13) {
      this.saveTask();
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleBlur = (e) => {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  }

  render() {
    return (
      <div className="container">
        <input
          className={
            classnames({
              'edit': this.props.editing,
              'new-todo': this.props.newTodo,
              'flex-8': true
            })
          }
          type="text"
          placeholder={this.props.placeholder}
          autoFocus="true"
          value={this.state.text}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleSubmit}
        />
        <button
          className="flex-2"
          onClick={this.saveTask}>
          Add Task
        </button>
      </div>
    );
  }
}