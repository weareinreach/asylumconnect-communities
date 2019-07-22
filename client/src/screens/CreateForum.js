import React from 'react';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import InputLabel from '@material-ui/core/InputLabel';
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
  margin-bottom: 40px;
`;

const BackToACCommunityLayout = styled.div`
  display: flex;
  background-color: #5073b3;
`;

const BackToACCommunity = styled.a`
  padding: 20px;
  margin-left: 100px;
  font-size: 16px;
  color: white;
  &:hover {
    color: white;
  }
`;

const CreateForumPageTitle = styled.div`
  padding: 8px 16px;
  margin-top: 8px;
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
  margin-top: 8px;
  margin-bottom: 12px;
`;

const SingleSelectColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
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
    '&:hover': {
      backgroundColor: "#8D2A25",
    },
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
      selectedCategory: '',
      selectedSubcategory: '',
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

    return(
        <PageContainer>
          <CreateForumFlexNavBar>
            <Navbar/>
          </CreateForumFlexNavBar>
          <CreateForumFlexCenterPage>
            <BackToACCommunityLayout>
              <BackToACCommunity href="/Main">{`< Back to AC Community`}</BackToACCommunity>
            </BackToACCommunityLayout>
            <CreateForumPageTitle>Create a New Post</CreateForumPageTitle>
            <CreateForumForm autoComplete="off">
              <SelectRow>
                <SingleSelectColumn>
                  <FormInputTitle>Category</FormInputTitle>
                  <FormControl>
                    <InputLabel htmlFor="category-select">Select a category</InputLabel>
                    <Select
                      value={this.state.selectedCategory}
                      onChange={this.handleChange('selectedCategory')}
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
                      value={this.state.selectedSubcategory}
                      onChange={this.handleChange('selectedSubcategory')}
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
                <FormInputTitle>Content</FormInputTitle>
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