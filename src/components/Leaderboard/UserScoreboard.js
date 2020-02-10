import React, { useContext } from "react";
import { AuthUserContext } from "../Auth";
import MediaQuery from "react-responsive";
import { withFirebase } from "../../firebase";
import { useScoresUsers } from "../Leaderboard2/useScoresUsers"
import LoadingGif from '../../6.gif';
import { useGetMoneyEarned } from "../hooks/useGetMoneyEarned"
import { useGetContestedQScore } from "../hooks/useGetContestedQScore"


const UserScoreboard = (props) => {
  const [allRecentScores, politIQs, monthlyScores, weeklyScores, lastWeekScores, lastMonthScores, userRanks, loading] = useScoresUsers() // use a hook to get user scores and data into a data frame


  const loadingGif = <center style={{ height: "150px" }}><img src={LoadingGif} alt="loading" style={{ maxWidth: '100%' }} /></center>

  const [usersMoney, usersMoneyEarned, loadingMoneyWon] = useGetMoneyEarned(props.uid) // use a hook to get user scores and data into a data frame
  const [contestedScore, loadingContestedScore] = useGetContestedQScore(props.uid) // use a hook to get user scores and data into a data frame



  let content = <div>{loadingGif}</div>

  if (!(loading || loadingMoneyWon || loadingContestedScore)) {

    content =
      <div>
        <MediaQuery minWidth={416}>
          <div
            className="small-scoreboardHolder user-scoreboard-public"
            style={{
              justifyContent: "center",
              height: "auto",
              padding: "20px 20px 20px 18px"
            }}
          >
            <h2>
              {props.authUser.uid === props.uid ? "My"  /// if authuser then "my" else find  user page displayname
                :
                `${allRecentScores.filter(userObject => {                   // go through all scores object (all users as well) and find display name of object with matching uid as the page
                  return (userObject.uid == props.uid);
                })[0].displayName}'s`} Scores
          </h2>
            <div className="userScore politIQ">
              PolitIQ
            <span className="s reg-score politIQ-score">
                {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                  return (userObject.uid == props.uid);
                }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                  return (userObject.uid == props.uid);
                })[0].politIQ) : 0}
              </span>
            </div>
            <div className="small-scoreboard">
              <div className="userScore">
                Monthly Score
              <span className="s reg-score">
                  {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  })[0].monthlyScore) : 0}
                </span>
              </div>

              <div className="userScore">
                Weekly Score
              <span className="s reg-score">
                  {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  })[0].weeklyScore) : 0}
                </span>
              </div>
              <div className="userScore" id="submittedQScore">
                Contested Q Score
              <span className="s"> {contestedScore}                           {// zero for now
                } </span>
              </div>
            </div>
            <div
              className="small-scoreboard"
              style={{ justifyContent: "center" }}
            >
              <div className="userScore second-row">
                Money Won
              <span className="s reg-score">${usersMoney}</span>
              </div>
              <div className="userScore second-row">
                Earnings
              <span className="s reg-score">
                  ${usersMoneyEarned}            {// zero for now
                  }
                </span>
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={415}>
          <div
            className="small-scoreboardHolder user-scoreboard-public"
            style={{
              justifyContent: "center",
              height: "auto",
              padding: "20px 20px 20px 18px"
            }}
          >
            <h2>
              {props.authUser.uid === props.uid ? "My"  /// if authuser then "my" else find  user page displayname
                :
                `${allRecentScores.filter(userObject => {                   // go through all scores object (all users as well) and find display name of object with matching uid as the page
                  return (userObject.uid == props.uid);
                })[0].displayName}'s`} Scores                </h2>
            <div className="userScore politIQ">
              PolitIQ
            <span className="s reg-score politIQ-score">
                {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                  return (userObject.uid == props.uid);
                }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                  return (userObject.uid == props.uid);
                })[0].politIQ) : 0}
              </span>
            </div>
            <div className="small-scoreboard">
              <div className="userScore">
                Monthly Score
              <span className="s reg-score">
                  {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  })[0].monthlyScore) : 0}
                </span>
              </div>

              <div className="userScore">
                Weekly Score
              <span className="s reg-score">
                  {allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                    return (userObject.uid == props.uid);
                  })[0].weeklyScore) : 0}
                </span>
              </div>
            </div>
            <div className="small-scoreboard">
              <div className="userScore" id="submittedQScore">
                Contested Q Score
              <span className="s reg-score">
                  {contestedScore}                           {// zero for now
                  }
                </span>
              </div>
              <div className="userScore">
                Money Won
        <span className="s reg-score">${usersMoney}</span>
              </div>
            </div>
            <div
              className="small-scoreboard"
              style={{ justifyContent: "center" }}
            >
              <div className="userScore">
                Earnings
              <span className="s reg-score">
                  <span className="s reg-score">${usersMoneyEarned}</span> {// zero for now
                  }              </span>
              </div>
            </div>
          </div>
        </MediaQuery>
      </div>
  }

  return (<div>{content}</div>)

}


export default withFirebase(UserScoreboard);
