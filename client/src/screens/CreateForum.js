import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components'
import TextBox from '../components/TextBox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import  { Redirect } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import CardHeader from '@material-ui/core/CardHeader';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const CreateForumFlexNavBar = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CreateForumFlexCenterPage = styled.div`
  flex: 8;
  flex-direction: column;
`;

const LayoutLeft = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align: left;
`;

const BackToACCommunityLayout = styled.div`
  display: flex;
  background-color: #5073b3;
`;

const BackToACCommunity = styled.div`
  flex-basis: fit-content;
  padding: 27px;
  margin-left: 100px;
  font-size: 16px;
  color: white;
`;

const CreateForumPageTitle = styled.div`
  padding: 16px;
  margin-top: 24px;
  margin-left: 100px;
  font-size: 32px;
  font-weight: 700;
`;

const SelectRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const CreateForumForm = styled.div`
  margin-left: 100px;
`;


const FormInputTitle = styled.div`
  font-size: 24px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const SingleSelectColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 320px;
`;

const FormTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  padding: 16px;
`;

const SubmitButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 100,
    border: 0,
    color: 'white',
    height: 32,
    padding: '0 30px',
    fontSize: '16px',
    width: '168px',
    marginTop: '32px',
    marginBottom: '32px',
    marginLeft: 'auto',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

class CreateForum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // JSON Placeholder
      categories: [
        {
            title: "Welcome",
            subcategories: [
                { title: "Introduce yourself!" }
            ]
        },
        {
            title: "The Community",
            subcategories: [
                { title: "Meet an LGBTQ Asylee" },
                { title: "Legal Questions" },
                { title: "Leaving your country" }
            ]
        },
        {
            title: "Category",
            subcategories: [
                { title: "Sub-Category" },
                { title: "Sub-Category" }
            ]
        }
      ],
      labelWidth: 0,
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleBack = event => {
    event.preventDefault();
    window.location.href = "/Main";
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state);
    axios({
      url: '/api/threads/',
      method: 'post',
      data: {
        //title:
        //threadType:
        //description:
        //subcategoryId:
      },
    }).then(response => {
      console.log(response);
      if( response.data.status === 'success' ){
          
      }
    })

  }

  render(){
    const {categories} = this.state;
    const { classes } = this.props;

    return(
        <PageContainer>
          <CreateForumFlexNavBar>
            <Navbar/>
          </CreateForumFlexNavBar>
          <CreateForumFlexCenterPage>
            <BackToACCommunityLayout>
              <BackToACCommunity onClick={this.handleBack}>Back to AC Community</BackToACCommunity>
            </BackToACCommunityLayout>
            <CreateForumPageTitle>Create a New Post</CreateForumPageTitle>
            <CreateForumForm autoComplete="off">
              <SelectRow>
                <SingleSelectColumn>
                  <FormInputTitle>Category</FormInputTitle>
                  <FormControl>
                    <InputLabel htmlFor="category-select">Select a category</InputLabel>
                    <Select
                      value={this.state.category}
                      onChange={this.handleChange('category')}
                      input={<Input name="category" id="category-select" />}
                      >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </SingleSelectColumn>
                <SingleSelectColumn>
                  <FormInputTitle>Subcategory</FormInputTitle>
                  <FormControl>
                    <InputLabel htmlFor="subcategory-select">Select a subcategory</InputLabel>
                    <Select
                      value={this.state.subcategory}
                      onChange={this.handleChange('subcategory')}
                      input={<Input name="subcategory" id="subcategory-select" />}
                      >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </FormControl>
                </SingleSelectColumn>
              </SelectRow>
              <FormTextColumn>
                <FormInputTitle>Title</FormInputTitle>
                <TextField
                  id="title"
                  label="Post Title"
                  value={this.state.title}
                  onChange={this.handleChange('title')}
                  variant="outlined"
                />
                <FormInputTitle>Body</FormInputTitle>
                <TextField
                  id="body"
                  label="Start typing your post"
                  multiline
                  rows="8"
                  value={this.state.body}
                  onChange={this.handleChange('body')}
                  variant="outlined"
                />
                <SubmitButton onClick={this.handleSubmit}>SUBMIT</SubmitButton>
              </FormTextColumn>
            </CreateForumForm>
          </CreateForumFlexCenterPage>
          <Footer/>
        </PageContainer>
      );
      }
  }

export default CreateForum;