import { useState, useEffect, memo, useContext} from 'react'

import { makeStyles } from '@mui/styles';
import { Container } from '@mui/material';

import { AuthContext } from '../../App';
import { AddTaskButton } from '../atoms/AddTaskButton';
import { AddTaskDialog } from '../organisms/AddTaskDialog';
import axios from 'axios';
import { UpdateTaskButton } from '../atoms/UpdateTaskButton';
import { UpdateTaskDialog } from '../organisms/UpdateTaskDialog';

const useStyles = makeStyles({
  title: {
    textAlign: 'center',
  },
  buttonWrap: {
    textAlign: 'center',
  },
  todoListWrap: {
    margin: '0 auto',
    width: '30vw',
  },
})

export const Home:React.VFC = memo(() => {
  const classes = useStyles();
  const [addTaskDialogIsOpen, setAddTaskDialogIsOpen] = useState(false);
  const [updateTaskDialogIsOpen, setUpdateTaskDialogIsOpen] = useState(false);
  const [todos, setTodos] = useState<{id:string, title:string,content:string}[]>([]);

  const handleClickAddOpen = () => {
    setAddTaskDialogIsOpen(true);
  };
  const handleClickUpdateOpen = () => {
    setUpdateTaskDialogIsOpen(true);
  };

  const authContext = useContext(AuthContext);

  useEffect(() => {
    axios
    .get('http://localhost:8080/todos',
    { headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authContext.jwt
                }, 
    responseType: 'json' }
    )
    .then(response => {
      console.log('response body:', response.data.data)
      if (response.data.data.todos?.length > 0 ){
        setTodos(response.data.data.todos)
      }
    })
  },[])

  return (
    <>
      <Container>
        <h1 className={classes.title}>TODOアプリ</h1>
        <div className={classes.buttonWrap}>
          <AddTaskButton handleClickOpen={handleClickAddOpen}/>
        </div>
        <div className={classes.todoListWrap}>
          {todos.map((todo) => (
            <div key={todo.id} >
              <p>タスクID:{todo.id}</p>
              <p>タスク名：{todo.title}</p>
              <p>タスク内容：{todo.content}</p>
              <UpdateTaskButton handleClickOpen={handleClickUpdateOpen}/>
              <hr/>
            </div>
          ))}
        </div>
      </Container>

      <AddTaskDialog dialogIsOpen={addTaskDialogIsOpen} setDialogIsOpen={setAddTaskDialogIsOpen} setTodos={setTodos}/>
      <UpdateTaskDialog dialogIsOpen={updateTaskDialogIsOpen} setDialogIsOpen={setUpdateTaskDialogIsOpen}/>
    </>
  )
})
