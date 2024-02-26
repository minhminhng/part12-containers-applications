import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GET_USER } from '../queries'

const Recommend = ({ show }) => {
  const [ genre, setGenre ] = useState('')
  const userQuery = useQuery(GET_USER, {
    fetchPolicy: 'cache-and-network'
  })

  const user = userQuery.data.me

  const booksQuery = useQuery(ALL_BOOKS, {
    variables: { genre : genre },
    skip: !genre
  })

  useEffect(() => {
    if (user) {
      setGenre(user.favoriteGenre)
    }
  }, [user])

  if (!show) {
    return null
  }

  if (!user) {
    return null
  }

  if (!booksQuery.data) {
    return null
  }

  const books = booksQuery.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      {genre && <div>books in your favorite genre <b>{genre}</b></div>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  )
}

export default Recommend
