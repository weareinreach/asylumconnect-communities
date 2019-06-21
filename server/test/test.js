//Set the env variable to test
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const User = require('../app/models/User')

//Require the dev-dependencies 
const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should()
const testHelpers = require('./testsHelper')
const {
  createCategory,
  createSubcategory,
  createThread,
  createComment
} = testHelpers

chai.use(chaiHttp)

//parent block
describe('Users', () => {
  beforeEach((done) => { //Before each test we empty the test database
    User.remove({}, (err) => {
      done()
    })
  })

  //testing sign up POST method. This test should sign up a new user 
  //and save the user to the test database
  describe('/POST signup', () => {
    it('it should sign up a new user', (done) => {
      // provide username and password
      const user = {
        username: 'username',
        password: 'password',
      }
      chai.request(server)
        .post('/api/signup') //route being tested
        .send(user) //send the user information to db
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('username')
          done()
        })
    })
  })

  //testing login POST method. This test should login a user 
  //that has an account. If this user does not have an account then 
  //the user should not be able to login. 
  describe('/POST login', () => {
    it('it should not login a user that does not have an account', (done) => {
      //a user with this account does not exist. this test should pass because 
      //this user will not be able to login
      const user = {
        username: 'geoffery',
        password: 'badperson',
      }
      chai.request(server)
        .post('/api/login') //route being tested
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          expect(res).to.not.have.cookie('auth_data') // expect the cookie to not have this user
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          done()
        })
    })
  })

  //testing login POST method with bad credentials. Providing bad credentials, 
  //if this test passes it means user was not able to login 
  describe('/POST login: bad credentials', () => {
    it('it should return fail response after login with bad credentials', (done) => {
      //password is not a minimum of 8 characters and username does not exist
      const user = {
        username: 'geoffery',
        password: '',
      }
      chai.request(server)
        .post('/api/login') //route being tested
        .send(user)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('user-validation') //validate user login information
          done()
        })
    })
  })

  //testing hydrate GET method. If user exists in the DB this test 
  //is successful  
  describe('/GET hydrate', () => {
    it('it should return user is authenticated', (done) => {
      //valid username and password provided 
      const user = {
        username: 'username',
        password: 'password',
      }
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, and will send it
          // back to the server in the next request:
          return agent.get('/api/hydrate') //route being tested
            .then(function (res) {
              expect(res).to.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('status')
              res.body.should.have.property('data')
              agent.close()
              done()
            })
        })
    })
  })

  //testing logout POST method. This test is successful if user is logged out
  describe('/POST logout', () => {
    it('it should return user is logged out', (done) => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, 
          // and will send it back to the server in the next 
          // request: 
          return agent.post('/api/logout') //route being tested
            .then(function (res) {
              expect(res).to.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('status')
              res.body.should.have.property('data')
              expect(res.body.data).to.be.null //response should be null b/c user is logged out
              agent.close()
              done()
            })
        })
    })
  })

  //testing categories POST method. This test is successful 
  //if a user is logged in and a new category is created under the 'agent'
  describe('/POST categories', () => {
    it('it should create a new category after logged in', (done) => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, and will send it
          // back to the server in the next request:
          const title = 'Books' //setting the category title
          const category = {
            title: title,
          }
          return agent
            .post('/api/categories')  //route being tested
            .send(category)
            .then(function (res) {
              expect(res).to.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('status')
              res.body.should.have.property('data')
              res.body.data.should.have.property('category')
              res.body.data.category.should.have.property('subcategories')
              expect(res.body.data.category.subcategories).to.be.an('array')
              expect(res.body.data.category.title).to.equal(title)
              agent.close()
              done()
            })
        })
    })
  })

  //testing category GET method. Is successful if a category is 
  //found when the categoryId is provided as a query paramter
  describe('/GET a category', () => {
    it('it should get a single category', async () => {
      const createdCategory = await createCategory()
      const categoryId = String(createdCategory._id)
      chai.request(server)
        .get('/api/categories') //route being tested
        .query({ categoryId: categoryId })
        .end((err, res) => {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('category')
          res.body.data.category.should.have.property('title')
          res.body.data.category.should.have.property('subcategories')
          res.body.data.category.should.have.property('date')
        })
    })
  })

  //testing subcategories POST method. This test is successful 
  //if a user is logged in and a new subcategory is created under the 'agent'
  describe('/POST subcategories', () => {
    it('it should create a new subcategory after logged in', (done) => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const subcategory = {}
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, and will send it
          // back to the server in the next request:
          createCategory()
            .then(category => {
              const title = 'Adventure' //subcategory title
              subcategory['title'] = title
              subcategory['categoryId'] = category._id
              return agent
                .post('/api/subcategories') //route being tested
                .send(subcategory)
                .then(function (res) {
                  expect(res).to.have.status(201)
                  res.body.should.be.a('object')
                  res.body.should.have.property('status')
                  res.body.should.have.property('data')
                  res.body.data.should.have.property('subcategory')
                  res.body.data.subcategory.should.have.property('threads')
                  expect(res.body.data.subcategory.threads).to.be.an('array')
                  expect(res.body.data.subcategory.title).to.equal(title)
                  agent.close()
                  done()
                })
            })
            .catch(error => {
              console.log(error)
            })
        })
    })
  })

  //testing subcategory GET method. Is successful if a subcategory is 
  //found when the subcategoryId is provided as a query paramter
  describe('/GET a subcategory', () => {
    it('it should get a single subcategory', async () => {
      const createdSubcategory = await createSubcategory()
      const subcategoryId = String(createdSubcategory._id)
      chai.request(server)
        .get('/api/subcategories') //route being tested
        .query({ subcategoryId: subcategoryId })
        .end((err, res) => {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('subcategory')
          res.body.data.subcategory.should.have.property('title')
          res.body.data.subcategory.should.have.property('category')
          res.body.data.subcategory.should.have.property('threads')
          res.body.data.subcategory.should.have.property('date')
        })
    })
  })

  //testing threads POST method. This test is successful 
  //if a user is logged in and a new thread is created under the 'agent'
  describe('/POST threads', () => {
    it('it should create a new thread if user is logged in', (done) => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const thread = {}
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, and will send it
          // back to the server in the next request:
          createSubcategory()
            .then(subcategory => {
              const title = 'Random Thread Title'
              const threadType = ' '
              const description = 'Random Thread Description'
              thread['title'] = title
              thread['threadType'] = threadType
              thread['description'] = description
              thread['subcategoryId'] = subcategory._id
              return agent
                .post('/api/threads') //route being tested
                .send(thread)
                .then(function (res) {
                  expect(res).to.have.status(201)
                  res.body.should.be.a('object')
                  res.body.should.have.property('status')
                  res.body.should.have.property('data')
                  res.body.data.should.have.property('thread')
                  res.body.data.thread.should.have.property('comments')
                  expect(res.body.data.thread.comments).to.be.an('array')
                  res.body.data.thread.should.have.property('date')
                  expect(res.body.data.thread.title).to.equal(title)
                  expect(res.body.data.thread.description).to.equal(description)
                  expect(res.body.data.thread.threadType).to.equal(threadType)
                  agent.close()
                  done()
                })
            })
            .catch(error => {
              console.log(error)
            })

        })
    })
  })

  //testing thread GET method. Is successful if a thread is 
  //found when the threadId is provided as a query paramter
  describe('/GET a thread', () => {
    it('it should get a single thread', async () => {
      const createdThread = await createThread()
      const threadId = String(createdThread._id)
      chai.request(server)
        .get('/api/threads') //route being tested
        .query({ threadId: threadId })
        .end((err, res) => {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('thread')
          res.body.data.thread.should.have.property('title')
          res.body.data.thread.should.have.property('description')
          res.body.data.thread.should.have.property('threadType')
          res.body.data.thread.should.have.property('comments')
          res.body.data.thread.should.have.property('date')
        })
    })
  })

  describe('/DELETE a thread', () => {
    it('it should delete a single thread if proper ownership', async () => {
      const createdThread = await createThread()
      const threadId = createdThread._id
      chai.request(server)
        .delete('/api/threads') //route being tested
        .send({ threadId: threadId })
        .end((err, res) => {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          //res.body.data.thread.should.have.property('author')
        })
    })
  })

  describe('/POST upvote a thread', () => {
    it('it should upvote a thread if user is logged in and has not already voted', async () => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const createdThread = await createThread()
      const threadId = createdThread._id
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          return agent
            .post('/api/threads/vote')
            .send(threadId)
            .then(function (res) {
              expect(res).to.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('status')
              res.body.should.have.property('data')
              //expect(res.body.data.thread.votes).to.be.an('array')
              //res.body.data.thread.should.have.property('date')
              expect(res.body.data[0]).to.equal(true)
              expect(res.body.data[1]).to.be.a('Number')
              //expect(res.body.data.thread.threadType).to.equal(threadType)
              agent.close()

            })
        })
        .catch(error => {
          console.log(error)
        })

    })
  })

  describe('/POST remove upvote a thread', () => {
    it('it should remove the upvote of a thread if user is logged in and has already voted', async () => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const createdThread = await createThread()
      const threadId = createdThread._id
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
            //return agent
            .post('/api/threads/vote')
            .send(threadId)
            .post('/api/threads/vote')
            .send(threadId)
            .then(function (res) {
              expect(res).to.have.status(201)
              res.body.should.be.a('object')
              res.body.should.have.property('status')
              res.body.should.have.property('data')
              //expect(res.body.data.thread.votes).to.be.an('array')
              //res.body.data.thread.should.have.property('date')
              expect(res.body.data.array[0]).to.equal(false)
              expect(res.body.data.array[1]).to.be.a('Number')
              //expect(res.body.data.thread.threadType).to.equal(threadType)
              agent.close()

            })
        })
        .catch(error => {
          console.log(error)
        })

    })
  })

  //testing comments POST method. This test is successful 
  //if a user is logged in and a new comment is created under the 'agent'
  describe('/POST comments', () => {
    it('it should create a new comment if user is logged in', (done) => {
      const user = {
        username: 'username',
        password: 'password',
      }
      const comment = {}
      const agent = chai.request.agent(server)
      agent
        .post('/api/signup')
        .send(user)
        .then(function (res) {
          expect(res).to.have.cookie('auth_data')
          // The `agent` now has the token cookie saved, and will send it
          // back to the server in the next request:
          createThread()
            .then(thread => {
              const text = 'Random comment text.'
              comment['text'] = text
              comment['threadId'] = thread._id
              return agent
                .post('/api/comments') //route being tested
                .send(comment)
                .then(function (res) {
                  expect(res).to.have.status(201)
                  res.body.should.be.a('object')
                  res.body.should.have.property('status')
                  res.body.should.have.property('data')
                  res.body.data.should.have.property('comment')
                  res.body.data.comment.should.have.property('comments')
                  expect(res.body.data.comment.comments).to.be.an('array')
                  res.body.data.comment.should.have.property('date')
                  expect(res.body.data.comment.text).to.equal(text)
                  agent.close()
                  done()
                })
            })
            .catch(error => {
              console.log(error)
            })
        })
    })
  })

  //testing comment GET method. Is successful if a comment is 
  //found when the commentId is provided as a query paramter
  describe('/GET a comment', () => {
    it('it should get a single comment', async () => {
      const createdComment = await createComment()
      const commentId = String(createdComment._id)
      chai.request(server)
        .get('/api/comments') //route being tested
        .query({ commentId: commentId })
        .end((err, res) => {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.should.have.property('data')
          res.body.data.should.have.property('comment')
          res.body.data.comment.should.have.property('text')
          res.body.data.comment.should.have.property('thread')
          res.body.data.comment.should.have.property('date')
        })
    })
  })
})

//testing search GET method. Is successful if a thread is 
//found when the title is provided as a query paramter
describe('/GET search for thread by title', () => {
  it('it should get threads with the searched keyword present', async () => {
    await createThread()
    chai.request(server)
      .get('/api/threads/search') //route being tested
      .query({ title: 'random' })
      .end((err, res) => {
        expect(res).to.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('status')
        res.body.should.have.property('data')
        res.body.data.should.have.property('threads')
        expect(res.body.data.threads).to.be.an('array')
        expect(res.body.data.threads).to.have.lengthOf(1);
        expect(res.body.data.threads[0]).to.have.property('title')
        expect(res.body.data.threads[0].title).to.have.string('Random')
      })
  })
})
