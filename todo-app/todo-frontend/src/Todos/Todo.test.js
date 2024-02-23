import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

test('renders todo', async () => {
  const todo = {
    text: 'Fix car',
    done: false
  }

  const completeHandler = jest.fn()
  const deleteHandler = jest.fn()

  render(<Todo todo={todo} 
    onClickComplete={completeHandler} 
    onClickDelete={deleteHandler}/>)

  const element = screen.getByText(todo.text)
  expect(element).toBeDefined()

  await userEvent.click(screen.getByText('Set as done'))
  expect(completeHandler).toHaveBeenCalledTimes(1)

  await userEvent.click(screen.getByText('Delete'))
  expect(deleteHandler).toHaveBeenCalledTimes(1)
})