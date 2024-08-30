import { useEffect, useState, useRef } from "react";
import _debounce from "lodash/debounce";
import "../styles/home.css";
import Header from "../components/Header";
import { BiSearch } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";
import JobList from "../components/JobList";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listJob, listSkills } from "../reducer/jobSlice";
import {
  getAllJob,
  getAllSkillsAPI,
  getSkillAPI,
  searchJobAPI,
} from "../api/users";
import toast from "react-hot-toast";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(""); // Added state for the select value
  const user = useSelector((state) => state.user.userDetails);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const job = useSelector((state) => state.jobs.jobLists);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const handleSkills = (e) => {
    const value = e.target.value;
    if (!selectedSkills.includes(value) && value !== "") {
      setSelectedSkills([...selectedSkills, value]);
    }
    setSelectedSkill(value); // Update selected skill
  };

  // get all skills
  const getAllSkills = async () => {
    try {
      const response = await getAllSkillsAPI();
      setSkills(response.data);
      dispatch(listSkills(response.data));
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  // get all jobs
  const getAllJobs = async () => {
    if (job.length === 0) {
      try {
        const response = await getAllJob();
        dispatch(listJob(response.data));
        setJobs(response.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      setJobs(job);
    }
  };

  useEffect(() => {
    getAllJobs();
    getAllSkills();
  }, []);

  // get job related selected skills
  useEffect(() => {
    if (selectedSkills.length > 0) {
      getSkillAPI(selectedSkills)
        .then((response) => {
          setJobs(response.data);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            toast.error(err.response.data.message);
            navigate("/login");
          } else {
            toast.error(err.message);
          }
        });
    } else {
      setJobs(job);
    }
  }, [selectedSkills]);

  const debounceSearch = _debounce((value) => {
    if (value === "") {
      setJobs(job);
      return;
    }
    searchJobAPI(value)
      .then((results) => {
        setJobs(results.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 500);

  const handleSearchBar = () => {
    debounceSearch(searchRef.current.value);
  };

  return (
    <>
      <Header />
      <section className="home">
        <section className="home_search">
          <div className="home_search_box">
            <BiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Type any Job Title"
              className="search-input-box"
              ref={searchRef}
              onChange={handleSearchBar}
            />
          </div>

          <div className="home_skill">
            <div className="skill_section">
              <div className="skill_dropdown">
                <select
                  name=""
                  id=""
                  value={selectedSkill} // Controlled component
                  onChange={handleSkills}
                >
                  <option value="">Skills</option>
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
              <div className="skills_list">
                {selectedSkills.map((skill) => (
                  <span key={skill} value={skill}>
                    {skill}
                    <AiOutlineClose
                      className="close-icon"
                      onClick={() =>
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill)
                        )
                      }
                    />
                  </span>
                ))}
              </div>
            </div>
            <div>
              {loggedIn ? (
                <button
                  className="addJob_button"
                  onClick={() => navigate("/add-job")}
                >
                  <BiPlus className="icons" />
                  Add Job
                </button>
              ) : (
                <button
                  className="clear_button"
                  onClick={() => setSelectedSkills([])}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="clear-button-div">
            {loggedIn && selectedSkills.length > 0 && (
              <button
                className="clear_button"
                onClick={() => setSelectedSkills([])}
              >
                Clear
              </button>
            )}
          </div>
        </section>
      </section>

      {jobs.map((job) => (
        <JobList
          key={job._id}
          data={job}
          loggedIn={loggedIn}
          user_id={user ? user.id : null}
        />
      ))}
    </>
  );
};

export default Home;
