import{ useState } from "react"

export default function Index(){
    const [name,setName] = useState("");
   function handleClickName(){
    const inputName =document.getElementById("name").value;
    setName(inputName)

   }
    return(
        <>
        <p>
            hello ma name is {name}.</p>
            <input id="name" type="text" />
            
            <button onClick={handleClickName}>update name</button></>
    )
}
   