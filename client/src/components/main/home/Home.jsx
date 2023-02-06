import axios from "axios";
import React from "react";
import "./home.scss";
import {
  LineChart,
  Line,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";

function Home() {
  const [counts, setCounts] = React.useState({
    videos: 0,
    actors: 0,
    companies: 0,
  });

  React.useEffect(() => {
    axios.get("http://localhost:5000/api/company/get").then((res) => {
      console.log(res.data);
      setCounts((prev) => ({
        ...prev,
        companies: res.data.companies.length,
      }));
    });
    axios.get("http://localhost:5000/api/actor/get").then((res) => {
      console.log(res.data);
      setCounts((prev) => ({
        ...prev,
        actors: res.data.actors.length,
      }));
    });

    axios.get("http://localhost:5000/api/video/get").then((res) => {
      console.log(res.data);
      setCounts((prev) => ({
        ...prev,
        videos: res.data.videos.length,
      }));
    });
    axios.get("http://localhost:5000/api/user/stats").then((res) => {
      console.log(res.data);
      setCounts((prev) => ({
        ...prev,
        stats: res.data,
      }));
    });
  }, []);

  return (
    <div className="home_container">
      <LineChart
        width={1590}
        height={400}
        data={counts.stats}
        margin={{ top: 5, right: 20, bottom: 5, left: -20 }}
      >
        <Line type="monotone" dataKey="count" stroke="#ffa31a8f" />
        <CartesianGrid stroke="#cccccc3b" strokeDasharray="5 5" />
        <XAxis dataKey="_id" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "#242526",
            color: "#ffa31a",
            outline: "none",
          }}
          itemStyle={{ color: "#ffffff" }}
          cursor={{ stroke: "#cccccc6c", strokeWidth: 1 }}
        />
      </LineChart>

      <div className="card_wrapper">
        <Link to="/videos">
          <div className="card">
            <i
              className="fas fa-video"
              style={{ color: "#ffa31a", fontSize: "3rem" }}
            ></i>
            <span>Videos {counts.videos}</span>
          </div>
        </Link>

        <Link to="/actors">
          <div className="card">
            <i
              className="fas fa-users"
              style={{ color: "#ffa31a", fontSize: "3rem" }}
            ></i>
            <span>Actors {counts.actors}</span>
          </div>
        </Link>
        <Link to="/companies">
          <div className="card">
            <i
              className="fas fa-building"
              style={{ color: "#ffa31a", fontSize: "3rem" }}
            ></i>
            <span>Companies {counts.companies}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
