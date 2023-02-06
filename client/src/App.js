import PanelLayout from "./pages/panelLayout/PanelLayout";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  redirect,
} from "react-router-dom";
import Videos from "./components/main/videos/Videos";
import Comments from "../src/components/main/comments/Comments";
import Companies from "../src/components/main/companies/Companies";
import Actors from "../src/components/main/actors/Actors";
import Home from "../src/components/main/home/Home";
import Users from "../src/components/main/users/Users";
import Auth from "./pages/auth/Auth";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <Router>
      <Routes>
        <>
          <Route exact path="/" element={user ? <PanelLayout /> : <Auth />}>
            <Route index element={<Home />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </>
      </Routes>
    </Router>
  );
}

export default App;
