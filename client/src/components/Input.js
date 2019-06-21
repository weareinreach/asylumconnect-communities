import React from 'react';

class Input extends React.Component{
  // state ={input:""};

  // onChange = event => {
  //   this.setState({"input": event.target.value });
  // }

  render(){
    // const { input } = this.state;
    const {placeholder, name, onChange, value} = this.props;
    //destructoring. pulling values in props and putting in const varables
    return (
      <form>
        <label>
          {this.props.name}
          <input value={value} type="text" name={name} placeholder={placeholder} onChange={onChange} />
        </label>
      </form>
  );
  }
}

Input.defaultProps = {
  borderStyle: {
    borderRadius: 50,
    width: "80%",
    height: 60,
    padding: 10,
    backgroundColor: "#005FE1"
  },
  inputStyle: {
    height: "100%",
    width: "100%",
    color: "white",
    fontSize: 20
  },
  placeholderTextColor: "#cdcdcd"
};

export default Input;
