import React, { FC, useReducer } from "react";
import "./Registration.css";
import userReducer from "../../auth/common/UserReducer";
import { allowSubmit } from "../../auth/common/Helpers";
import PasswordComparison from "../../auth/common/PasswordComparison";
import { gql, useMutation } from "@apollo/client";

const RegisterMutation = gql`
  mutation register($email: String!, $userName: String!, $password: String!) {
    register(email: $email, userName: $userName, password: $password)
  }
`;

const Registration = () => {
  const [execRegister] = useMutation(RegisterMutation);
  const [
    { userName, password, email, passwordConfirm, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "davec",
    password: "",
    email: "admin@dzhaven.com",
    passwordConfirm: "",
    resultMsg: "",
    isSubmitDisabled: true,
  });

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "userName" });
    if (!e.target.value)
      allowSubmit(dispatch, "Username cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ payload: e.target.value, type: "email" });
    if (!e.target.value) allowSubmit(dispatch, "Email cannot be empty", true);
    else allowSubmit(dispatch, "", false);
  };

  const onClickRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      const result = await execRegister({
        variables: {
          email,
          userName,
          password,
        },
      });
      console.log("register result", result);
      dispatch({ payload: result.data.register, type: "resultMsg" });
    } catch (ex) {
      console.log(ex);
    }
  };


  return (
    <>
      <div className="form-container">
        <form>
          <div className="reg-inputs">
            <div>
              <label>username</label>
              <input type="text" value={userName} onChange={onChangeUserName} />
            </div>
            <div>
              <label>email</label>
              <input type="text" value={email} onChange={onChangeEmail} />
            </div>
            <div>
              <PasswordComparison
                dispatch={dispatch}
                password={password}
                passwordConfirm={passwordConfirm}
              />
            </div>
          </div>
          <div className="form-buttons">
            <div className="form-btn-left">
              <button
                style={{ marginLeft: ".5em" }}
                className="action-btn"
                disabled={isSubmitDisabled}
                onClick={onClickRegister}
              >
                Register
              </button>

            </div>
            <div className="form-valid-message">
              <span>
               {resultMsg}
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registration;
