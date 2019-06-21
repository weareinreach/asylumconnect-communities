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
    textAlign: 'left',
    ".MuiTypography-headline-45": {
        color: 'white'
      },
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

const ListContainer = styled.div`
  margin-left: 16px;
`;

const TopPostsContainer = styled.div`
    margin-left: 19px;
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
      newPostClicked: false,
      latestPosts: [
        {"title":"Article1", "href":"/Article1"},
        {"title":"Article1", "href":"/Article1"},
        {"title":"Article1", "href":"/Article1"}
      ],
      communityPosts: [
        {"title":"Meet an LGBTQ Asylee", "href":"Meet an LGBTQ Asylee"},
        {"title":"Legal Questions", "href":"Legal Questions"},
        {"title":"Leaving Your Country", "href":"Leaving Your Country"}
      ],
      categoryPosts: [
        {"title":"Subcategory1", "href":"Subcategory1"},
        {"title":"Subcategory1", "href":"Subcategory1"},
        {"title":"Subcategory1", "href":"Subcategory1"}
      ],
      topPosts: [
        {"title":"TopPost1", "href":"TopPost1"}
      ]
    }

  }

  componentDidMount() {
    this.initializeSubCategories("Welcome");
    this.initializeSubCategories("The Community");
    this.initializeSubCategories("Category");
  }

  renderLatestPosts() {
    const{latestPosts}=this.state;
    var latestPostLinks = [];
    for (var i = 0; i < latestPosts.length; i++)
    {
        latestPostLinks.push(
           <a href={latestPosts[i].href}>P={latestPosts[i].title}<br/></a>
        );
    }
    return latestPostLinks;
  }

  renderCommunityPosts(){
    const{communityPosts}=this.state;
        var communityPostLinks = [];
        communityPostLinks.push(<SubCategoryDivider/>);
        for (var i = 0; i < communityPosts.length; i++)
        {
            communityPostLinks.push(
               <a href={communityPosts[i].href}>P={communityPosts[i].title}<br/></a>,
               <SubCategoryDivider/>
            );
        }
        return communityPostLinks;
  }

  renderCategoryPosts(){
    const{categoryPosts}=this.state;
          var categoryPostLinks = [];
          categoryPostLinks.push(<SubCategoryDivider/>);
          for (var i = 0; i < categoryPosts.length; i++)
          {
              categoryPostLinks.push(
                 <a href={categoryPosts[i].href}>P={categoryPosts[i].title}<br/></a>,
                 <SubCategoryDivider/>
              );
          }
          return categoryPostLinks;
  }

  renderTopPosts() {
      const{topPosts}=this.state;
      var topPostLinks = [];
      for (var i = 0; i < topPosts.length; i++)
      {
          topPostLinks.push(
             <a href={topPosts[i].href}>P={topPosts[i].title}<br/></a>
          );
      }
      return topPostLinks;
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
                <ListContainer>
                    <CardHeader title="Welcome"/>
                    <SubCategoryDivider/>
                    <a href="/Introduce Yourself">Introduce Yourself</a>
                    <SubCategoryDivider/>
                </ListContainer>
                <CardHeader title="The Community"/>
                <ListContainer>
                    {this.renderCommunityPosts()}
                </ListContainer>
                <CardHeader title="Category"/>
                <ListContainer>
                    {this.renderCategoryPosts()}
                </ListContainer>
              </CategoryLayout>
              <SideBarColumn>
              <NewPostButton onClick={this.handleNewPostClicked}>MAKE A NEW POST</NewPostButton>
              <SubCategoryDivider />
              <CardHeader title="Latest Posts" />
              <ListContainer>
                {this.renderLatestPosts()}
              </ListContainer>
              <SubCategoryDivider />
              <CardHeader title="Top Posts" />
              <TopPostsContainer>
                {this.renderTopPosts()}
              </TopPostsContainer>
              </SideBarColumn>
            </MainPageRow>
          </MainFlexCenterPage>
          <Footer/>
        </PageContainer>
      );
      }
  }

export default MainPage;