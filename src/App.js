import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService
    .getAll()
    .then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {

    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        
      })
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem(
      'loggedBlogappUser', JSON.stringify(user)
    ) 
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const blogFormRef = useRef()

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const bloglist = () => (
    <div>
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
    <BlogForm createBlog={addBlog} />
  </Togglable>
  <br />
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
        </div>
  )

  
  /* const bloglist2 = () => (
    <div>
      <h2>blogs</h2>
   
        <h2>Create new blog</h2>
        <form onSubmit={addBlog}>
        Title: <input
          value={newBlogTitle}
          onChange={handleBlogTitleChange}
        /><br />
        Author: <input
          value={newBlogAuthor}
          onChange={handleBlogAuthorChange}
        /><br />
        URL:  <input
          value={newBlogURL}
          onChange={handleBlogURLChange}
        />
        <br />
        <button type="submit">save</button>
      </form>  <br />
      {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
  </div>
  ) */

  return (
    <div>
      <Notification message={errorMessage} />
    {user === null ?
      loginForm() :
      <div>
           <p>{user.name} logged-in</p>
        <form onSubmit={handleLogout}>
        <button type="submit">Logout</button>
        </form>
        {bloglist()}
      </div>
    }
    </div>
  )
}

export default App