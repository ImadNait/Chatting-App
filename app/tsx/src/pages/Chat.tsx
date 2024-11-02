

export default function Chat(){



    return(<>
        <div id="message-cont"></div>
        <form id="form">
        <label htmlFor="message-input">Message</label>
        <input type="text" name="" id="msgIn" placeholder="send something" />
        <button id="sendButton">Send</button><br>
        <label htmlFor="room-input">Room</label>
        <input type="text" id="roomIn"  placeholder="join someone"/>
        <button id="roomButton">Join</button>
        </form>
    </>);
}
