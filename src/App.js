import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
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

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogURL,
      likes: 0,
    }

    blogService
      .create(blogObject)
        .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        console.log(returnedBlog)
        setErrorMessage('a new blog ' + newBlogTitle + ' by ' + newBlogAuthor + ' has been added.')
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogURL('')
        
      })
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem(
      'loggedBlogappUser', JSON.stringify(user)
    ) 
  }

  const handleBlogTitleChange = (event) => {
    console.log(event.target.value)
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    console.log(event.target.value)
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogURLChange = (event) => {
    console.log(event.target.value)
    setNewBlogURL(event.target.value)
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  
  const bloglist = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged-in</p>
        <form onSubmit={handleLogout}>
        <button type="submit">Logout</button>
        </form>
        <h2>Create new note</h2>
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
  )

  return (
    <div>
      <Notification message={errorMessage} />
    {user === null ?
      loginForm() :
      <div>
        {bloglist()}
      </div>
    }
    </div>
  )
}

export default App