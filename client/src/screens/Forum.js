import React from 'react'
import ForumItem from '../components/ForumItem'
import axios from 'axios'
import Button from '../components/Button'
import  { Redirect } from 'react-router-dom'
import Popup from '../components/popup'

class ForumDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ForumInfoSubject: [],
      ForumInfoTitle: [],
      ForumInfoText: [],
      MakeForumRedirect: false,
      isAuthenticated: true
    };
  }

  Redirect=e=>{
    this.setState({
      MakeForumRedirect: true
    })
  }

  handleLogout = event => {
    event.preventDefault();
    axios({
      url: '/api/logout',
      method: 'post',
      data: {
        username: this.state.username,
        password: this.state.password,
      },
      }).then(response => {
        console.log(response);
        if( response.data.status === 'success' ){
          this.setState({
            isAuthenticated: false
          })
        }
      })
  }

  componentDidMount(){
    let forumSubject =  [];
    let forumTitle =  [];
    let forumText =  [];

    /*axios.get('/api/subcategories')
        .then(response => {
          var subcategoryId = response.data.data.subcategories.find(subcategory => {
            //return subcategory.title == subcategoryTitle;
          })._id;
          return axios.get('/api/threads', {
            params: {
              //subcategoryId: subcategoryId
            }
          });
        })
      .then(res => {
        console.log(res.data);

        res.data.forEach(forumElement => {
          forumSubject.push( forumElement.name);
          forumTitle.push( forumElement.email)
          forumText.push( forumElement.username)

        });

        this.setState({
          ForumInfoSubject: forumSubject,
          ForumInfoTitle:  forumTitle,
          ForumInfoText:  forumText
        });

      });*/
  }

  render() {
    const {ForumInfoSubject,ForumInfoTitle,ForumInfoText,MakeForumRedirect,isAuthenticated} = this.state;

    if(!isAuthenticated) {
      return  (
        <Redirect to="/" />
      )
    }

    const ForumData = ForumInfoSubject.map((forum,index) => {
      return (
      <ForumItem
      key = {index}
      ForumSubject={forum}
      ForumTitle={ForumInfoTitle[index]}
      ForumText={ForumInfoText[index]} />
      );
    })
    if(MakeForumRedirect){
      return(
        <Popup/>
      )
    }
    return (
      <div>
        <Button title = 'Make' onClick={this.Redirect}> </Button>
        <Button title = 'Logout' onClick={this.handleLogout}> </Button>
        {ForumData}
        <ForumItem
          ForumSubject={ForumInfoSubject}
          ForumTitle={ForumInfoTitle}
          ForumText={ForumInfoText}/>
      </div>
    )
  }
}
export default ForumDisplay
