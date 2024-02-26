import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author{
      name
    }
    published
    genres
    id
  }
`

export const ALL_AUTHORS = gql`
  query allAuthors{    
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const GET_USER = gql`    
    query me{
      me {
      username
      favoriteGenre
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($author: String, $genre: String) {    
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $published: Int, $author: String!, $genres: [String]) 
  {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
    }
  }
`

export const SET_BIRTHYEAR = gql`
  mutation setBirthYear($name: String!, $setBornTo: Int!) 
  {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!)
  {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`