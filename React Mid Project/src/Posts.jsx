import React from 'react'

const Posts = ({ postTitle, postBody }) => {
    return (
        <div style={{border:"2px solid purple", marginBottom:"3px" }}>
        <strong style={{marginLeft: "4px"}}> Title: </strong> {postTitle} <br />
        <strong style={{marginLeft: "4px"}}> Body: </strong> {postBody} <br />
        </div>
      )
}

export default Posts