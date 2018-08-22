import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';
import Moment from 'moment';

import {
  TODOS_AJAX_FAILURE,
  TODOS_FETCH_REQUEST,
  TODOS_FETCH_SUCCESS,
  TODOS_ADD_REQUEST,
  TODOS_ADD_SUCCESS,
  TODOS_REMOVE_REQUEST,
  TODOS_REMOVE_SUCCESS,
  TODOS_COMPLETE_REQUEST,
  TODOS_COMPLETE_SUCCESS,
  TODOS_EDIT_REQUEST,
  TODOS_EDIT_SUCCESS,
  TODOS_REMOVE_COMPLETED_REQUEST,
  TODOS_REMOVE_COMPLETED_SUCCESS,
} from '../constants/ActionNames';

const createErrorAction = message => error => Observable.of({
  type: TODOS_AJAX_FAILURE,
  error,
  message,
});

const fetchTodos = action$ =>
  action$.ofType(TODOS_FETCH_REQUEST)
    .mergeMap(() =>
      ajax.getJSON(`${process.env.REACT_APP_API_HOST}/todos`)
        .map(response => ({ type: TODOS_FETCH_SUCCESS, payload: response }))
        .catch(createErrorAction('Failed to fetch tasks')),
    );

const addTodo = action$ =>
  action$.ofType(TODOS_ADD_REQUEST)
    .mergeMap(action =>
      ajax.post(`${process.env.REACT_APP_API_HOST}/todos`, {
        text: action.text,
        completed: false,
        createdAt: Moment().format()
      }, { 'Content-Type': 'application/json' })
        .map(({ response }) => ({ type: TODOS_ADD_SUCCESS, id: response.id, text: action.text }))
        .catch(createErrorAction('Failed to add a new task')),
    );

const removeTodo = action$ =>
  action$.ofType(TODOS_REMOVE_REQUEST)
    .mergeMap(action =>
      ajax.delete(`${process.env.REACT_APP_API_HOST}/todos/${action.id}`)
        .map(() => ({ type: TODOS_REMOVE_SUCCESS, id: action.id }))
        .catch(createErrorAction(`Failed to remove task #${action.id}`)),
    );

const completeTodo = action$ =>
  action$.ofType(TODOS_COMPLETE_REQUEST)
    .mergeMap(action =>
      ajax.patch(`${process.env.REACT_APP_API_HOST}/todos/${action.id}`, {
        completed: !action.completed,
        completedAt: Moment().format()
      }, { 'Content-Type': 'application/json' })
        .map(() => ({ type: TODOS_COMPLETE_SUCCESS, id: action.id }))
        .catch(createErrorAction(`Failed to mark task #${action.id} as completed`)),
    );

const removeCompletedTodos = (action$, { getState }) =>
  action$.ofType(TODOS_REMOVE_COMPLETED_REQUEST)
    .mergeMap(() => Observable.forkJoin(
        ...getState().todos.data.filter(todo => todo.completed).map(todo =>
          ajax.delete(`${process.env.REACT_APP_API_HOST}/todos/${todo.id}`),
        ),
      )
      .map(() => ({ type: TODOS_REMOVE_COMPLETED_SUCCESS }))
      .catch(createErrorAction('Failed to remove all completed tasks')),
    );

const editTodo = action$ =>
  action$.ofType(TODOS_EDIT_REQUEST)
    .mergeMap(action =>
      ajax.patch(`${process.env.REACT_APP_API_HOST}/todos/${action.id}`, {
        text: action.text,
      }, { 'Content-Type': 'application/json' })
        .map(() => ({ type: TODOS_EDIT_SUCCESS, id: action.id, text: action.text }))
        .catch(createErrorAction(`Failed to edit task #${action.id}`)),
    );

export default combineEpics(
  fetchTodos,
  addTodo,
  removeTodo,
  completeTodo,
  removeCompletedTodos,
  editTodo,
);
