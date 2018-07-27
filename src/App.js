import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    questions: [],
    questionIndex: 0,
    username: "",
    input: "",
    leaderboards: [],
    points: 0
  };

  componentDidMount() {
    this.getNewQuestions();
  }

  submitUser = () => {
    axios
      .post(`/api/user/${this.state.input}`)
      .then(user => this.setState({ username: user.data }));
  };

  getNewQuestions = () => {
    axios
      .get("https://opentdb.com/api.php?amount=10&difficulty=easy&type=boolean")
      .then(questions =>
        this.setState({ questions: questions.data.results, questionIndex: 0 })
      );
  };

  nextQuestion = (e, answer, correctAnswer) => {
    axios
      .post(`/api/question/${answer == correctAnswer}`, {
        user: this.state.username
      })
      .then(points => this.setState({ points: points.data.reply }));

    e.preventDefault();
    this.setState({ questionIndex: this.state.questionIndex + 1 });
  };

  endGame = () => {
    axios
      .post(`/api/endgame/${this.state.username}`)
      .then(() => this.setState({ username: "" }));
  };

  render() {
    let question = "";
    let correctAnswer = "";
    let toggle;

    console.log(this.state.questions);

    if (this.state.questionIndex > 9) {
      this.getNewQuestions();
    }

    this.state.questions.length !== 0 &&
      (question = this.state.questions[this.state.questionIndex].question);

    this.state.questions.length !== 0 &&
      (correctAnswer = this.state.questions[this.state.questionIndex]
        .correct_answer);

    if (!this.state.username) {
      toggle = (
        <div>
          <input
            onChange={event => this.setState({ input: event.target.value })}
            type="text"
          />
          <a onClick={() => this.submitUser()} className="button" href="#">
            Enter
          </a>
        </div>
      );
    } else {
      toggle = (
        <div className="App">
          <p className="question">{question}</p>
          <a
            className="button"
            onClick={e => this.nextQuestion(e, "True", correctAnswer)}
          >
            True
          </a>
          <a
            className="button"
            onClick={e => this.nextQuestion(e, "False", correctAnswer)}
          >
            False
          </a>
          <a className="button" onClick={() => this.endGame()} href="#">
            Quit
          </a>
          <p>Points: {this.state.points}</p>
        </div>
      );
    }

    return (
      <div className="App">
        {toggle}
        <div className="leaderboards" />
      </div>
    );
  }
}

export default App;
