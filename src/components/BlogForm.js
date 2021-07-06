import React, {useState} from 'react' 

const BlogForm = ({ createBlog }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogURL, setNewBlogURL] = useState('')

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


  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlogTitle,
    author: newBlogAuthor,
    url: newBlogURL,
    likes: 0
    })

    setNewBlogTitle('')
    setNewBlogAuthor('')
    setNewBlogURL('')
  }

  return (
    <div>
    
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
  </form> 
    </div>
  )
}

export default BlogForm