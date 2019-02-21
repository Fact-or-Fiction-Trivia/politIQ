import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { ADMIN_DASHBOARD } from '../../constants/routes';
import MediaQuery from 'react-responsive';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import loadingGif from '../../loadingGif.gif';
import './dashboard.css';

class ReviewContestedQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noQuestionsRemaining: false,
            quizzes: [],
            data: {},
            loaded: false,
            selectedQuizId: '',
            selectedQuiz: {},
            qNum: 0,
            qVal: 0,
        }
    }

    componentDidMount = () => {
        this.getContest()
    }

    getContest = () => {
        db.getContestedQuiz()
            .then(response => {
                if (response.val() === null) {
                    this.setState({
                        noQuestionsRemaining: true,
                        loaded: true,
                    })
                } else {
                    const data = response.val()
                    const quizzes = Object.keys(data)
                    const quizTitles = []
                    for (let i = 0; i < quizzes.length; i++) {
                        db.getQuiz(quizzes[i])
                            .then(response => {
                                const data = response.val()
                                const quizTitle = data['quiz-title']
                                quizTitles.push(quizTitle)
                            })
                            .then(() => {
                                this.setState({
                                    quizzes,
                                    quizTitles,
                                    data,
                                    loaded: true,
                                })
                            })
                    }

                }
            })
    }

    selectQuiz = (event) => {
        this.setState({
            selectedQuizId: event.target.id
        })
        this.getQuiz(event.target.id)
    }

    getQuiz = (date) => {
        db.getQuiz(date)
            .then(response => {
                const data = response.val()
                this.setState({
                    selectedQuiz: data
                })
            })
        this.getQuestionUid()
    }

    getQuestionUid = async () => {
        let qNum = this.state.qNum
        let qVal = this.state.qVal
        const data = this.state.data
        const date = Object.keys(data)[0]
        const objectWithUids = data[date]
        const uid = Object.keys(Object.values(objectWithUids)[qNum])[qVal];
        db.getDisplayNames(uid)
            .then(response => {
                const data = response.val()
                const displayName = data.displayName;
                this.setState({
                    currentQUid: uid,
                    currentQDisplayName: displayName,
                })
            })
    }

    skip = () => {
        // this qNum is the index 
        let qNum = this.state.qNum;
        const contestedQsForThisQuiz = this.state.data[this.state.selectedQuizId] 

        // qVal is the value
        const userKeys = this.state.data[this.state.selectedQuizId][Object.keys(contestedQsForThisQuiz)[qNum]]

        if (Object.keys(userKeys).length === 1) {
            qNum ++

            if (qNum > Object.keys(contestedQsForThisQuiz).length - 1){ 
                this.getContest()
                this.setState({
                    selectedQuiz: {},
                    selectedQuizId: "",
                    qNum: 0,
                })
                return;
            }
            this.getContest()
            this.setState({
                qNum,
            })
        } else if (Object.keys(userKeys).length > 1) {

            let qVal = this.state.qVal
            if (qVal === Object.keys(userKeys)) {
                qNum ++
                this.setState({
                    qVal: 0,
                    qNum,
                })
            } else {
                qVal ++
                this.setState({
                    qVal,
                })
            }
        }
        this.getQuestionUid()
    }

    reject = () => {
        const contestedQs = Object.values(this.state.data)[0]
        const selected = Object.keys(contestedQs)[this.state.qNum]

        const uid = Object.keys(Object.values(contestedQs)[this.state.qNum])[this.state.qVal]

        db.deleteContest(this.state.selectedQuizId, selected, uid)
        this.getContest()
    }

    accept = async () => {
        const contestedQs = Object.values(this.state.data)[0]
        const selected = Object.keys(contestedQs)[this.state.qNum]

        const uid = Object.keys(Object.values(contestedQs)[this.state.qNum])[this.state.qVal]
        const issue = contestedQs[selected][uid]["issue"]
        const source = contestedQs[selected][uid]["source"]
        const date = this.state.selectedQuizId

        db.acceptContest(this.state.selectedQuizId, selected, uid, issue, source)
        await db.getSubmittedOrContestedScoreByUid(uid)
            .then(async(response) => {
                if (response.val() === null || response.val() === undefined) {
                    await db.setSubmittedOrContestedScoreByUid(uid, date, 5)
                } else {
                    const data = response.val()
                    const datesArray = Object.keys(data)
                    if (datesArray.indexOf(date) !== -1) {
                        let score = data[date]
                        let newScore = score + 5
                        await db.setSubmittedOrContestedScoreByUid(uid, date, newScore)
                    } else {
                        await db.setSubmittedOrContestedScoreByUid(uid, date, 5)
                    }
                }
            })

        this.getContest()
    }


    // 
    renderContest = () => {
        // get the first key from each contest object
        const contestedQsForThisQuiz = this.state.data[this.state.selectedQuizId]

        // gets the first contested question
        const questionNum = Object.keys(contestedQsForThisQuiz)[this.state.qNum]
        const question = this.state.selectedQuiz[questionNum]
        
        let contestedData;
        if (questionNum !== undefined) {
            if (this.state.qVal >= Object.values(contestedQsForThisQuiz).length) {
                let qNum = this.state.qNum
                qNum ++
                this.setState({
                    qNum,
                    qVal: 0,
                })
                return;
            } else {
                contestedData = Object.values(contestedQsForThisQuiz[questionNum])[this.state.qVal];
            }
        } else if (questionNum === undefined) {
            this.setState({
                noQuestionsRemaining: true
            })
            return;
        }

        if (question) {
            return (
                <div>
                    <p style={{ fontWeight: 'bold' }}>{questionNum}. {question["q1"]}</p>
                    <div style={{ display: "flex", flexDirection: 'column'}}>
                        <div style={{ display: 'flex'}}>
                        <FormControlLabel 
                            label={question["a1text"]}
                            control={<Radio
                                checked={question["a1correct"]}
                            />}
                        /><span style={{ color: 'green', marginRight: '1vw', marginTop: 'auto', marginBottom: "auto"}}>{question["a1correct"] ? "Correct Answer" : null }</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            <FormControlLabel 
                                label={question["a2text"]}
                                control={<Radio
                                    checked={question["a2correct"]}
                                />}
                            /><span style={{ color: 'green', marginRight: '1vw', marginTop: 'auto', marginBottom: 'auto'}}>{question["a2correct"] ? "Correct Answer" : null }</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column'}}>
                            <FormControlLabel 
                                label={question["a3text"]}
                                control={<Radio
                                    checked={question["a3correct"]}
                                />}
                            /><span style={{ color: 'green', marginRight: '1vw', marginTop: 'auto', marginBottom: 'auto'}}>{question["a3correct"] ? "Correct Answer" : null }</span>
                        </div>
                    </div>
                    <hr />
                    <p style={{ fontWeight: 'bold' }}>From user: {this.state.currentQDisplayName}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Issue:</span> {contestedData.issue}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Source: </span>{contestedData.source}</p>
                </div>
            )
        }
    }

    render() {
        let quizzes, question;

        if (this.state.loaded) {
            quizzes = this.state.quizzes.map((quiz, i) => {
                const shortQuiz = quiz.slice(0, 10)
                return (
                    <h4 onClick={this.selectQuiz} key={i} id={quiz}>{shortQuiz}, {this.state.quizTitles["0"]}</h4>
                )
            })
        }
        
        if (this.state.loaded && this.state.selectedQuiz !== {} && this.state.selectedQuizId !== "" && this.state.noQuestionsRemaining === false) {
            question = this.renderContest()
        }

        return (
            <Paper className="review">
                <MediaQuery minWidth={416}>
                    <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
                        <Button variant="contained" color="primary">Back to Dashboard</Button>
                    </Link>
                </MediaQuery>
                {this.state.loaded
                    ? null
                    : <img src={loadingGif} className="gifStyle" alt="loadingGif"/>
                }
                {this.state.noQuestionsRemaining 
                    ? <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <h1 style={{ marginTop: '1vh', marginLeft: '2vw'}}>No Contested Questions to Review</h1>
                        <MediaQuery maxWidth={415}>
                            <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
                                <Button variant="contained" color="primary">Back to Dashboard</Button>
                            </Link>
                        </MediaQuery>
                    </div>
                    : <div>{this.state.selectedQuizId === "" 
                        ? <div>
                            <h1 id="reviewHeading">Quizzes with Contested Questions</h1>
                            <div className="questionHolder">
                                {quizzes}
                            </div>
                          </div>
                        : <div>
                            <h1 id="reviewHeading">Contested Questions</h1>
                            <div className="questionHolder">
                                {question}
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                                    <Button color="primary"><span style={{ color: 'red' }} onClick={this.reject}>Reject Issue</span></Button>
                                    <Button color="primary" onClick={this.skip}>Skip</Button>
                                    <Button color="primary" onClick={this.accept}>Accept Issue</Button>
                                </div>
                            </div>
                         </div>
                    } </div>
                }

            </Paper>
        )
    }
}

export default ReviewContestedQuestions;