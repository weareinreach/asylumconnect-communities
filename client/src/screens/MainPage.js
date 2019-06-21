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

//const CardHeader = styled.div`
//    display: flex;
//    flex-direction:row;
//`;

const WelcomeHeader = withStyles({
  root: {
    background: '#5073b3',
    textColor: 'white',
    height: 100,
    textAlign: 'left'
  },
  "root .MuiTypography-headline-45": {
    color: 'white'
  },
})(CardHeader);

// const WelcomeHeader = styled.div`
//   align: center;
//   height: 100;
// `;

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
    marginTop: "16px",
    marginBottom: "16px"
    //marginRight "1px"
  }
})(Divider);

const SubCategoryLink = styled.div`
  margin: 12px;
`;

const SideBarColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  borderRight: '0.1px solid black';
  borderColor: 'black';
  padding: '0.5em';
`;


const NewPostButton = withStyles({
  root: {
    background: '#cc4747',
    borderRadius: 100,
    border: 0,
    color: 'white',
    height: 56,
    padding: '0 30px',
    fontSize: '16px',
    width: '300px',
    margin: '32px auto',
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
      return (<div>Text</div>);
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
                <SubCategoryDivider/>
                <a href="/Introduce Yourself">Introduce Yourself</a>
                <SubCategoryDivider/>
                <CardHeader title="The Community"/>
                <SubCategoryDivider/>
                <a href="/Meet An LGBTQ Asylee">Meet An LGBTQ Asylee<br/></a>
                <SubCategoryDivider/>
                <a href="/Legal Questions">Legal Questions<br/></a>
                <SubCategoryDivider/>
                <a href="/Leaving Your Country">Leaving Your Country<br/></a>
                <SubCategoryDivider/>
                <CardHeader title="Category"/>
                <SubCategoryDivider/>
                <a href="/Subcategory">Subcategory<br/></a>
                <SubCategoryDivider/>
              </CategoryLayout>
              <SideBarColumn>
              <NewPostButton onClick={this.handleNewPostClicked}>MAKE A NEW POST</NewPostButton>
              <SubCategoryDivider />
              <CardHeader title="Latest Posts" />
              <a href="/PostTitle">PostTitle<br/></a>
              <SubCategoryDivider />
              <CardHeader title="Top Posts" />
              <a href="/PostTitle">PostTitle<br/></a>
              </SideBarColumn>
            </MainPageRow>
          </MainFlexCenterPage>
          <Footer/>
        </PageContainer>
      );
      }
  }

export default MainPage;