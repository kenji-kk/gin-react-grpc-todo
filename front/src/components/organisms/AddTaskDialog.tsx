import { useState, useContext, memo } from 'react';
import { makeStyles } from '@mui/styles';
import { AuthContext } from '../../App';
import client from '../../api/client';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


interface Props {
  dialogIsOpen: boolean;
  setDialogIsOpen: (value: boolean) => void;
  setTodos: any
}

const useStyles = makeStyles({
  dummy: {
    width: '40vw',
  },
  title: {
    textAlign: 'center'
  }
})

export const AddTaskDialog:React.VFC<Props> = memo(({dialogIsOpen, setDialogIsOpen, setTodos}) =>{
  const classes = useStyles();
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const authContext = useContext(AuthContext);


  const handleClose = () => {
    setDialogIsOpen(false);
  };

  const handleSubmit = async () => {
    client.
    post('todos',
    {Title: title, Content: content},
    { headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authContext.jwt
                }, 
      responseType: 'json' 
    }
    )
    .then(response => {
      console.log('response body:', response.data.data)
      setTodos((prevTodos:any) => [...prevTodos, response.data.data])
      handleClose()
      setTitle("")
      setContent("")
    }
    )
    }

  return (
    <div>
        <Dialog open={dialogIsOpen} onClose={handleClose}>
          <div className={classes.dummy}></div>
          <DialogTitle className={classes.title}>タスク作成フォーム</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="タスク名"
              type="text"
              fullWidth
              variant="standard"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <br/>
            <br/>
            <br/>
            <TextField
              margin="dense"
              id="name"
              label="タスク内容"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="standard"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>閉じる</Button>
            <Button onClick={handleSubmit}>作成</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
})
