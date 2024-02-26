const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const Dataloader = require('dataloader')

require('dotenv').config()
const password = process.env.PASSWORD

const pubsub = new PubSub()

const bookLoader = new Dataloader(async (ids) => {
  const books = ids.map(id => Book.find({ author : id}))  
  return books
})

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({})  
      const authorsWithBooks = await Promise.all(authors.map(async(author) => {
        const authorBooks = await bookLoader.load(author.id)
        return {
          id: author.id,
          name: author.name,
          born: author.born,
          bookCount: authorBooks.length
        }
      }))
      return authorsWithBooks
    },
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author')
      }
      else if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author.id, genres: { $in: args.genre } }).populate('author')
      }
      else if (args.author){
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author.id}).populate('author')
      }
      else if (args.genre){
        return Book.find({ genres: { $in: args.genre }}).populate('author')
      }
    },
    findBook: async (root, args) => Book.findOne({ title: args.title }).populate('author'),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const author = new Author({ ...args })
      try {
        await author.save()
      }
      catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      let author = await Author.findOne({ name: args.author })
      if (!author) {        
        author = new Author({ name: args.author })
        try {
          await author.save()
        }
        catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({ ...args, author: author })
      try {
        await book.save()
      }
      catch (error) {
        console.log(error)
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const updatedAuthor = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
      return updatedAuthor
    },
    createUser: async(root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password != password) {
        throw new GraphQLError('wrong credential', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers