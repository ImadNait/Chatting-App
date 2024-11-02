

export default function Chat(){
    const joinButton = document.getElementById('roomButton') as HTMLButtonElement
    const messageInp = document.getElementById('msgIn') as HTMLInputElement
    const roomInp = document.getElementById('roomIn') as HTMLInputElement
    const form = document.getElementById('form') as HTMLFormElement




    form?.addEventListener("submit", e=>{
        e.preventDefault()
        const message = messageInp.value
        const room = roomInp.value
        if(message==="") return displayMsg(message)
    })

    joinButton.addEventListener("click", ()=>{
        const room = roomInp.value
    })
    function displayMsg(message=messageInp.value) {
        const div = document.createElement('div')
        div.textContent = message
        document.getElementById('message-cont')?.append(div)

    }

    return(<>
    <div className="app">
        <div id="message-cont"></div>
        <form id="form">
        <label htmlFor="message-input">Message</label>
        <input type="text" name="" id="msgIn" placeholder="send something" />
<<<<<<< HEAD
        <button id="sendButton">Send</button>
        <br />
=======
        <button id="sendButton">Send</button><br>
>>>>>>> c0a8c0d730ec6da576dedcc7ae19d4fe3a4ed77a
        <label htmlFor="room-input">Room</label>
        <input type="text" id="roomIn"  placeholder="join someone"/>
        <button id="roomButton">Join</button>
        </form>
    </div>    
    </>);
}
