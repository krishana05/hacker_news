import React, { Component, Fragment } from "react";
import Chart from "../chart/Chart";
import "./News.css";

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
    };
    this.pageIndex = 1;
    this.totalRecords = 0;
    this.hiddenData = [];
    this.upVotedData = [];
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.styles = { color: "#000" };
  }
  componentDidMount() {
    this.loadData(this.pageIndex);
  }
  loadData(index) {
    fetch("http://hn.algolia.com/api/v1/search?page=" + index)
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result);
          this.totalRecords = result.nbPages;
          // console.log(localStorage.getItem("hiddenData")?.split(","));
          // console.log(JSON.parse(localStorage.getItem("upVoted")));
          let res = this.updateStateForHidden({ res: result.hits });
          this.setState({ res });
          // console.log(res);
          res = this.loadDataForUpvote();
          // console.log(res);
          this.setState({ res });
          console.log(this.state.res);
          this.sortByupVote(this.state.res);
        },
        (error) => {
          console.error(error);
        }
      );
  }
  sortByupVote(data) {
    const res = data.sort((a, b) => b.points - a.points);
    this.setState({ res });
  }
  updateStateForHidden(result) {
    let res = result.res;
    let hiddenData = localStorage.getItem("hiddenData")?.split(",");
    if (hiddenData != null) {
      res = result.res.filter((news) => {
        return hiddenData.indexOf(news.objectID) === -1;
      });
    }
    return res;
    // console.log(this.state);
  }
  getTime(time) {
    // console.log(time);
    // Calculate time between two dates:
    const date1 = new Date(time);
    const date2 = new Date(); // today

    let message = "";

    const diffInSeconds = Math.abs(date2 - date1) / 1000;
    const days = Math.floor(diffInSeconds / 60 / 60 / 24);
    const hours = Math.floor((diffInSeconds / 60 / 60) % 24);
    const minutes = Math.floor((diffInSeconds / 60) % 60);
    // const seconds = Math.floor(diffInSeconds % 60);
    // const milliseconds = Math.round(
    //   (diffInSeconds - Math.floor(diffInSeconds)) * 1000
    // );

    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    // check if difference is in years or months
    if (years === 0 && months === 0) {
      // show in days if no years / months
      if (days > 0) {
        if (days === 1) {
          message = days + " day";
        } else {
          message = days + " days";
        }
      } else if (hours > 0) {
        if (hours === 1) {
          message = hours + " hour";
        } else {
          message = hours + " hours";
        }
      } else {
        // show in minutes if no years / months / days
        if (minutes === 1) {
          message = minutes + " minute";
        } else {
          message = minutes + " minutes";
        }
      }
    } else if (years === 0 && months > 0) {
      // show in months if no years
      if (months === 1) {
        message = months + " month";
      } else {
        message = months + " months";
      }
    } else if (years > 0) {
      // show in years if years exist
      if (years === 1) {
        message = years + " year";
      } else {
        message = years + " years";
      }
    }

    return message + " ago";
  }
  hideNews(id) {
    console.log(id);
    this.hiddenData = localStorage.getItem("hiddenData")?.split(",");
    this.hiddenData.push(id);
    localStorage.setItem("hiddenData", this.hiddenData);
    this.updateState(this.state);
  }
  upVote(id, points) {
    // console.log(id, points);
    let res = [];
    this.upVotedData = JSON.parse(localStorage.getItem("upVoted") || "[]");
    if (this.upVotedData != null && this.upVotedData.length > 0) {
      this.upVotedData.forEach((data, i) => {
        if (data.id === id) {
          points = data.upVote;
          this.upVotedData.splice(i, 1);
        }
        this.state.res.forEach((element) => {
          if (element.objectID === id) {
            element.points = points + 1;
          }
          const obj = {
            ...element,
          };
          res.push(obj);
        });
      });
    } else {
      this.state.res.forEach((element) => {
        if (element.objectID === id) {
          element.points = points + 1;
        }
        const obj = {
          ...element,
        };
        res.push(obj);
      });
    }
    let count = points + 1;
    let obj = {
      id,
      upVote: count,
    };
    this.upVotedData.push(obj);
    localStorage.setItem("upVoted", JSON.stringify(this.upVotedData));
    // console.log(res);
    res = this.removeDuplicate(res);
    this.setState({ res });
    // console.log(this.state);
    this.sortByupVote(this.state.res);
  }
  loadDataForUpvote() {
    let res = [];
    this.upVotedData = JSON.parse(localStorage.getItem("upVoted") || "[]");
    if (this.upVotedData != null && this.upVotedData.length > 0) {
      this.upVotedData.forEach((ele) => {
        this.state.res.forEach((element) => {
          if (element.objectID === ele.id) {
            element.points = ele.upVote;
          }
          const obj = {
            ...element,
          };
          res.push(obj);
        });
      });
    }
    if (res.length !== 0) {
      res = this.removeDuplicate(res);
      return res;
    }
    return this.state.res;
  }
  removeDuplicate(data, key = "objectID") {
    return [...new Map(data.map((x) => [x[key], x])).values()];
  }
  openLink(url) {
    window.open(url, "_blank");
  }
  next() {
    // console.log(this);
    if (this.pageIndex <= this.totalRecords) {
      this.pageIndex++;
      this.loadData(this.pageIndex);
    }
  }
  prev() {
    if (this.pageIndex <= 1) {
      this.pageIndex = 1;
    } else this.pageIndex--;
    console.log(this.pageIndex);
    this.loadData(this.pageIndex);
  }
  render() {
    return (
      <Fragment>
        <table>
          <thead>
            <tr>
              {this.props.columns.map((c, index) => (
                <th key={index}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody id="tableBody">
            {this.state.res.length !== 0 ? (
              this.state.res.map((res, index) => (
                <tr key={index}>
                  <td>
                    {res.num_comments == null || res.num_comments === ""
                      ? "NA"
                      : res.num_comments}
                  </td>
                  <td>{res.points}</td>
                  <td>
                    <span onClick={() => this.upVote(res.objectID, res.points)}>
                      ^
                    </span>
                  </td>
                  <td>
                    <span>
                      {res.title == null || res.title === ""
                        ? "Not Available"
                        : res.title}
                    </span>
                    <span
                      className="link"
                      onClick={() => this.openLink(res.url)}
                    >
                      (
                      {res.url == null || res.url === ""
                        ? "Not Available"
                        : res.url}
                      )
                    </span>
                    <span className="author">
                      By <span style={this.styles}>{res.author}</span>
                    </span>
                    <span className="time">{this.getTime(res.created_at)}</span>
                    <span
                      className="hide"
                      onClick={() => this.hideNews(res.objectID)}
                    >
                      [hide]
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>Loading Data...</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="navigation">
          <p onClick={this.prev}>Previous</p>
          <span>|</span>
          <p onClick={this.next}>Next</p>
        </div>
        {this.state.res.length === 0 ? (
          "Loading Chart..."
        ) : (
          <Chart data={this.state.res} />
        )}
      </Fragment>
    );
  }
}

export default News;
