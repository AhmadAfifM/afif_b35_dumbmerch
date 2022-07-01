import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

// Import useMutation from react-query here ...
import { useMutation } from "react-query";

// Get API config here ...
import { API } from "../../config/api";

export default function Register() {
  let navigate = useNavigate();

  const title = "Register";
  document.title = "DumbMerch | " + title;

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);

  // Create variabel for store data with useState here ...
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const { name, email, password, re_password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create function for handle insert data process with useMutation here ...
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration Content-type
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Data body => Convert Object to String
      const body = JSON.stringify(form);

      // Insert data user to database
      const response = await API.post("/register", body, config);

      // Handling response here
      console.log(response.data.message);
    } catch (error) {
      if (password !== re_password) {
        const alert_password = (
          <Alert variant="warning" className="py-1">
            Password Doesn't Match!!!
          </Alert>
        );
        setMessage(alert_password);
      }
      // const alert = (
      //   <Alert variant="danger" className="py-1">
      //     Failed
      //   </Alert>
      // );
      // setMessage(alert);
      console.log(error);
    }
  });

  return (
    <div className="d-flex justify-content-center">
      <div className="card-auth p-4">
        <div
          style={{ fontSize: "36px", lineHeight: "49px", fontWeight: "700" }}
          className="mb-2"
        >
          Register
        </div>
        {message && message}
        <form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className="mt-3 form">
            <input
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={handleChange}
              className="px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
            <input
              type="password"
              placeholder="Retype - Password"
              value={re_password}
              name="re_password"
              onChange={handleChange}
              className="px-3 py-2 mt-3"
            />
          </div>
          <div className="d-grid gap-2 mt-5">
            <button type="submit" className="btn btn-login">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
