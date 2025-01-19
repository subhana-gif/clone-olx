import {createContext, useState} from 'react'

export const PostContext = createContext(null)

function Post({children}){
    const [postDetails,setPostDetails]=useState();
    const [searchQuery, setSearchQuery] = useState("");

     return (
        <PostContext.Provider value={{postDetails,setPostDetails ,searchQuery, setSearchQuery}}>
        {children}
        </PostContext.Provider>
     )
}

export default Post