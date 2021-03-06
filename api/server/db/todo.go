package db

import "fmt"

type Todo struct {
	Id int64
	Title string
	Content string
	UserId int64
}

func (t *Todo) CreateTodo() (int64, error) {
	cmd := `insert into todos (title, content, user_id) values (?, ?, ?)`
	ins, err := Db.Exec(cmd, t.Title, t.Content, t.UserId)
	if err != nil {
		fmt.Printf("Todo追加時にエラーが起きました: %v\n", err)
		return 0, err
	}
	id, err := ins.LastInsertId()
	if err != nil {
		fmt.Printf("最終行のidを取得するときにエラーが起きました。: %v\n", err)
		return 0, err
	}
	return id, nil
}

func GetTodos(userId int64) ([]Todo, error) {
	cmd := `select id, title, content from todos where user_id = ? order by id desc`
	rows, err := Db.Query(cmd, userId)
	if err != nil {
		fmt.Printf("GetTodosでエラーが起きました: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var todos []Todo
	for rows.Next() {
		var todo Todo
		err := rows.Scan(&todo.Id, &todo.Title, &todo.Content)
		if err != nil {
			fmt.Printf("スキャン時にエラーが起きました: %v\n", err)
			return nil, err
		}
		todos = append(todos, todo)
	}
	return todos, nil
}

func (t *Todo) UpdateTodo() error {
	cmd := `update todos set title = ?, content = ? where id = ?`
	_, err := Db.Exec(cmd, t.Title, t.Content, t.Id)
	if err != nil {
		fmt.Printf("Todo更新時にエラーが起きました: %v\n", err)
		return err
	}
	return nil
}

func (t *Todo) DeleteTodo() error {
	cmd := `delete from todos where id = ?`
	_, err := Db.Exec(cmd, t.Id)
	if err != nil {
		fmt.Printf("Todo削除時にエラーが起きました: %v\n", err)
		return err
	}
	return nil
}

func FetchTodo(id int64) (*Todo, error) {
  cmd := `select id, title, content, user_id from todos where id = ?`
  todo := &Todo{}
	err := Db.QueryRow(cmd, id).Scan(&todo.Id, &todo.Title, &todo.Content, &todo.UserId)
	if err != nil {
		fmt.Printf("Todo取得時にエラーが起きました: %v\n", err)
		return nil, err
	}
	return todo, nil
}
