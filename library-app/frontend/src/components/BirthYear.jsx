import { useState } from 'react'
import { useMutation } from '@apollo/client'

import Select from 'react-select'

import { ALL_AUTHORS, SET_BIRTHYEAR } from '../queries'

const BirthYear = ({ show, authors, setError }) => {
  const [year, setYear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState("Select an author");

  const [ setBirthYear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS} ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  if (!show) {
    return null
  }

  const options = authors.map(a => {
    return (
      { value: a.name, label: a.name }
    )
  })  

  const submit = async (event) => {
    event.preventDefault()
    
    if (selectedAuthor !== '' && year !== '') {
      setBirthYear({ variables: { name: selectedAuthor.value, setBornTo: parseInt(year) } })
      setSelectedAuthor(null)
      setYear('')
    }
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
      <Select
          defaultInputValue={selectedAuthor}
          onChange={setSelectedAuthor}
          options={options}
        />
        <div>
          born
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthYear