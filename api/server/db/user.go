package db

import (
	"crypto/rand"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id string
	UserName string
	Email string
	Password string
	HashedPassword []byte 
  Salt           []byte 
}

func (u *User)AddUser() error{
	salt, err := GenerateSalt()
	if err != nil {
    return err
  }
	toHash := append([]byte(u.Password), salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
	if err != nil {
    return err
  }
	u.Salt = salt
  u.HashedPassword = hashedPassword
	cmd := `insert into users (
		username, 
		email, 
		hashedpasseord,
		salt) values (?, ?, ?, ?)`
	_, err = Db.Exec(cmd, u.UserName, u.Email, u.HashedPassword, u.Salt)
	return err
}

func (u *User)LoginUser() (User, error){
	cmd := `select id, username, email, password from users
	where email = ?`
	user2 := User{}

	err = Db.QueryRow(cmd, u.Email).Scan(
		&user2.Id,
		&user2.UserName,
		&user2.Email,
		&user2.Password,)
	return user2, err
}

func GenerateSalt() ([]byte, error) {
  salt := make([]byte, 16)
  if _, err := rand.Read(salt); err != nil {
    return nil, err
  }
  return salt, nil
}
