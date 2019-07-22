import React from 'react';
import styled from 'styled-components'
import TextBox from '../components/TextBox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import  { Redirect } from 'react-router-dom'
import RainbowPaint from '../assets/rainbow-paint.jpg'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const MainFlexNavBar = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const MainFlexCenterPage = styled.div`
  flex: 8;
  flex-direction: column;
`;

const LayoutLeft = styled.div`
  display:flex;
  flex-direction:column;
  justify-content: space-around;
  align: left;
`;

const WelcomeHeader = withStyles({
  root: {
    background: '#5073b3',
    color: 'white',
    height: 48,
  },
})(CardHeader);

const MainPageRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const CategoryLayout = styled.div`
  flex: 1;
  flex-grow: 5;
  margin: 16px;
`;

const SubCategoryLayout = styled.div`
  margin: 12px 0px;
`;

const SubCategoryDivider = withStyles({
  root: {
    marginBottom: "12px"
  }
})(Divider);

const SubCategoryLink = styled.div`
  margin: 12px;
`;

const SideBarColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const NewPostButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 100,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 20px',
    fontSize: '16px',
    width: '240px',
    margin: '28px auto',
    '&:hover': {
      backgroundColor: "#8D2A25",
    }
  },
  label: {
    textTransform: 'capitalize',
  },

})(Button);

const LogOutButton = withStyles({
  root: {
    flexBasis: 'fit-content',
    padding: '8px 12px',
    marginRight: '100px',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      isAuthenticated: true,
      newPostClicked: false
    }
  }

  componentDidMount() {
    this.initializeSubCategories("Welcome");
    this.initializeSubCategories("The Community");
    this.initializeSubCategories("Category");
  }

  initializeSubCategories(categoryTitle) {
      const category = {
        title: categoryTitle
      };
      axios.get('/api/categories')
        .then(response => {
          var categoryId = response.data.data.categories.find(category => {
            return category.title == categoryTitle;
          })._id;
          return axios.get('/api/subcategories', {
            params: {
              categoryId: categoryId
            }
          });
        })
        .then(response => {
          category.subcategories = response.data.data.subcategories;
          console.log(category.subcategories);
          this.state.categories.push(category);
          this.setState(this.state);
        })
    }

  handleChange = e => {
   this.setState({
     [e.target.name] : e.target.value
   })
  }

  handleNewPostClicked = event => {
    event.preventDefault();
    this.state.newPostClicked = true;
    this.setState(this.state);
  }

  handleLogOut = event => {
    event.preventDefault();
    axios.post('/api/logout')
      .then(response => {
        this.state.isAuthenticated = false;
        this.setState(this.state);
      });
  }

  render(){
    const {categories, isAuthenticated, newPostClicked} = this.state;

    if (!isAuthenticated) {
      return  (
        <Redirect to="/" />
      )
    }

    if (newPostClicked) {
      return (
        <Redirect to="/CreateForum" />
      )
    }

    function SubCategories(props) {
      const categories = props.categories;
      if (categories) {

        const specificCategory = categories
          .find(category => {
            return category.title == props.categoryTitle;
          })

        if (specificCategory && specificCategory.subcategories) {
          var subCategoryLayouts = specificCategory
            .subcategories
            .map((subCategory) => {
              // TODO: Send subCategory id as URL param
              // const forumLink = "/Forum/" + subCategory._id;
              const forumLink = "/Forum";
              return (
                // Add links to specific subCategory
                <SubCategoryLayout>
                  <SubCategoryDivider/>
                  <SubCategoryLink>
                    <a href={forumLink}>{subCategory.title}</a>
                  </SubCategoryLink>
                </SubCategoryLayout>
              );
            });
          return (<div>{subCategoryLayouts}</div>);
        }
      }
      return (<div>Loading</div>);
    }

    return(
        <PageContainer>
          <MainFlexNavBar>
            <Navbar/>
            <LogOutButton onClick={this.handleLogOut}>LOG OUT</LogOutButton>
          </MainFlexNavBar>
          <MainFlexCenterPage>
            <WelcomeHeader title="Welcome to the AsylumConnect Community!"/>
            <MainPageRow>
              <CategoryLayout>
                <CardHeader title="Welcome"/>
                <SubCategories categoryTitle="Welcome" categories={this.state.categories}/>
                <SubCategoryDivider/>
                <CardHeader title="The Community"/>
                <SubCategories categoryTitle="The Community" categories={this.state.categories}/>
                <SubCategoryDivider/>
                <CardHeader title="Category"/>
                <SubCategories categoryTitle="Category" categories={this.state.categories}/>
                <SubCategoryDivider/>
              </CategoryLayout>
              <SideBarColumn>
              <NewPostButton onClick={this.handleNewPostClicked}>Make a new post</NewPostButton>
              </SideBarColumn>
            </MainPageRow>
          </MainFlexCenterPage>
          <Footer/>
        </PageContainer>
      );
      }
  }

export default MainPage;