import { ajax } from 'rxjs/observable/dom/ajax';
import Moment from 'moment';

class TodoApiService {

  static listAll() {
    return ajax.getJSON(`${process.env.REACT_APP_API_HOST}/todos`);
  }

  static addNew(text) {
    return ajax.post(`${process.env.REACT_APP_API_HOST}/todos`, {
      text,
      completed: false,
      createdAt: Moment().utc()
    })
  }

  static edit(id, text) {
    return ajax.patch(`${process.env.REACT_APP_API_HOST}/todos/${id}`, {
      text: text,
    })
  }

  static delete(id) {
    return ajax.delete(`${process.env.REACT_APP_API_HOST}/todos/${id}`);
  }

  static updateComplete(id, completed) {
    return ajax.patch(`${process.env.REACT_APP_API_HOST}/todos/${id}`, {
      completed: !completed,
      completedAt: Moment().utc()
    })
  }

}

export default TodoApiService;
