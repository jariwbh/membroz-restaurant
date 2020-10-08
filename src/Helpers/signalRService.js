import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from '../Helpers/axiosInst'

// .withUrl("https://localhost:44329/messageHub")
//.withUrl("http://localhost:51820/message")
class SignalRController {

    constructor(props) {
        // this.URL = 'http://local.signalrtalk.membroz.com/';
        this.URL = 'http://demo.membroz.com/';

        this.rConnection = new HubConnectionBuilder()
            .withUrl(this.URL + "message")
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
        //console.log('URL', this.URL)
        const body = JSON.stringify({
            message: message
        })
        return axios.post(this.URL + "api/message", body);

        // return this.rConnection.invoke("SendMessage", message)
        //     .catch(function (data) {
        //         alert('cannot connect to the server');
        //     });
    }
}

const SignalRService = new SignalRController();
export default SignalRService;