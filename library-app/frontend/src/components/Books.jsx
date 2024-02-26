import { useState } from 'react'
import { useQuery, useSubscription, useApolloClient } from '@apollo/client'

import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { updateCache } from '../App'

const Books = ({ show }) => {
  const [ genre, setGenre ] = useState('')
  // const client = useApolloClient()
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })

  // useSubscription(BOOK_ADDED, {
  //   onData: ({ data }) => {
  //     const addedBook = data.data.bookAdded
  //     window.alert(`'${addedBook.title}' added`)
  //     console.log(client)
  //     client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
  //       return {
  //         allBooks: allBooks.concat(addedBook),
  //       }
  //     })
  //   }
  // })

  if (!show) {
    return null
  }

  if (!result.data) {
    return null
  }

  const books = result.data.allBooks
  const genres = genre ? null : Array.from(new Set(books.flatMap(b => b.genres)))

  return (
    <div>
      <h2>books</h2>
      {genre && <div>in genre <b>{genre}</b></div>}
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
      <button key="all" onClick={() => setGenre('')}>all genres</button>
      {!genre && genres.map(g => <button key={g} onClick={() => setGenre(g) }>{g.toLowerCase()}</button>)}
      
    </div>
  )
}

export default Books
