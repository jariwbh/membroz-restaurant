import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class SignalRController {
    constructor(props) {
        this.rConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:44329/messageHub")
            .configureLogging(LogLevel.Information)
            .build();

        this.rConnection.start()
            .catch(err => {
                console.log('connection error');
            });
    }

    registerReceiveEvent = (callback) => {
        this.rConnection.on("ReceiveMessage", function (message) {
            //console.log(message);
            callback(message);
        });
    }
 
    sendMessage = (message) => {
        return this.rConnection.invoke("SendMessage", message)
            .catch(function (data) {
                alert('cannot connect to the server');
            });
    }
}

const SignalRService = new SignalRController();
export default SignalRService;