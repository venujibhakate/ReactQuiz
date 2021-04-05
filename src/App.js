import { render } from '@testing-library/react';
import React, {Component} from 'react';
import qBank from './query/index';
import Question from './components/Question';
import Score from './components/Score';
import "./App.css";
import axios from "axios";

class Quiz extends Component {
  constructor(props){
    super(props);
  this.state = {
    value: '',
    question: [],
    score:0,
    responses:0,
    currentQuestion: 0,
    wrong:0,
    status: '',
    count:1,
    Username: "",
    Date:''
  };
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  EndGame = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today =  yyyy+"-"+mm+"-"+dd;

    
    const newUser = {
      Username: this.state.Username,
      Date: today,
      wrong:this.state.wrong,
      count:this.state.count

    }
    const response = axios.post(
          "https://pure-brushlands-31575.herokuapp.com/post",
          newUser
        );
          console.log(response,"k");
      };
  
 shuffle = (array) =>{
    var currentIndex = array.length;
    var randomArray = []
    while(randomArray.length !== currentIndex) {  
      var randomIndex = Math.floor(Math.random() * currentIndex);
      if(!randomArray.includes(array[randomIndex])){
        randomArray.push(array[randomIndex]);
      }
    }
    return randomArray;
  }

 
  setStateQuestion = () => {
    this.setState({
      question: this.shuffle(qBank)
    })
  }

  selectedAnswer = (options, correctOption) => {
    if (options === correctOption) {
      this.state.currentQuestion+=1
      this.setState({
         status:  "",
        score: this.state.score + 1,
        // status:  ("correct!!")
    
      });
    }
    else {
      this.setState({
        status:   ("sorry it is wrong answer , choose correct option!"),
        wrong: this.state.wrong+1,

        
      })
    }
    this.setState({
      responses: this.state.responses <  this.state.currentQuestion
        ? this.state.responses + 1 
        :  this.state.currentQuestion
    });


  };


 componentDidMount(){
   this.setStateQuestion();
}
 playAgain = () => {
  // this.EndGame()
  this.state.count+=1
  this.setStateQuestion();
  this.setState({
    score: 0,
    wrong:0,
    responses: 0,
    question: this.shuffle(qBank),
    currentQuestion:0,
    status:  "",

  });
};
render(){
  const { Username , Date} = this.state;
  console.log(this.state,'s');

  return (
    <div className="main">
     
        <h4 class="titleText">
        {/* <marquee  direction="right"> */}
        Animals Quiz
        {/* </marquee> */}
        </h4>
    
     
      <div className="content">
    <div>
        <form>
        <label class="lable">
          Name: 
          <input type="text"  name="Username" placeholder="Enter your Name" value={this.state.Username}  onChange={this.onChange} required></input>
        </label>
        <h1 class="userName">Hii {this.state.Username}!</h1>
   
        </form>
        </div>
   
   
      {this.state.question.length > 0 && this.state.responses < 10 && this.state.question.slice(this.state.currentQuestion,this.state.currentQuestion+1).map(
        ({question, options , Images , correctAnswer}) => 
        <Question 
        className="queryCard"
        Images={Images}
        question={question}
        options={options}
        point={this.state.score}
        status={this.state.status}
        selected={options => this. selectedAnswer(options, correctAnswer)}
        />
        
  )}
      {
        this.state.responses ===  10
          ? (<h4>
            <Score
            score={this.state.score}
            count={this.state.count}
            wrong={this.state.wrong}
            playAgain={this.playAgain}
          />{this.EndGame()}</h4>)
          : null
      }
      </div>
    </div>
    
  );
  
}

}

export default Quiz;




