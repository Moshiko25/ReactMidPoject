import React from "react";

const ExtraData = ({ showExtraData, setNewUserData, setCancelButtonClick }) => (
  <>
    {showExtraData ? (
      <div style={{
        border: "2px solid black",
        marginTop: "3%",
        padding: "3%"
      }}>
        <strong> Street: </strong>
        <input
          onChange={(e) => setNewUserData((prevData) => ({ ...prevData, street: e.target.value }))}
        />
        <br />
        <strong> City: </strong>
        <input
          onChange={(e) => setNewUserData((prevData) => ({ ...prevData, city: e.target.value }))}
        />
        <br />
        <strong> Zip Code: </strong>
        <input
          onChange={(e) => setNewUserData((prevData) => ({ ...prevData, zipcode: e.target.value }))}
        />
        <br />
      </div>
    ) : null}
  </>
);

export default ExtraData;