// Packages
import React, { useState, useEffect } from "react"
import { Redirect } from "react-router-dom"

const Signup = props => {
  let [email, setEmail] = useState("")
  let [firstname, setFirstname] = useState("")
  let [lastname, setLastname] = useState("")
  let [message, setMessage] = useState("")
  let [password, setPassword] = useState("")

  useEffect(() => {
    setMessage("")
  }, [email, firstname, lastname, password])

  const handleSubmit = e => {
    e.preventDefault()
    fetch(`/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (!response.ok) {
        console.log(response)
        setMessage(`${response.status}: ${response.statusText}`)
        return
      }

      response.json().then(result => {
        props.updateUser(result.token)
      })
    })
  }

  if (props.user) {
    return <Redirect to="/profile" />
  }

  return (
    <div>
      <h2>Signup</h2>
      <span className="red">{message}</span>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            name="firstname"
            placeholder="Your first name"
            onChange={e => setFirstname(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            name="lastname"
            placeholder="Your last name"
            onChange={e => setLastname(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Sign Me Up!</button>
      </form>
    </div>
  )
}

export default Signup
